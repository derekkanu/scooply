// Generates Scooply's illustrations — "futuristic newspaper".
//
//   bun scripts/illustrations.ts                   # engraving (default)
//   bun scripts/illustrations.ts --style=dots      # dotted contours
//   bun scripts/illustrations.ts --style=contour   # continuous contour lines
//   bun scripts/illustrations.ts --style=dither    # dithered pixels
//
// Each object is modelled in 3D with signed distance fields. Four ways to print it:
//  - engrave: a vintage engraving — bold outlines, hatching that wraps the form and thickens
//    in shadow, crosshatching in the deepest shadow, light stipple in the half-tones and a
//    hatched cast shadow. Monochrome ink on a transparent ground.
//  - dots: the contour drawing below, but every line is set as a row of small square dots at
//    an even pitch — the same construction as the Scooply mark's rings of squares.
//  - contour: the object is sliced into evenly spaced lines that wrap its form (like a
//    topographic map), plus its outline and creases. Rendered at 2× and anti-aliased.
//  - dither: lit by a soft key light from the upper left (soft shadows, ambient occlusion),
//    then Atkinson-dithered onto a fine square-pixel grid.
//
// Output: alpha-mask PNGs in public/illustrations/ (tinted in CSS so they follow the theme)
// and src/components/illustrations/sprites.ts listing the layers.

import { deflateSync } from 'node:zlib'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT_DIR = join(ROOT, 'public/illustrations')
const MANIFEST = join(ROOT, 'src/components/illustrations/sprites.ts')
const CELL = 3 // output pixels per grid pixel (dither style)
const STYLE: 'engrave' | 'dots' | 'contour' | 'dither' = process.argv.includes('--style=dither')
  ? 'dither'
  : process.argv.includes('--style=contour')
    ? 'contour'
    : process.argv.includes('--style=dots')
      ? 'dots'
      : 'engrave'
const LINE_STYLE = STYLE !== 'dither'
// dot geometry at 2× render scale: square size and pitch along a line (output px = half)
// round dots at 2× render scale: radius range (light → dark) and pitch along a line
const DOT = { pitch: 16, radius: { min: 1.1, max: 7.2 } }
// dots need fewer, wider-spaced slices than continuous lines to stay as airy as the mark
const DOT_SPACING = 1.6
const CONTOUR_SIZE = 300 // output px for each object in contour style
const HALFTONE_SIZE = 600 // output px for each object in the halftone style (2× for sharp dots)
const ENGRAVE_SIZE = 480 // output px for each object in the engraving style

type Ink = 'ink' | 'muted' | 'accent' | 'gold' | 'paper' | 'tide' | 'bloom' | 'sun' | 'tone0' | 'tone1' | 'tone2' | 'tone3' | 'tone4' | 'tone5' | 'shadow'
type Motion = 'steam'

/* ── Vector maths ─────────────────────────────────────────────────────────── */

type V = [number, number, number]
const v = (x: number, y: number, z: number): V => [x, y, z]
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V, s: number): V => [a[0] * s, a[1] * s, a[2] * s]
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const len = (a: V) => Math.hypot(a[0], a[1], a[2])
const norm = (a: V): V => mul(a, 1 / (len(a) || 1))
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const hash = (i: number, j = 0) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return s - Math.floor(s)
}
const rotX = (p: V, a: number): V => [p[0], p[1] * Math.cos(a) - p[2] * Math.sin(a), p[1] * Math.sin(a) + p[2] * Math.cos(a)]
const rotZ = (p: V, a: number): V => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a), p[2]]

/* ── Distance functions ───────────────────────────────────────────────────── */

const sdSphere = (p: V, r: number) => len(p) - r
function sdBox(p: V, b: V) {
  const q: V = [Math.abs(p[0]) - b[0], Math.abs(p[1]) - b[1], Math.abs(p[2]) - b[2]]
  return len([Math.max(q[0], 0), Math.max(q[1], 0), Math.max(q[2], 0)]) + Math.min(Math.max(q[0], q[1], q[2]), 0)
}
const sdRoundBox = (p: V, b: V, r: number) => sdBox(p, [b[0] - r, b[1] - r, b[2] - r]) - r
/** Capped cylinder along an axis: 'y' (upright) or 'z' (toward the camera). */
function sdCyl(p: V, r: number, h: number, axis: 'y' | 'z' = 'y') {
  const [a, b, c] = axis === 'y' ? [p[0], p[2], p[1]] : [p[0], p[1], p[2]]
  const dx = Math.hypot(a, b) - r
  const dy = Math.abs(c) - h
  return Math.min(Math.max(dx, dy), 0) + Math.hypot(Math.max(dx, 0), Math.max(dy, 0))
}
const sdTorusY = (p: V, R: number, r: number) => Math.hypot(Math.hypot(p[0], p[2]) - R, p[1]) - r
const sdTorusZ = (p: V, R: number, r: number) => Math.hypot(Math.hypot(p[0], p[1]) - R, p[2]) - r
function sdCapsule(p: V, a: V, b: V, r: number) {
  const pa = sub(p, a)
  const ba = sub(b, a)
  const h = clamp(dot(pa, ba) / dot(ba, ba))
  return len(sub(pa, mul(ba, h))) - r
}

/* ── Renderer ─────────────────────────────────────────────────────────────── */

interface Material {
  albedo: (p: V) => number
  spec?: number
  shine?: number
  ink?: Ink // which layer its pixels land on
  /** albedo carries printed marks (type, rules, pictures) that an engraving prints as solid ink */
  textured?: boolean
  /** glass: shows the surface below, magnified around `center` */
  lens?: { center: V; power: number; below: (p: V) => number }
}
interface Hit {
  d: number
  m: number
}
interface Scene {
  id: string
  w: number
  h: number
  map: (p: V) => Hit
  materials: Material[]
  /** y of an invisible, shadow-catching floor; very negative for none */
  ground: number
  cam: { ro: V; ta: V; fov: number }
  /** extra 2D layers drawn on top (e.g. steam), in unit coordinates */
  overlays?: { tone: (x: number, y: number) => number; ink?: Ink; motion?: Motion; delay?: number }[]
  /** gamma on ink coverage: >1 lightens midtones */
  gamma?: number
}

const LIGHT = norm(v(-0.55, 0.85, 0.5))

function render(scene: Scene) {
  const { w, h, map, materials, ground, cam } = scene
  const L = LIGHT
  const fw = norm(sub(cam.ta, cam.ro))
  const rt = norm(cross(fw, v(0, 1, 0)))
  const up = cross(rt, fw)
  const f = 1 / Math.tan((cam.fov * Math.PI) / 360)
  const aspect = w / h

  const world = (p: V): Hit => {
    const hit = map(p)
    const g = p[1] - ground
    return g < hit.d ? { d: g, m: -1 } : hit
  }
  const normal = (p: V): V => {
    const e = 0.0015
    return norm([
      world(add(p, [e, 0, 0])).d - world(sub(p, [e, 0, 0])).d,
      world(add(p, [0, e, 0])).d - world(sub(p, [0, e, 0])).d,
      world(add(p, [0, 0, e])).d - world(sub(p, [0, 0, e])).d,
    ])
  }
  const march = (ro: V, rd: V): { t: number; m: number } | null => {
    let t = 0
    for (let i = 0; i < 220 && t < 30; i++) {
      const hit = world(add(ro, mul(rd, t)))
      if (hit.d < 0.0012 * (1 + t)) return { t, m: hit.m }
      t += hit.d * 0.8
    }
    return null
  }
  const softShadow = (ro: V, rd: V) => {
    let res = 1
    let t = 0.02
    for (let i = 0; i < 64 && t < 8; i++) {
      const d = map(add(ro, mul(rd, t))).d
      if (d < 0.0008) return 0
      res = Math.min(res, (10 * d) / t)
      t += clamp(d, 0.01, 0.25)
    }
    return clamp(res)
  }
  const ao = (p: V, n: V) => {
    let occ = 0
    let sca = 1
    for (let i = 1; i <= 5; i++) {
      const hh = 0.02 + 0.06 * i
      occ += (hh - world(add(p, mul(n, hh))).d) * sca
      sca *= 0.75
    }
    return clamp(1 - 2.2 * occ)
  }

  // ink coverage and layer per pixel, 2×2 supersampled
  const tone = new Float32Array(w * h)
  const layer: Ink[] = new Array(w * h).fill('ink')
  const covered = new Uint8Array(w * h)
  const solid = new Uint8Array(w * h) // pixels where an object (not the floor) was hit
  const SS = 2
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      let acc = 0
      let hits = 0
      let objectHits = 0
      const votes: Partial<Record<Ink, number>> = {}
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const u = (((i + (sx + 0.5) / SS) / w) * 2 - 1) * Math.min(1, aspect)
          const vv = (1 - ((j + (sy + 0.5) / SS) / h) * 2) * Math.min(1, 1 / aspect)
          const rd = norm(add(add(mul(rt, u), mul(up, vv)), mul(fw, f)))
          const hit = march(cam.ro, rd)
          if (!hit) continue
          const p = add(cam.ro, mul(rd, hit.t))
          const n = normal(p)
          const sh = softShadow(add(p, mul(n, 0.01)), L)
          if (hit.m === -1) {
            // invisible floor: only its shadow prints
            const ink = (1 - sh * ao(p, n)) * 0.32
            if (ink > 0.02) {
              acc += ink
              hits++
              votes.ink = (votes.ink ?? 0) + 1
            }
            continue
          }
          objectHits++
          const mat = materials[hit.m]
          const diff = Math.max(0, dot(n, L)) * sh
          const occ = ao(p, n)
          let alb = mat.albedo(p)
          if (mat.lens) {
            const { center, power, below } = mat.lens
            alb = below([center[0] + (p[0] - center[0]) / power, p[1], center[2] + (p[2] - center[2]) / power]) * 0.97
          }
          const refl = sub(mul(n, 2 * dot(n, L)), L)
          const spec = (mat.spec ?? 0) * Math.pow(Math.max(0, dot(refl, mul(rd, -1))), mat.shine ?? 24) * sh
          const lum = mat.lens ? alb * (0.55 + 0.45 * diff) + spec : alb * (0.2 * occ + 0.8 * diff) + 0.08 * occ * alb + spec
          // a faint floor tone and a soft rim keep every silhouette defined, even where it's lit
          const edge = 1 - Math.abs(dot(n, rd))
          acc += clamp(Math.max(clamp(1 - lum), 0.07) + 0.55 * edge ** 4)
          hits++
          const ink = mat.ink ?? 'ink'
          votes[ink] = (votes[ink] ?? 0) + 1
        }
      }
      if (!hits) continue
      const k = j * w + i
      covered[k] = 1
      if (objectHits >= 2) solid[k] = 1
      tone[k] = Math.pow(acc / (SS * SS), scene.gamma ?? 1.15)
      let best: Ink = 'ink'
      let bestN = 0
      for (const [ink, nVotes] of Object.entries(votes) as [Ink, number][]) if (nVotes > bestN) [best, bestN] = [ink, nVotes]
      layer[k] = best
    }
  }
  return { tone, layer, covered, solid }
}

/* ── Dither + PNG ─────────────────────────────────────────────────────────── */

/** Atkinson error diffusion: clean whites, crisp darks, 3/4 of the error carried. */
function atkinson(tone: Float32Array, w: number, h: number) {
  const buf = Float32Array.from(tone)
  const out = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x
      const on = buf[k] >= 0.5
      out[k] = on ? 1 : 0
      const err = (buf[k] - (on ? 1 : 0)) / 8
      for (const [dx, dy] of [[1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]]) {
        const xx = x + dx
        const yy = y + dy
        if (xx >= 0 && xx < w && yy < h) buf[yy * w + xx] += err
      }
    }
  }
  return out
}

const CRC = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
function crc32(buf: Uint8Array) {
  let c = 0xffffffff
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type: string, data: Uint8Array) {
  const out = new Uint8Array(12 + data.length)
  const dv = new DataView(out.buffer)
  dv.setUint32(0, data.length)
  out.set(new TextEncoder().encode(type), 4)
  out.set(data, 8)
  dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)))
  return out
}
function pngMask(gw: number, gh: number, on: (i: number, j: number) => boolean | number, cell = CELL) {
  const W = gw * cell
  const H = gh * cell
  const raw = new Uint8Array(H * (1 + W * 2))
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const a = on(Math.floor(x / cell), Math.floor(y / cell))
      raw[y * (1 + W * 2) + 1 + x * 2 + 1] = a === true ? 255 : a === false ? 0 : Math.round(clamp(a) * 255)
    }
  }
  const ihdr = new Uint8Array(13)
  const dv = new DataView(ihdr.buffer)
  dv.setUint32(0, W)
  dv.setUint32(4, H)
  ihdr.set([8, 4, 0, 0, 0], 8)
  const parts = [
    new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', new Uint8Array()),
  ]
  const png = new Uint8Array(parts.reduce((n, p) => n + p.length, 0))
  let o = 0
  for (const p of parts) {
    png.set(p, o)
    o += p.length
  }
  return png
}

/* ── Textures ─────────────────────────────────────────────────────────────── */

/** Newsprint: masthead, rules, headline, a halftone picture and columns of type. */
function newsprint(x: number, z: number, W: number, D: number) {
  const u = (x + W) / (2 * W)
  const t = (z + D) / (2 * D) // 0 = top of the page
  if (u < 0.06 || u > 0.94 || t < 0.06 || t > 0.95) return 0.97
  if (t < 0.15) return u > 0.18 && u < 0.82 ? 0.1 : 0.97 // masthead
  if (Math.abs(t - 0.175) < 0.006 || Math.abs(t - 0.19) < 0.003) return 0.2 // double rule
  if (t > 0.22 && t < 0.27) return u < 0.78 ? 0.25 : 0.97 // headline
  if (t > 0.29 && t < 0.31) return u < 0.55 ? 0.45 : 0.97 // deck
  if (u < 0.5 && t > 0.35 && t < 0.62) {
    // picture: a little lit sphere
    const dx = (u - 0.27) / 0.12
    const dy = (t - 0.48) / 0.1
    const r = Math.hypot(dx, dy)
    return r < 1 ? 0.25 + 0.6 * smooth(-0.6, 0.9, -dx * 0.6 - dy * 0.5 + (1 - r) * 0.4) : 0.86
  }
  const col = u < 0.5 ? 0 : u < 0.72 ? 1 : 2
  if (Math.abs(u - 0.5) < 0.02 || Math.abs(u - 0.72) < 0.02) return 0.97
  if (col === 0 && t < 0.66) return 0.97
  const row = Math.floor((t - 0.35) / 0.04)
  if ((t - 0.35) % 0.04 < 0.014 && !(hash(row, col) > 0.82 && u % 0.22 > 0.15)) return 0.72
  return 0.97
}

/* ── Scenes ───────────────────────────────────────────────────────────────── */

function sphereScene(id: string, size: number, withGround: boolean): Scene {
  return {
    id,
    w: size,
    h: size,
    map: (p) => ({ d: sdSphere(sub(p, v(0, 1, 0)), 1), m: 0 }),
    materials: [{ albedo: () => 0.95, spec: 0.35, shine: 42 }],
    ground: withGround ? 0 : -1e9,
    cam: { ro: v(0, 1.25, 6.2), ta: v(0, withGround ? 0.82 : 1, 0), fov: withGround ? 30 : 21 },
  }
}

function book(): Scene {
  const W = 1.35
  const D = 0.95
  const top = (x: number) => 0.06 + 0.26 * Math.sin(Math.PI * clamp(Math.abs(x) / W))
  const pageAlbedo = (p: V) => {
    const ax = Math.abs(p[0])
    if (ax < 0.16 || ax > W - 0.13 || Math.abs(p[2]) > D - 0.17) return 0.97
    const row = Math.floor((p[2] + D) / 0.1)
    const end = W - 0.13 - (hash(row, p[0] > 0 ? 1 : 0) > 0.7 ? 0.35 : 0)
    return (p[2] + D) % 0.1 < 0.026 && ax < end ? 0.7 : 0.97
  }
  return {
    id: 'book',
    w: 128,
    h: 128,
    map: (p) => {
      const pages = Math.max((p[1] - top(p[0])) * 0.55, -p[1], Math.abs(p[0]) - W, Math.abs(p[2]) - D)
      const cover = sdRoundBox(sub(p, v(0, -0.035, 0)), v(W + 0.07, 0.035, D + 0.05), 0.02)
      const ribbon = sdBox(sub(p, v(0.28, 0.004, D + 0.2)), v(0.035, 0.004, 0.22))
      let best: Hit = { d: pages, m: 0 }
      if (cover < best.d) best = { d: cover, m: 1 }
      if (ribbon < best.d) best = { d: ribbon, m: 2 }
      return best
    },
    materials: [
      { albedo: pageAlbedo, spec: 0.05, shine: 12, textured: true },
      { albedo: () => 0.22, spec: 0.2, shine: 20 },
      { albedo: () => 0.5, ink: 'accent' },
    ],
    ground: -0.07,
    cam: { ro: v(0, 3.7, 3.4), ta: v(0, 0.05, 0.15), fov: 42 },
  }
}

function magnifier(): Scene {
  const SW = 1.75
  const SD = 1.25
  const C = v(-0.25, 0.16, -0.08)
  const R = 0.62
  const a = 0.62 // handle direction, radians from +x toward +z
  const h0 = v(C[0] + Math.cos(a) * (R + 0.06), C[1], C[2] + Math.sin(a) * (R + 0.06))
  const h1 = v(C[0] + Math.cos(a) * (R + 1.05), C[1] + 0.06, C[2] + Math.sin(a) * (R + 1.05))
  const dir = norm(sub(h1, h0))
  const sheet = (p: V) => newsprint(p[0], p[2], SW, SD)
  return {
    id: 'magnifier',
    w: 128,
    h: 128,
    map: (p) => {
      let best: Hit = { d: sdBox(sub(p, v(0, -0.01, 0)), v(SW, 0.01, SD)), m: 0 }
      const take = (d: number, m: number) => {
        if (d < best.d) best = { d, m }
      }
      take(sdCyl(sub(p, C), R - 0.02, 0.012), 1)
      take(sdTorusY(sub(p, C), R, 0.065), 2)
      take(sdCapsule(p, h0, add(h0, mul(dir, 0.18)), 0.055), 2)
      take(sdCapsule(p, add(h0, mul(dir, 0.2)), h1, 0.095), 3)
      return best
    },
    materials: [
      { albedo: sheet, spec: 0.03, textured: true },
      { albedo: sheet, spec: 1.1, shine: 70, lens: { center: C, power: 1.7, below: sheet }, textured: true },
      { albedo: () => 0.55, spec: 0.9, shine: 40 },
      { albedo: () => 0.14, spec: 0.5, shine: 26 },
    ],
    ground: -0.03,
    cam: { ro: v(0.3, 4.3, 3.2), ta: v(0.1, 0, 0.12), fov: 42 },
  }
}

function binoculars(): Scene {
  const barrels = [-0.42, 0.42]
  return {
    id: 'binoculars',
    w: 128,
    h: 128,
    map: (p) => {
      let best: Hit = { d: 1e9, m: 0 }
      const take = (d: number, m: number) => {
        if (d < best.d) best = { d, m }
      }
      for (const x of barrels) {
        const q = sub(p, v(x, 0.36, 0))
        take(Math.max(sdCyl(q, 0.36, 0.55, 'z'), -sdCyl(sub(q, v(0, 0, 0.56)), 0.29, 0.05, 'z')), 0)
        take(sdCyl(sub(q, v(0, 0, 0.47)), 0.37, 0.03, 'z'), 1)
        take(sdCyl(sub(q, v(0, 0, 0.5)), 0.285, 0.004, 'z'), 2)
        take(sdCyl(sub(q, v(0, 0.02, -0.72)), 0.2, 0.18, 'z'), 1)
      }
      take(sdRoundBox(sub(p, v(0, 0.5, -0.05)), v(0.2, 0.07, 0.32), 0.04), 1)
      take(sdCyl(sub(p, v(0, 0.5, 0.05)), 0.09, 0.42, 'z'), 0)
      return best
    },
    materials: [
      { albedo: () => 0.78, spec: 0.3, shine: 18 },
      { albedo: () => 0.5, spec: 0.5, shine: 30 },
      { albedo: () => 0.1, spec: 1.4, shine: 90 },
    ],
    ground: 0,
    cam: { ro: v(1.8, 1.75, 3.9), ta: v(0, 0.36, 0), fov: 36 },
  }
}

function box(): Scene {
  const B = v(0.72, 0.48, 0.58)
  const T = 0.012
  const flap = (p: V, hinge: V, axis: 'x' | 'z', angle: number, along: V, size: V) => {
    let q = sub(p, hinge)
    q = axis === 'x' ? rotX(q, angle) : rotZ(q, angle)
    return sdBox(sub(q, along), size)
  }
  return {
    id: 'box',
    w: 128,
    h: 128,
    map: (p) => {
      let best: Hit = { d: 1e9, m: 0 }
      const take = (d: number, m: number) => {
        if (d < best.d) best = { d, m }
      }
      take(Math.max(sdBox(sub(p, v(0, B[1], 0)), B), -sdBox(sub(p, v(0, B[1] + 0.04, 0)), v(B[0] - 0.025, B[1], B[2] - 0.025))), 0)
      take(flap(p, v(0, 2 * B[1], B[2]), 'x', 0.75, v(0, 0.26, 0), v(B[0], 0.26, T)), 0)
      take(flap(p, v(0, 2 * B[1], -B[2]), 'x', -0.6, v(0, 0.26, 0), v(B[0], 0.26, T)), 0)
      take(flap(p, v(B[0], 2 * B[1], 0), 'z', -0.7, v(0, 0.2, 0), v(T, 0.2, B[2])), 0)
      take(flap(p, v(-B[0], 2 * B[1], 0), 'z', 0.7, v(0, 0.2, 0), v(T, 0.2, B[2])), 0)
      take(sdCapsule(p, v(0, 0.2, -0.05), v(-0.18, 1.42, -0.2), 0.14), 1)
      take(sdBox(sub(p, v(0, 0.78, B[2] + 0.002)), v(0.1, 0.18, 0.004)), 2)
      return best
    },
    materials: [
      { albedo: () => 0.84, spec: 0.04 },
      { albedo: () => 0.97, spec: 0.08 },
      { albedo: () => 0.55, ink: 'gold' },
    ],
    ground: 0,
    cam: { ro: v(2.9, 2.9, 4.1), ta: v(0, 0.7, 0), fov: 36 },
  }
}

function mug(): Scene {
  const H = 0.6
  return {
    id: 'mug',
    w: 128,
    h: 128,
    map: (p) => {
      let best: Hit = { d: 1e9, m: 0 }
      const take = (d: number, m: number) => {
        if (d < best.d) best = { d, m }
      }
      const outer = sdCyl(sub(p, v(0, H, 0)), 0.58, H) - 0.02
      const inner = sdCyl(sub(p, v(0, H + 0.2, 0)), 0.51, H)
      take(Math.max(outer, -inner), 0)
      take(Math.max(sdTorusZ(sub(p, v(0.6, 0.66, 0)), 0.27, 0.07), 0.58 - p[0]), 0)
      take(sdCyl(sub(p, v(0, 1.02, 0)), 0.51, 0.005), 1)
      return best
    },
    materials: [
      { albedo: (p) => (p[1] > 0.22 && p[1] < 0.3 && Math.hypot(p[0], p[2]) > 0.55 ? 0.45 : 0.95), spec: 0.6, shine: 48, textured: true },
      { albedo: () => 0.12, spec: 1.2, shine: 80 },
    ],
    ground: 0,
    cam: { ro: v(1.3, 2.4, 4.0), ta: v(0.1, 0.72, 0), fov: 38 },
    overlays: [0, 1, 2].map((k) => ({
      motion: 'steam' as Motion,
      delay: k * 0.7,
      ink: 'muted' as Ink,
      tone: (x: number, y: number) => {
        const cx = 0.4 + k * 0.08 + 0.025 * Math.sin(y * 28 + k * 2)
        const fade = smooth(0.06, 0.16, y) * smooth(0.3, 0.2, y)
        return y > 0.06 && y < 0.3 ? clamp(1 - Math.abs(x - cx) / 0.012) * fade * 0.9 : 0
      },
    })),
  }
}

function paper(): Scene {
  const W = 1.3
  const D = 0.95
  const top = (x: number, z: number) => 0.025 + 0.12 * Math.pow(Math.max(0, x - 0.35) / (W - 0.35), 2) + 0.02 * Math.sin(z * 2)
  return {
    id: 'paper',
    w: 128,
    h: 128,
    map: (p) => {
      const sheet = Math.max((Math.abs(p[1] - top(p[0], p[2])) - 0.012) * 0.6, Math.abs(p[0]) - W, Math.abs(p[2]) - D)
      const marker = sdBox(sub(p, v(0.88, top(0.88, -0.78) + 0.004, -0.78)), v(0.06, 0.006, 0.05))
      return marker < sheet ? { d: marker, m: 1 } : { d: sheet, m: 0 }
    },
    materials: [
      { albedo: (p) => newsprint(p[0], p[2], W, D), spec: 0.04, textured: true },
      { albedo: () => 0.5, ink: 'accent' },
    ],
    ground: 0,
    cam: { ro: v(0.4, 4.1, 3.2), ta: v(0, 0, 0.12), fov: 41 },
  }
}

/* ── Contour renderer ─────────────────────────────────────────────────────── */

/** How each object is sliced: the axis the slices are perpendicular to, and their spacing. */
const CONTOURS: Record<string, { axis: V; spacing: number }> = {
  sphere: { axis: v(0.12, 1, 0.08), spacing: 0.075 },
  'masthead-sphere': { axis: v(0.12, 1, 0.08), spacing: STYLE === 'dots' ? 0.06 : 0.075 },
  book: { axis: v(1, 0.12, 0), spacing: 0.085 },
  magnifier: { axis: v(0.35, 1, 0.55), spacing: 0.1 },
  binoculars: { axis: v(0, 0.05, 1), spacing: 0.085 },
  box: { axis: v(0, 1, 0), spacing: 0.062 },
  mug: { axis: v(0, 1, 0), spacing: 0.056 },
  paper: { axis: v(1, 0.1, 0.22), spacing: 0.09 },
}

/**
 * Sets 1-px lines as rows of round dots at an even pitch, like the rings of the Scooply mark.
 * Each dot's size and opacity come from `weightAt` (0 = small and light, 1 = full and solid),
 * which is how light and structure read — a halftone screen drawn along the contours.
 * Lines are traced end to end (endpoints first, then closed loops) so spacing stays even;
 * a minimum distance between dots keeps junctions from clumping. Dots are anti-aliased.
 */
function dotify(
  line: Uint8Array,
  w: number,
  h: number,
  inkAt: (k: number) => Ink,
  pitch = DOT.pitch,
  weightAt: (k: number) => number = () => 1,
  radius = DOT.radius,
) {
  const out = new Map<Ink, Float32Array>()
  const visited = new Uint8Array(w * h)
  const minDist = pitch * 0.7
  const cellSize = Math.ceil(minDist)
  const gw = Math.ceil(w / cellSize)
  const grid = new Map<number, [number, number][]>()
  const N8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
  const deg = (x: number, y: number) => {
    let n = 0
    for (const [dx, dy] of N8) {
      const xx = x + dx
      const yy = y + dy
      if (xx >= 0 && yy >= 0 && xx < w && yy < h && line[yy * w + xx]) n++
    }
    return n
  }
  const place = (x: number, y: number) => {
    const cx = Math.floor(x / cellSize)
    const cy = Math.floor(y / cellSize)
    for (let oy = -1; oy <= 1; oy++)
      for (let ox = -1; ox <= 1; ox++)
        for (const [px, py] of grid.get((cy + oy) * gw + cx + ox) ?? []) if (Math.hypot(px - x, py - y) < minDist) return false
    const key = cy * gw + cx
    if (!grid.has(key)) grid.set(key, [])
    grid.get(key)!.push([x, y])
    const k = y * w + x
    const wt = clamp(weightAt(k))
    const rr = radius.min + (radius.max - radius.min) * wt
    const op = 0.32 + 0.68 * wt
    const ink = inkAt(k)
    if (!out.has(ink)) out.set(ink, new Float32Array(w * h))
    const m = out.get(ink)!
    const R = Math.ceil(rr + 1)
    for (let dy = -R; dy <= R; dy++)
      for (let dx = -R; dx <= R; dx++) {
        const xx = x + dx
        const yy = y + dy
        if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue
        const cov = clamp(rr + 0.5 - Math.hypot(dx, dy)) * op
        if (cov > m[yy * w + xx]) m[yy * w + xx] = cov
      }
    return true
  }
  const walk = (sx: number, sy: number) => {
    let x = sx
    let y = sy
    let acc = pitch
    for (;;) {
      visited[y * w + x] = 1
      if (acc >= pitch && place(x, y)) acc = 0
      let next: [number, number] | null = null
      for (const [dx, dy] of N8) {
        const xx = x + dx
        const yy = y + dy
        if (xx >= 0 && yy >= 0 && xx < w && yy < h && line[yy * w + xx] && !visited[yy * w + xx]) {
          next = [xx, yy]
          break
        }
      }
      if (!next) return
      acc += next[0] !== x && next[1] !== y ? Math.SQRT2 : 1
      ;[x, y] = next
    }
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (line[y * w + x] && !visited[y * w + x] && deg(x, y) <= 1) walk(x, y)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (line[y * w + x] && !visited[y * w + x]) walk(x, y)
  return out
}

/** 2× float mask → output-size alpha, by averaging 2×2 blocks. */
function downsample(m: Float32Array, w2: number, outW: number, outH: number) {
  const a = new Float32Array(outW * outH)
  for (let j = 0; j < outH; j++)
    for (let i = 0; i < outW; i++)
      a[j * outW + i] = (m[j * 2 * w2 + i * 2] + m[j * 2 * w2 + i * 2 + 1] + m[(j * 2 + 1) * w2 + i * 2] + m[(j * 2 + 1) * w2 + i * 2 + 1]) / 4
  return a
}

/**
 * Renders the scene at 2× and finds edges: silhouettes, material boundaries, depth jumps,
 * creases, dark printed areas, and the boundaries between contour slices. Each edge lands on
 * the nearer surface, is thickened to 2 px, then averaged down — 1 px anti-aliased lines.
 */
function renderContour(scene: Scene, outW: number, outH: number) {
  const SS = 2
  const w = outW * SS
  const h = outH * SS
  const { map, materials, cam } = scene
  const { axis: rawAxis, spacing: baseSpacing } = CONTOURS[scene.id] ?? { axis: v(0, 1, 0), spacing: 0.05 }
  const spacing = baseSpacing * (STYLE === 'dots' ? DOT_SPACING : 1)
  const axis = norm(rawAxis)
  const fw = norm(sub(cam.ta, cam.ro))
  const rt = norm(cross(fw, v(0, 1, 0)))
  const up = cross(rt, fw)
  const f = 1 / Math.tan((cam.fov * Math.PI) / 360)
  const aspect = w / h

  const mat = new Int16Array(w * h).fill(-1)
  const lvl = new Int32Array(w * h)
  const dark = new Uint8Array(w * h)
  const dep = new Float32Array(w * h).fill(Infinity)
  const nrm = new Float32Array(w * h * 3)
  const alb = new Float32Array(w * h)

  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const u = (((i + 0.5) / w) * 2 - 1) * Math.min(1, aspect)
      const vv = (1 - ((j + 0.5) / h) * 2) * Math.min(1, 1 / aspect)
      const rd = norm(add(add(mul(rt, u), mul(up, vv)), mul(fw, f)))
      let t = 0
      let hit: Hit | null = null
      for (let k = 0; k < 220 && t < 30; k++) {
        const hh = map(add(cam.ro, mul(rd, t)))
        if (hh.d < 0.001 * (1 + t)) {
          hit = hh
          break
        }
        t += hh.d * 0.8
      }
      if (!hit) continue
      const p = add(cam.ro, mul(rd, t))
      const k = j * w + i
      const m = materials[hit.m]
      mat[k] = hit.m
      dep[k] = t
      // the lens slices what is under it, magnified
      let q = p
      if (m.lens) q = [m.lens.center[0] + (p[0] - m.lens.center[0]) / m.lens.power, 0, m.lens.center[2] + (p[2] - m.lens.center[2]) / m.lens.power]
      lvl[k] = Math.floor(dot(q, axis) / spacing)
      alb[k] = m.lens ? m.lens.below(q) : m.albedo(p)
      dark[k] = alb[k] < 0.4 ? 1 : 0
      const e = 0.002
      const n = norm([
        map(add(p, [e, 0, 0])).d - map(sub(p, [e, 0, 0])).d,
        map(add(p, [0, e, 0])).d - map(sub(p, [0, e, 0])).d,
        map(add(p, [0, 0, e])).d - map(sub(p, [0, 0, e])).d,
      ])
      nrm.set(n, k * 3)
    }
  }

  // 2 = structural (silhouette, material, crease, depth jump); 1 = contour slice
  const edge = new Uint8Array(w * h)
  const mark = (a: number, b: number, type = 2) => {
    // the line belongs to whichever surface is in front
    const k = dep[a] <= dep[b] ? a : b
    if (type > edge[k]) edge[k] = type
  }
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const a = j * w + i
      for (const b of [i + 1 < w ? a + 1 : -1, j + 1 < h ? a + w : -1]) {
        if (b < 0) continue
        if (mat[a] === -1 && mat[b] === -1) continue
        if (mat[a] !== mat[b]) {
          mark(a, b)
          continue
        }
        const nd = nrm[a * 3] * nrm[b * 3] + nrm[a * 3 + 1] * nrm[b * 3 + 1] + nrm[a * 3 + 2] * nrm[b * 3 + 2]
        if (Math.abs(dep[a] - dep[b]) > 0.02 * dep[a] || nd < 0.8) mark(a, b, 2)
        else if (lvl[a] !== lvl[b] || dark[a] !== dark[b]) mark(a, b, 1)
      }
    }
  }
  const inkOf = (k: number): Ink => (mat[k] >= 0 ? materials[mat[k]].ink ?? 'ink' : 'ink')
  const layers = new Map<Ink, Float32Array>()
  // contour style: thicken to 2 px, then average 2×2 blocks per ink
  const thick = new Uint8Array(w * h)
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const k = j * w + i
      if ((edge[k] || (i > 0 && edge[k - 1]) || (j > 0 && edge[k - w]) || (i > 0 && j > 0 && edge[k - w - 1]))) thick[k] = 1
    }
  for (let j = 0; j < outH; j++)
    for (let i = 0; i < outW; i++) {
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++) {
          const k = (j * SS + sy) * w + i * SS + sx
          if (!thick[k]) continue
          // a thickened pixel may sit on the background; borrow the ink of the edge it came from
          let src = k
          if (mat[src] < 0) src = [k, k - 1, k - w, k - w - 1].find((c) => c >= 0 && edge[c] && mat[c] >= 0) ?? k
          const ink = inkOf(src)
          if (!layers.has(ink)) layers.set(ink, new Float32Array(outW * outH))
          layers.get(ink)![j * outW + i] += 1 / (SS * SS)
        }
    }
  const covered = new Uint8Array(outW * outH)
  for (let j = 0; j < outH; j++)
    for (let i = 0; i < outW; i++) {
      let any = false
      for (let sy = 0; sy < SS && !any; sy++) for (let sx = 0; sx < SS && !any; sx++) any = mat[(j * SS + sy) * w + i * SS + sx] >= 0
      covered[j * outW + i] = any ? 1 : 0
    }
  return { layers, covered }
}

/* ── Halftone renderer ─────────────────────────────────────────────────────── */

/**
 * Classic halftone over real 3D lighting. The scene is lit (soft key light from the upper
 * left, cast shadow, ambient occlusion) and sampled on one even, staggered grid. Each dot's
 * AREA equals the darkness at its centre, so dots are full where no light reaches and shrink
 * to specks where light falls — the form comes from geometry and light alone, no outlines.
 */
function halftone(scene: Scene, outW: number, outH: number, pitch: number) {
  const N = Math.ceil((Math.max(outW, outH) / pitch) * 3)
  const { tone, layer, covered, solid } = render({ ...scene, w: N, h: N, gamma: scene.gamma ?? 1 })
  const sample = (x: number, y: number) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor((x / outW) * N)))
    const j = Math.min(N - 1, Math.max(0, Math.floor((y / outH) * N)))
    return j * N + i
  }
  // Five clean steps: each a fixed dot size AND its own gray, so light areas read as pale
  // specks and only real shadow reaches full ink. Dots never touch, so edges stay sharp.
  // One continuous progression within black: as darkness rises, each dot grows AND its ink
  // strengthens, from faint small dots in the highlights through midtones to full black in
  // shadow. No white and no fixed greys, so it sits cleanly on any card colour.
  const rMax = pitch * 0.46
  const SHADOW = { size: 0.55, alpha: 0.2 }
  const rowH = (pitch * Math.sqrt(3)) / 2
  const layers = new Map<Ink, Float32Array>()
  const cov = new Uint8Array(outW * outH)
  const dot = (x: number, y: number, rr: number, ink: Ink, alpha = 1) => {
    if (!layers.has(ink)) layers.set(ink, new Float32Array(outW * outH))
    const m = layers.get(ink)!
    const R = Math.ceil(rr + 1)
    for (let yy = Math.floor(y - R); yy <= y + R; yy++)
      for (let xx = Math.floor(x - R); xx <= x + R; xx++) {
        if (xx < 0 || yy < 0 || xx >= outW || yy >= outH) continue
        const c = clamp(rr + 0.5 - Math.hypot(xx + 0.5 - x, yy + 0.5 - y)) * alpha
        if (c > m[yy * outW + xx]) m[yy * outW + xx] = c
      }
  }
  const rows = Math.ceil(outH / rowH) + 1
  for (let rI = 0; rI < rows; rI++) {
    const y = (rI + 0.5) * rowH
    const off = rI % 2 ? pitch / 2 : 0
    for (let x = off + pitch / 2; x < outW; x += pitch) {
      const centre = sample(x, y)
      if (!covered[centre]) continue
      let t = 0
      for (const [dx, dy] of [[0, 0], [-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]]) {
        const k = sample(x + dx * pitch, y + dy * pitch)
        t += covered[k] ? tone[k] : 0
      }
      t /= 5
      if (!solid[centre]) {
        // flat cast shadow: one even field of pale dots wherever the shadow falls
        if (t > 0.06) dot(x, y, rMax * SHADOW.size, 'ink', SHADOW.alpha)
        continue
      }
      t = clamp(Math.pow(t, 1.2))
      if (t < 0.02) continue
      const size = 0.28 + 0.72 * Math.sqrt(t) // dot area tracks darkness
      const alpha = 0.32 + 0.68 * smooth(0, 0.85, t) // ink strength rises smoothly with it
      const matInk = layer[centre]
      // coloured materials (ribbon, tape) keep their colour at full strength
      dot(x, y, rMax * size, matInk, matInk === 'ink' ? alpha : 1)
    }
  }
  for (let j = 0; j < outH; j++) for (let i = 0; i < outW; i++) if (solid[sample(i + 0.5, j + 0.5)]) cov[j * outW + i] = 1
  return { layers, covered: cov }
}

/* ── Engraving renderer ───────────────────────────────────────────────────── */

/** Engraving geometry, in px at the 2× render scale. */
const ENGRAVE = {
  period: 13, // spacing between hatch lines
  outline: 2.6, // half-width of the silhouette
  inner: 1.4, // half-width of creases, folds and edges between parts
}

/**
 * A vintage engraving over real 3D lighting. Two hatch families are cut along planes through
 * the object (the contour axis, and one across it), so lines wrap the form. Each line swells
 * with the darkness under it: none in the light, fine lines in the half-tones, heavy lines and
 * crosshatching in shadow, with a scatter of stipple where light turns to shade. A bold
 * outline holds the silhouette, printed marks (type, rules) print solid, and the cast shadow
 * is a band of flat diagonal hatching.
 */
function engrave(scene: Scene, S: number) {
  const SS = 2
  const w = S * SS
  const h = S * SS
  const { map, materials, cam, ground } = scene
  const { axis: rawAxis } = CONTOURS[scene.id] ?? { axis: v(0, 1, 0) }
  const axis = norm(rawAxis)
  const fw = norm(sub(cam.ta, cam.ro))
  const rt = norm(cross(fw, v(0, 1, 0)))
  const up = cross(rt, fw)
  const across = len(cross(axis, fw)) > 0.2 ? norm(cross(axis, fw)) : rt
  const f = 1 / Math.tan((cam.fov * Math.PI) / 360)

  const world = (p: V): Hit => {
    const hit = map(p)
    const g = p[1] - ground
    return g < hit.d ? { d: g, m: -1 } : hit
  }
  const softShadow = (ro: V, rd: V) => {
    let res = 1
    let t = 0.02
    for (let i = 0; i < 64 && t < 8; i++) {
      const d = map(add(ro, mul(rd, t))).d
      if (d < 0.0008) return 0
      res = Math.min(res, (10 * d) / t)
      t += clamp(d, 0.01, 0.25)
    }
    return clamp(res)
  }
  const ao = (p: V, n: V) => {
    let occ = 0
    let sca = 1
    for (let i = 1; i <= 5; i++) {
      const hh = 0.02 + 0.06 * i
      occ += (hh - world(add(p, mul(n, hh))).d) * sca
      sca *= 0.75
    }
    return clamp(1 - 2.2 * occ)
  }

  const GROUND = -2 // a pixel of cast shadow on the invisible floor
  const mat = new Int16Array(w * h).fill(-1)
  const dep = new Float32Array(w * h).fill(Infinity)
  const nrm = new Float32Array(w * h * 3)
  const dark = new Float32Array(w * h)
  const h1 = new Float32Array(w * h)
  const h2 = new Float32Array(w * h)
  const printed = new Uint8Array(w * h)
  const textured = new Uint8Array(w * h)

  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const u = ((i + 0.5) / w) * 2 - 1
      const vv = 1 - ((j + 0.5) / h) * 2
      const rd = norm(add(add(mul(rt, u), mul(up, vv)), mul(fw, f)))
      let t = 0
      let hit: Hit | null = null
      for (let k = 0; k < 220 && t < 30; k++) {
        const hh = world(add(cam.ro, mul(rd, t)))
        if (hh.d < 0.001 * (1 + t)) {
          hit = hh
          break
        }
        t += hh.d * 0.8
      }
      if (!hit) continue
      const k = j * w + i
      const p = add(cam.ro, mul(rd, t))
      if (hit.m === -1) {
        const s = 1 - softShadow(add(p, v(0, 0.01, 0)), LIGHT) * ao(p, v(0, 1, 0))
        if (s > 0.2) {
          mat[k] = GROUND
          dark[k] = s
          dep[k] = t
        }
        continue
      }
      const m = materials[hit.m]
      const e = 0.002
      const n = norm([
        map(add(p, [e, 0, 0])).d - map(sub(p, [e, 0, 0])).d,
        map(add(p, [0, e, 0])).d - map(sub(p, [0, e, 0])).d,
        map(add(p, [0, 0, e])).d - map(sub(p, [0, 0, e])).d,
      ])
      const sh = softShadow(add(p, mul(n, 0.01)), LIGHT)
      const diff = Math.max(0, dot(n, LIGHT)) * sh
      const occ = ao(p, n)
      let q = p
      if (m.lens) q = [m.lens.center[0] + (p[0] - m.lens.center[0]) / m.lens.power, p[1], m.lens.center[2] + (p[2] - m.lens.center[2]) / m.lens.power]
      const alb = m.lens ? m.lens.below(q) : m.albedo(p)
      const refl = sub(mul(n, 2 * dot(n, LIGHT)), LIGHT)
      const spec = (m.spec ?? 0) * Math.pow(Math.max(0, dot(refl, mul(rd, -1))), m.shine ?? 24) * sh
      // printed marks print solid, so shading reads from the paper's own white
      const base = m.textured ? 1 : alb
      const lum = m.lens ? 0.55 + 0.45 * diff + spec : base * (0.2 * occ + 0.8 * diff) + 0.08 * occ * base + spec
      mat[k] = hit.m
      dep[k] = t
      nrm.set(n, k * 3)
      dark[k] = clamp(1 - lum)
      printed[k] = m.textured && alb < 0.8 ? 1 : 0
      textured[k] = m.textured ? 1 : 0
      h1[k] = dot(q, axis)
      h2[k] = dot(q, across)
    }
  }

  // scale each hatch family so its lines land ENGRAVE.period px apart on screen (median slope)
  const slope = (field: Float32Array) => {
    const g: number[] = []
    for (let j = 0; j < h - 1; j += 2)
      for (let i = 0; i < w - 1; i += 2) {
        const k = j * w + i
        if (mat[k] < 0 || mat[k + 1] !== mat[k] || mat[k + w] !== mat[k]) continue
        const s = Math.hypot(field[k + 1] - field[k], field[k + w] - field[k])
        if (s > 0) g.push(s)
      }
    g.sort((a, b) => a - b)
    return 1 / ((g[g.length >> 1] || 1) * ENGRAVE.period)
  }
  const k1 = slope(h1)
  const k2 = slope(h2)
  const lineCov = (x: number, halfWidth: number) => clamp(halfWidth + 0.5 - Math.abs(x - Math.round(x)) * ENGRAVE.period)
  /**
   * A hatch line measured in true screen px: the local slope of the field sets both the
   * distance to the nearest line and the spacing. Where foreshortening packs lines tighter
   * than half the period they fade out, so glancing surfaces never turn to moiré.
   */
  const hatch = (field: Float32Array, scale: number, k: number, i: number, j: number, halfWidth: number) => {
    const nx = i + 1 < w && mat[k + 1] === mat[k] ? k + 1 : i > 0 && mat[k - 1] === mat[k] ? k - 1 : -1
    const ny = j + 1 < h && mat[k + w] === mat[k] ? k + w : j > 0 && mat[k - w] === mat[k] ? k - w : -1
    const gx = nx < 0 ? 0 : Math.abs(field[nx] - field[k]) * scale
    const gy = ny < 0 ? 0 : Math.abs(field[ny] - field[k]) * scale
    const g = Math.hypot(gx, gy)
    if (g === 0) return 0
    const x = field[k] * scale
    const spacing = 1 / g
    const hw = halfWidth * Math.min(1, spacing / ENGRAVE.period)
    return clamp(hw + 0.5 - Math.abs(x - Math.round(x)) * spacing) * smooth(0.4 * ENGRAVE.period, 0.65 * ENGRAVE.period, spacing)
  }

  const ink = new Float32Array(w * h)
  const STIPPLE = 4
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const k = j * w + i
      if (mat[k] === -1) continue
      const t = dark[k]
      if (mat[k] === GROUND) {
        // flat diagonal hatching, heavier near the object
        ink[k] = lineCov((i * 0.94 + j * 0.34) / ENGRAVE.period, 0.45 + 0.7 * smooth(0.2, 0.7, t)) * smooth(0.2, 0.32, t)
        continue
      }
      if (printed[k]) {
        ink[k] = 1
        continue
      }
      let c = hatch(h1, k1, k, i, j, 0.35 + 2.6 * smooth(0.2, 1, t)) * smooth(0.16, 0.26, t)
      c = Math.max(c, hatch(h2, k2, k, i, j, 0.3 + 1.8 * smooth(0.66, 1, t)) * smooth(0.62, 0.72, t))
      // the deepest shadow closes up to solid black
      c = Math.max(c, smooth(0.9, 0.97, t))
      // stipple: at most one jittered dot per small cell, likeliest in the half-tones
      const ci = Math.floor(i / STIPPLE)
      const cj = Math.floor(j / STIPPLE)
      // printed paper stays clean white, like a page in an engraving
      const prob = textured[k] ? 0 : 0.3 * smooth(0.08, 0.2, t) * (1 - smooth(0.26, 0.4, t))
      if (hash(ci, cj) < prob) {
        const dx = i + 0.5 - (ci + 0.2 + 0.6 * hash(ci + 17, cj)) * STIPPLE
        const dy = j + 0.5 - (cj + 0.2 + 0.6 * hash(ci, cj + 29)) * STIPPLE
        c = Math.max(c, clamp(1.4 - Math.hypot(dx, dy)))
      }
      ink[k] = c
    }

  // outlines: silhouettes heavy, inner edges lighter; each lands on the nearer surface
  const edge = new Float32Array(w * h)
  const isObj = (k: number) => mat[k] >= 0
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const a = j * w + i
      for (const b of [i + 1 < w ? a + 1 : -1, j + 1 < h ? a + w : -1]) {
        if (b < 0 || (!isObj(a) && !isObj(b))) continue
        let width = 0
        if (isObj(a) !== isObj(b)) width = ENGRAVE.outline
        else if (mat[a] !== mat[b]) width = Math.abs(dep[a] - dep[b]) > 0.03 * dep[a] ? ENGRAVE.outline : ENGRAVE.inner
        else if (Math.abs(dep[a] - dep[b]) > 0.03 * dep[a]) width = ENGRAVE.outline
        else if (nrm[a * 3] * nrm[b * 3] + nrm[a * 3 + 1] * nrm[b * 3 + 1] + nrm[a * 3 + 2] * nrm[b * 3 + 2] < 0.8) width = ENGRAVE.inner
        if (!width) continue
        const k = isObj(a) && (!isObj(b) || dep[a] <= dep[b]) ? a : b
        edge[k] = Math.max(edge[k], width)
      }
    }
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const r = edge[j * w + i]
      if (!r) continue
      const R = Math.ceil(r + 1)
      for (let dy = -R; dy <= R; dy++)
        for (let dx = -R; dx <= R; dx++) {
          const xx = i + dx
          const yy = j + dy
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue
          const c = clamp(r + 0.5 - Math.hypot(dx, dy))
          if (c > ink[yy * w + xx]) ink[yy * w + xx] = c
        }
    }

  const covered = new Uint8Array(S * S)
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) covered[j * S + i] = isObj(j * SS * w + i * SS) ? 1 : 0
  return { layers: new Map<Ink, Float32Array>([['ink', downsample(ink, w, S, S)]]), covered }
}

/* ── Write ────────────────────────────────────────────────────────────────── */

type LayerOut = { src: string; ink: Ink; motion?: Motion; delay?: number }
const manifest: Record<string, { grid: number; rows: number; layers: LayerOut[] }> = {}
rmSync(OUT_DIR, { recursive: true, force: true })
mkdirSync(OUT_DIR, { recursive: true })
let bytes = 0

function writeLayer(
  id: string,
  k: number,
  gw: number,
  gh: number,
  on: (i: number, j: number) => boolean | number,
  meta: Omit<LayerOut, 'src'>,
  cell = CELL,
) {
  const png = pngMask(gw, gh, on, cell)
  bytes += png.length
  const file = `${id}-${k}.png`
  writeFileSync(join(OUT_DIR, file), png)
  manifest[id].layers.push({ src: `/illustrations/${file}`, ...meta })
}

function ditherField(w: number, h: number, tone: (x: number, y: number) => number) {
  const t = new Float32Array(w * h)
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) t[j * w + i] = tone((i + 0.5) / w, (j + 0.5) / h)
  return atkinson(t, w, h)
}

function emitSceneContour(scene: Scene) {
  const t0 = performance.now()
  const S = STYLE === 'dots' ? HALFTONE_SIZE : STYLE === 'engrave' ? ENGRAVE_SIZE : CONTOUR_SIZE
  const { layers } = STYLE === 'dots' ? halftone(scene, S, S, 12) : STYLE === 'engrave' ? engrave(scene, S) : renderContour(scene, S, S)
  manifest[scene.id] = { grid: S, rows: S, layers: [] }
  let n = 0
  const ORDER: Ink[] = ['shadow', 'tone0', 'tone1', 'tone2', 'tone3', 'tone4', 'tone5', 'ink']
  for (const ink of [...ORDER, ...[...layers.keys()].filter((k) => !ORDER.includes(k))] as Ink[]) {
    const a = layers.get(ink)
    if (!a) continue
    writeLayer(scene.id, n++, S, S, (i, j) => a[j * S + i], { ink }, 1)
  }
  for (const o of scene.overlays ?? []) {
    let alpha = (i: number, j: number) => clamp(o.tone((i + 0.5) / S, (j + 0.5) / S) * 1.4)
    if (STYLE === 'dots') {
      // trace the overlay's centre line at 2× and set it as dots too
      const w2 = S * 2
      const line = new Uint8Array(w2 * w2)
      for (let j = 0; j < w2; j++) for (let i = 0; i < w2; i++) if (o.tone((i + 0.5) / w2, (j + 0.5) / w2) > 0.55) line[j * w2 + i] = 1
      const mask = dotify(line, w2, w2, () => o.ink ?? 'ink', DOT.pitch, (k) => smooth(0.05, 0.3, Math.floor(k / w2) / w2)).get(o.ink ?? 'ink') ?? new Float32Array(w2 * w2)
      const a = downsample(mask, w2, S, S)
      alpha = (i, j) => a[j * S + i]
    }
    writeLayer(scene.id, n++, S, S, alpha, {
      ink: o.ink ?? 'ink',
      ...(o.motion ? { motion: o.motion } : {}),
      ...(o.delay ? { delay: o.delay } : {}),
    }, 1)
  }
  console.log(`${scene.id}: ${Math.round(performance.now() - t0)}ms`)
}

function emitScene(scene: Scene) {
  if (LINE_STYLE) return emitSceneContour(scene)
  const t0 = performance.now()
  const { tone, layer, covered, solid } = render(scene)
  const bits = atkinson(tone, scene.w, scene.h)
  manifest[scene.id] = { grid: scene.w, rows: scene.h, layers: [] }
  const used = new Set<Ink>(['ink'])
  for (let k = 0; k < layer.length; k++) if (covered[k]) used.add(layer[k])
  let n = 0
  // solid paper behind the object, so it reads as a white object on any card tint
  writeLayer(scene.id, n++, scene.w, scene.h, (i, j) => solid[j * scene.w + i] === 1, { ink: 'paper' })
  for (const ink of used) {
    writeLayer(scene.id, n++, scene.w, scene.h, (i, j) => {
      const idx = j * scene.w + i
      return covered[idx] === 1 && layer[idx] === ink && bits[idx] === 1
    }, { ink })
  }
  for (const o of scene.overlays ?? []) {
    const ob = ditherField(scene.w, scene.h, o.tone)
    writeLayer(scene.id, n++, scene.w, scene.h, (i, j) => ob[j * scene.w + i] === 1, {
      ink: o.ink ?? 'ink',
      ...(o.motion ? { motion: o.motion } : {}),
      ...(o.delay ? { delay: o.delay } : {}),
    })
  }
  console.log(`${scene.id}: ${Math.round(performance.now() - t0)}ms`)
}

function emitFlat(id: string, w: number, h: number, tone: (x: number, y: number) => number) {
  if (STYLE === 'dots') {
    // iso-lines of the tone, traced at 2× and set as dots
    const W = w * 4
    const H = h * 4
    const w2 = W * 2
    const h2 = H * 2
    const line = new Uint8Array(w2 * h2)
    const lvl = (x: number, y: number) => {
      const t = tone(x, y)
      return t <= 0.02 ? -1 : Math.floor((1 - t) * 14)
    }
    for (let j = 0; j < h2 - 1; j++)
      for (let i = 0; i < w2 - 1; i++) {
        const a = lvl((i + 0.5) / w2, (j + 0.5) / h2)
        const b = lvl((i + 1.5) / w2, (j + 0.5) / h2)
        const c = lvl((i + 0.5) / w2, (j + 1.5) / h2)
        if (a >= 0 && (a !== b || a !== c)) line[j * w2 + i] = 1
      }
    // dots grow and darken where the fade is deepest
    const wt = (k: number) => tone(((k % w2) + 0.5) / w2, (Math.floor(k / w2) + 0.5) / h2)
    const mask = dotify(line, w2, h2, () => 'ink', DOT.pitch, wt).get('ink') ?? new Float32Array(w2 * h2)
    const a = downsample(mask, w2, W, H)
    manifest[id] = { grid: W, rows: H, layers: [] }
    writeLayer(id, 0, W, H, (i, j) => a[j * W + i], { ink: 'ink' }, 1)
    return
  }
  if (STYLE === 'contour' || STYLE === 'engrave') {
    // contour fades: lines whose spacing widens as the tone falls off
    const W = w * 4
    const H = h * 4
    manifest[id] = { grid: W, rows: H, layers: [] }
    const SS = 3
    writeLayer(id, 0, W, H, (i, j) => {
      let acc = 0
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++) {
          const x = (i + (sx + 0.5) / SS) / W
          const y = (j + (sy + 0.5) / SS) / H
          const t = tone(x, y)
          if (t <= 0.02) continue
          // iso-lines of the tone itself, denser where it is darker
          const k = (1 - t) * 14
          if (Math.abs(k - Math.round(k)) < 0.035 + 0.05 * t) acc++
        }
      return acc / (SS * SS)
    }, { ink: 'ink' }, 1)
    return
  }
  manifest[id] = { grid: w, rows: h, layers: [] }
  const b = ditherField(w, h, tone)
  writeLayer(id, 0, w, h, (i, j) => b[j * w + i] === 1, { ink: 'ink' })
}

/**
 * Landing masthead: a run of thin newspaper-column bars (one stretch in topic colors) with the
 * dithered sphere standing in front of them. 660 × 240 grid.
 */
function emitMastheadContour() {
  const GW = 1320
  const GH = 480
  const S = 384
  const ox = Math.round(GW * 0.68) - S / 2
  const oy = (GH - S) / 2
  const { layers, covered } =
    STYLE === 'dots' ? halftone(sphereScene('masthead-sphere', S, false), S, S, 16) : renderContour(sphereScene('masthead-sphere', S, false), S, S)
  const inSphere = (i: number, j: number) => {
    const si = i - ox
    const sj = j - oy
    return si >= 0 && si < S && sj >= 0 && sj < S && covered[sj * S + si] === 1
  }
  const knock = new Uint8Array(GW * GH)
  for (let j = 0; j < GH; j++)
    for (let i = ox - 12; i < ox + S + 12; i++) {
      if (i < 0 || i >= GW) continue
      let hit = false
      for (let dy = -10; dy <= 10 && !hit; dy += 2) for (let dx = -10; dx <= 10 && !hit; dx += 2) if (dx * dx + dy * dy <= 100 && inSphere(i + dx, j + dy)) hit = true
      knock[j * GW + i] = hit ? 1 : 0
    }
  const PERIOD = 24
  const bars = Math.floor(GW / PERIOD)
  const colorOf = (b: number): Ink => {
    if (b >= 14 && b <= 17) return 'tide'
    if (b >= 18 && b <= 21) return 'bloom'
    if (b >= 22 && b <= 25) return 'accent'
    if (b >= 26 && b <= 29) return 'sun'
    return 'ink'
  }
  const barAt = (i: number) => (i % PERIOD < 12 && Math.floor(i / PERIOD) < bars ? Math.floor(i / PERIOD) : -1)
  manifest.masthead = { grid: GW, rows: GH, layers: [] }
  let k = 0
  if (STYLE === 'dots') {
    // each bar is a column of round dots that swell toward the middle of the band and
    // taper (smaller, lighter) toward its top and bottom; dots touching the sphere are dropped
    const STEP = 18
    const rows = Math.floor(GH / STEP)
    const top = (GH - (rows - 1) * STEP) / 2
    const maps = new Map<Ink, Float32Array>()
    for (let b = 0; b < bars; b++) {
      const cx = b * PERIOD + 6
      const ink = colorOf(b)
      if (!maps.has(ink)) maps.set(ink, new Float32Array(GW * GH))
      const m = maps.get(ink)!
      for (let r = 0; r < rows; r++) {
        const cy = top + r * STEP
        if (knock[Math.round(cy) * GW + cx]) continue
        let near = false
        for (let dy = -8; dy <= 8 && !near; dy += 4) for (let dx = -8; dx <= 8 && !near; dx += 4) {
          const yy = Math.round(cy + dy)
          const xx = cx + dx
          if (yy >= 0 && yy < GH && xx >= 0 && xx < GW && knock[yy * GW + xx]) near = true
        }
        if (near) continue
        const taper = Math.sin(Math.PI * ((r + 0.5) / rows))
        const rr = 2.6 + 3.4 * taper
        const op = 0.35 + 0.65 * taper
        for (let y = Math.floor(cy - 8); y <= cy + 8; y++)
          for (let x = cx - 8; x <= cx + 8; x++) {
            if (x < 0 || y < 0 || x >= GW || y >= GH) continue
            const cov = clamp(rr + 0.5 - Math.hypot(x - cx, y - cy)) * op
            if (cov > m[y * GW + x]) m[y * GW + x] = cov
          }
      }
    }
    for (const ink of ['ink', 'tide', 'bloom', 'accent', 'sun'] as Ink[]) {
      const m = maps.get(ink)
      if (m) writeLayer('masthead', k++, GW, GH, (i, j) => m[j * GW + i], { ink }, 1)
    }
  } else {
    for (const ink of ['ink', 'tide', 'bloom', 'accent', 'sun'] as Ink[]) {
      writeLayer('masthead', k++, GW, GH, (i, j) => {
        const b = barAt(i)
        return b >= 0 && colorOf(b) === ink && !knock[j * GW + i]
      }, { ink }, 1)
    }
  }
  for (const [ink, lines] of layers) {
    writeLayer('masthead', k++, GW, GH, (i, j) => {
      const si = i - ox
      const sj = j - oy
      return si >= 0 && si < S && sj >= 0 && sj < S ? lines[sj * S + si] : 0
    }, { ink }, 1)
  }
}

function emitMasthead() {
  if (LINE_STYLE) return emitMastheadContour()
  const GW = 660
  const GH = 240
  const S = 192
  const ox = Math.round(GW * 0.68) - S / 2
  const oy = (GH - S) / 2
  const { tone, covered, solid } = render(sphereScene('masthead-sphere', S, false))
  const sbits = atkinson(tone, S, S)
  const inSphere = (i: number, j: number) => {
    const si = i - ox
    const sj = j - oy
    return si >= 0 && si < S && sj >= 0 && sj < S && covered[sj * S + si] === 1
  }
  const knock = new Uint8Array(GW * GH)
  for (let j = 0; j < GH; j++)
    for (let i = 0; i < GW; i++) {
      let hit = false
      for (let dy = -5; dy <= 5 && !hit; dy++) for (let dx = -5; dx <= 5 && !hit; dx++) if (dx * dx + dy * dy <= 25 && inSphere(i + dx, j + dy)) hit = true
      knock[j * GW + i] = hit ? 1 : 0
    }
  const PERIOD = 12
  const bars = Math.floor(GW / PERIOD)
  const colorOf = (b: number): Ink => {
    if (b >= 14 && b <= 17) return 'tide'
    if (b >= 18 && b <= 21) return 'bloom'
    if (b >= 22 && b <= 25) return 'accent'
    if (b >= 26 && b <= 29) return 'sun'
    return 'ink'
  }
  const barAt = (i: number) => (i % PERIOD < 6 && Math.floor(i / PERIOD) < bars ? Math.floor(i / PERIOD) : -1)
  manifest.masthead = { grid: GW, rows: GH, layers: [] }
  let k = 0
  for (const ink of ['ink', 'tide', 'bloom', 'accent', 'sun'] as Ink[]) {
    writeLayer('masthead', k++, GW, GH, (i, j) => {
      const b = barAt(i)
      return b >= 0 && colorOf(b) === ink && !knock[j * GW + i]
    }, { ink })
  }
  writeLayer('masthead', k++, GW, GH, (i, j) => {
    const si = i - ox
    const sj = j - oy
    return si >= 0 && si < S && sj >= 0 && sj < S && solid[sj * S + si] === 1
  }, { ink: 'paper' })
  writeLayer('masthead', k++, GW, GH, (i, j) => {
    const si = i - ox
    const sj = j - oy
    return si >= 0 && si < S && sj >= 0 && sj < S && covered[sj * S + si] === 1 && sbits[sj * S + si] === 1
  }, { ink: 'ink' })
}

for (const s of [sphereScene('sphere', 200, true), book(), magnifier(), binoculars(), box(), mug(), paper()]) emitScene(s)
emitFlat('corner', 48, 48, (x, y) => clamp(1 - Math.hypot(x, y) * 1.25) ** 1.3)
emitFlat('band', 96, 48, (_x, y) => clamp(0.9 - y * 1.25) ** 1.4)
emitMasthead()

writeFileSync(
  MANIFEST,
  `// Generated by scripts/illustrations.ts — do not edit by hand.\n\nexport const SPRITES = ${JSON.stringify(manifest, null, 2)} as const\n\nexport type SpriteId = keyof typeof SPRITES\n`,
)
console.log(`wrote ${Object.keys(manifest).length} illustrations, ${(bytes / 1024).toFixed(1)} KB of PNG`)
