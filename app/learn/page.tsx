import Link from 'next/link'
import { Section } from '@/components/Section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GradientBackground } from '@/components/GradientBackground'
import {
  Camera,
  Recycle,
  Shield,
  MapPin,
  Leaf,
  Globe,
  AlertTriangle
} from 'lucide-react'

type DisposalCategory = {
  title: string
  items: string[]
  note: string
}

type ClimateImpactArea = {
  title: string
  detail: string
}

const disposalCategories: DisposalCategory[] = [
  {
    title: 'Recyclables',
    items: [
      'Rinse containers and keep paper dry before sorting.',
      'Separate plastics, glass, and metals to improve recovery.',
      'Flatten cartons and boxes to reduce volume.'
    ],
    note: 'Look for community collection points and verified recyclers.'
  },
  {
    title: 'Organic Waste',
    items: [
      'Keep food scraps and yard waste separate from plastics.',
      'Compost when possible to reduce landfill methane.',
      'Wrap oily food waste to avoid contamination.'
    ],
    note: 'Composting is ideal for households, schools, and farms.'
  },
  {
    title: 'Hazardous & Medical',
    items: [
      'Do not mix batteries, paints, or chemicals with general waste.',
      'Keep items in original containers or sealed bags.',
      'Use authorized drop-off points when available.'
    ],
    note: 'These items can release toxins or cause fires.'
  },
  {
    title: 'E-Waste',
    items: [
      'Back up and wipe devices before disposal.',
      'Store cables and accessories together.',
      'Use certified e-waste partners or take-back programs.'
    ],
    note: 'Electronics contain recoverable metals and hazardous parts.'
  }
]

const climateImpactAreas: ClimateImpactArea[] = [
  {
    title: 'Coastal Areas',
    detail: 'Sea-level rise, saltwater intrusion, and stronger storms.'
  },
  {
    title: 'Arid & Semi-Arid Regions',
    detail: 'Longer droughts, water stress, and livestock losses.'
  },
  {
    title: 'Urban Centers',
    detail: 'Heat stress, flooding from intense rains, and air quality issues.'
  },
  {
    title: 'Lake & River Basins',
    detail: 'Shifting rainfall patterns that affect agriculture and fisheries.'
  }
]

function renderDisposalCard (category: DisposalCategory) {
  return (
    <Card key={category.title} className="border-0 shadow-lg bg-card">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-semibold text-foreground">
          {category.title}
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          {category.items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-2 h-2 w-2 rounded-full bg-primary/70" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">{category.note}</p>
      </CardContent>
    </Card>
  )
}

function renderClimateCard (area: ClimateImpactArea) {
  return (
    <Card key={area.title} className="border-0 shadow-lg bg-card">
      <CardContent className="p-6 space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          {area.title}
        </h3>
        <p className="text-muted-foreground">{area.detail}</p>
      </CardContent>
    </Card>
  )
}

export default function LearnPage () {
  return (
    <main className="min-h-screen">
      <Section className="bg-background">
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-medium">Learn & Act</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
            Learn How EcoScan Helps You Dispose Responsibly
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            EcoScan is a simple, AI-powered guide that turns a photo into clear
            disposal steps. It helps you protect your community, reduce waste,
            and understand how our everyday choices affect the climate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-all" asChild>
              <Link href="/chat">
                <Camera className="mr-2 w-5 h-5" />
                Start a Scan
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2" asChild>
              <Link href="/#features">Back to Home</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section className="bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">How It Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Scan, Learn, Dispose
            </h2>
            <p className="text-lg text-muted-foreground">
              EcoScan combines AI analysis with Kenya-focused guidance to keep
              you safe and compliant.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Capture</h3>
                <p className="text-muted-foreground">
                  Take a photo or upload an image of the item you want to
                  dispose of.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Identify</h3>
                <p className="text-muted-foreground">
                  EcoScan detects materials and categories so you know what can
                  be recycled, reused, or needs special care.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Act</h3>
                <p className="text-muted-foreground">
                  Follow step-by-step instructions and find nearby facilities
                  for safe disposal.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      <Section className="bg-background">
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Disposal Basics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              How to Dispose Waste Safely
            </h2>
            <p className="text-lg text-muted-foreground">
              Use these steps while EcoScan provides tailored guidance for your
              exact item.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {disposalCategories.map(renderDisposalCard)}
          </div>
        </div>
      </Section>

      <Section className="bg-muted/30">
        <GradientBackground variant="rusty" className="rounded-3xl p-10 md:p-14">
          <div className="container mx-auto max-w-4xl text-center text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">Climate Impact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              How Waste Links to Global Warming
            </h2>
            <p className="text-lg text-white/90">
              Poor disposal increases methane and toxic emissions. Recycling,
              reusing, and safe treatment reduce greenhouse gases and keep
              ecosystems healthy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {climateImpactAreas.map(renderClimateCard)}
          </div>
        </GradientBackground>
      </Section>

      <Section className="bg-background">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Ready to Begin</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Make a Responsible Choice Today
          </h2>
          <p className="text-lg text-muted-foreground">
            EcoScan helps you understand the impact of waste, discover safer
            disposal options, and protect the areas most affected by climate
            change.
          </p>
          <Button size="lg" className="shadow-lg hover:shadow-xl transition-all" asChild>
            <Link href="/chat">Start Scanning</Link>
          </Button>
        </div>
      </Section>
    </main>
  )
}

