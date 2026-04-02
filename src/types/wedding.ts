import type { ReactNode } from 'react'

export interface TimelineItem {
  time: string
  title: string
  description: string
}

export interface StoryItem {
  title: string
  text: string
  year?: string
}

export interface DressCodePaletteItem {
  name: string
  hex: string
}

export interface VenueInfo {
  name: string
  address: string
  note: string
  detailsPlaceholder: string
  mapHint: string
}

export interface WishesContent {
  title: string
  items: string[]
}

export interface FinalBlockContent {
  quote: string
  sign: string
}

export interface CoupleNames {
  first: string
  second: string
  connector: string
  monogram: string
}

export interface GalleryPhoto {
  id: string
  src: string
  alt: string
  orientation?: 'landscape' | 'portrait' | 'square'
  caption?: string
}

export interface WeddingContent {
  coupleNames: CoupleNames
  weddingDate: string
  greeting: string
  story: StoryItem[]
  timeline: TimelineItem[]
  venue: VenueInfo
  dressCode: {
    text: string
    palette: DressCodePaletteItem[]
  }
  photos: GalleryPhoto[]
  wishes: WishesContent
  finalBlock: FinalBlockContent
}

export interface SectionProps {
  id: string
  title: string
  subtitle?: string
  className?: string
  children: ReactNode
}

export interface IntroState {
  isOpened: boolean
  isAnimating: boolean
  openIntro: () => void
}
