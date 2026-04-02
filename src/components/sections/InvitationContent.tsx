import { memo } from 'react'
import type { WeddingContent } from '@/types/wedding'
import { CountdownSection } from '@/components/sections/CountdownSection'
import { DressCodeSection } from '@/components/sections/DressCodeSection'
import { FinalSection } from '@/components/sections/FinalSection'
import { GreetingSection } from '@/components/sections/GreetingSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { PhotoGallerySection } from '@/components/sections/PhotoGallerySection'
import { StorySection } from '@/components/sections/StorySection'
import { TimelineSection } from '@/components/sections/TimelineSection'
import { VenueSection } from '@/components/sections/VenueSection'
import { WishesSection } from '@/components/sections/WishesSection'

interface InvitationContentProps {
  content: WeddingContent
}

const InvitationContentBase = ({ content }: InvitationContentProps) => {
  return (
    <>
      <HeroSection content={content} />
      <CountdownSection />
      <GreetingSection text={content.greeting} />
      <StorySection story={content.story} />
      <PhotoGallerySection photos={content.photos} />
      <TimelineSection items={content.timeline} />
      <VenueSection venue={content.venue} />
      <DressCodeSection dressCode={content.dressCode} />
      <WishesSection wishes={content.wishes} />
      <FinalSection content={content.finalBlock} />
    </>
  )
}

export const InvitationContent = memo(InvitationContentBase)

InvitationContent.displayName = 'InvitationContent'
