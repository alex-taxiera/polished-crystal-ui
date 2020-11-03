import React from 'react'
import { AnchorToTab } from '../components/link/link'

import {
  Section,
} from '../components/sections/section'

export function Home () {
  return (
    <Section contentClass="p-5">
      <p className="lead">
        This site is a rough data center made for (but not affiliated with) <AnchorToTab href="https://github.com/Rangi42/polishedcrystal#pok%C3%A9mon-polished-crystal">
          Polished Crystal
        </AnchorToTab>.
      </p>
      <img src="/title-screen.png" />
    </Section>
  )
}
