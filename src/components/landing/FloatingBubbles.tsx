import FloatingBubble from './FloatingBubble'

const PLACEHOLDER_TEXT =
  'A smart news aggregator that pulls content from social platforms, filtered by your proficiency level.'

function PersonAvatar({ hue }: { hue: number }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, hsl(${hue}, 60%, 75%), hsl(${hue + 30}, 70%, 60%))` }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-3.3 0-8 1.65-8 5v1h16v-1c0-3.35-4.7-5-8-5z" />
      </svg>
    </div>
  )
}

function StarAvatar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#F97316">
      <path d="M12 2l1.5 6 6 1.5-6 1.5L12 17l-1.5-6L4.5 9.5 10.5 8z" />
      <path d="M12 5l1 4 4 1-4 1-1 4-1-4-4-1 4-1z" opacity="0.6" />
    </svg>
  )
}

function DiamondAvatar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="#8B5CF6" />
      <path d="M12 6L18 12L12 18L6 12L12 6Z" fill="white" opacity="0.4" />
    </svg>
  )
}

// Each bubble is pinned to the horizontal segment of one funnel line so its
// anchor dot lands directly on the line. The DecorativeLines SVG uses a
// 1440×1500 viewBox with preserveAspectRatio="xMidYMin slice", so on
// width-dominant viewports a viewBox y of Y maps to (Y * 100/1440)vw.
//
//   line 1 → y=200 → 13.89vw   line 3 → y=380 → 26.39vw
//   line 2 → y=290 → 20.14vw   line 4 → y=470 → 32.64vw
//
// The wrapper's bottom-anchor corner coincides with its dot center, so
// `top: <line_y>vw` + `-translate-y-full` lands the dot on the line. The
// horizontal anchor (right/left in vw) places the dot inside the line's
// horizontal segment (x ∈ [-10, 380] on the left, [1060, 1450] on the right).
//
// Left side rides lines 1 and 2; right side rides lines 3 and 4 — bubbles
// cascade diagonally down from upper-left to lower-right.
export default function FloatingBubbles() {
  return (
    <>
      {/* Orange — line 1, dot at viewBox (300, 200) */}
      <div className="hidden md:block absolute top-[13.89vw] right-[79.17vw] -translate-y-full z-20">
        <FloatingBubble
          color="orange"
          text={PLACEHOLDER_TEXT}
          avatar={<StarAvatar />}
          dotPosition="bottom-right"
        />
      </div>

      {/* Blue — line 2, dot at viewBox (350, 290) */}
      <div className="hidden md:block absolute top-[20.14vw] right-[75.69vw] -translate-y-full z-20">
        <FloatingBubble
          color="blue"
          text={PLACEHOLDER_TEXT}
          avatar={<PersonAvatar hue={200} />}
          dotPosition="bottom-right"
        />
      </div>

      {/* Green — line 3, dot at viewBox (1140, 380) */}
      <div className="hidden md:block absolute top-[26.39vw] left-[79.17vw] -translate-y-full z-20">
        <FloatingBubble
          color="green"
          text={PLACEHOLDER_TEXT}
          avatar={<PersonAvatar hue={140} />}
          dotPosition="bottom-left"
        />
      </div>

      {/* Purple — line 4, dot at viewBox (1090, 470) */}
      <div className="hidden md:block absolute top-[32.64vw] left-[75.69vw] -translate-y-full z-20">
        <FloatingBubble
          color="purple"
          text={PLACEHOLDER_TEXT}
          avatar={<DiamondAvatar />}
          dotPosition="bottom-left"
        />
      </div>
    </>
  )
}
