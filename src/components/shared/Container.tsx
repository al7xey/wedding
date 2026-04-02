import { memo } from 'react'
import type { PropsWithChildren } from 'react'

const ContainerBase = ({ children }: PropsWithChildren) => {
  return <div className="container">{children}</div>
}

export const Container = memo(ContainerBase)

Container.displayName = 'Container'
