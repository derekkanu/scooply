import BentoCard from '@/components/ui/BentoCard'
import ListPanel from '@/components/ui/ListPanel'
import StatCard from '@/components/ui/StatCard'
import Illustration from '@/components/illustrations/Illustration'
import { Bookmark, Code, Layers, Search, Sparkle } from '@/components/ui/icons'

/** "Your feed": a wide feature card, three feature cards, then a band of outcome statements. */
export default function LandingBento() {
  return (
    <div className="flex flex-col gap-4">
      <BentoCard
        tone="lavender"
        layout="side"
        tag="Your topics"
        title="Reach the stories that matter to you"
        body="Pick what you care about and Scooply builds the front page around it: research, tools, ethics or the weird and wonderful."
        cta={{ label: 'See how it works', href: '#how' }}
        panel={
          <ListPanel
            items={[
              { icon: <Layers />, label: 'AI Foundations' },
              { icon: <Code />, label: 'Hands-On AI Tools' },
              { icon: <Sparkle />, label: 'AI with Heart' },
              { icon: <Search />, label: 'Stay Curious' },
              { icon: <Bookmark />, label: 'Saved for later' },
            ]}
          />
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <BentoCard tone="lime" tag="Preview first" art="magnifier" title="Read the gist before you click" />
        <BentoCard tone="mint" tag="Every source" art="binoculars" title="Six platforms, one calm feed" />
        <BentoCard tone="white" tag="Morning scoop" art="mug" title="A digest that’s ready with your coffee" />
      </div>

      <div className="sc-card-grid grid grid-cols-1 gap-3 rounded-[20px] p-3 sm:p-4 md:grid-cols-3" style={{ ['--sc-card' as string]: 'var(--sc-lime)', ['--sc-card-ink' as string]: 'var(--sc-lime-ink)' }}>
        <StatCard
          tone="glass"
          tag="Save time"
          statement="Catch up on AI in five minutes a day"
          footer={<Illustration name="mug" size={72} still />}
        />
        <StatCard
          tone="glass"
          tag="Stay current"
          statement="Every platform, read for you overnight"
          footer={<Illustration name="paper" size={72} />}
        />
        <StatCard
          tone="glass"
          tag="Level up"
          statement="Stories matched to the depth you want"
          footer={<Illustration name="book" size={72} />}
        />
      </div>
    </div>
  )
}
