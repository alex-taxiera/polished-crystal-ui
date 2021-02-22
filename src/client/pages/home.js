import React from 'react'

import { AnchorToTab } from '../components/link'
import { SEO } from '../components/seo'
import {
  Section,
} from '../components/sections/section'

import TitleImg from '../../assets/title-screen.png'

export default function Home () {
  return (
    <>
      <SEO title="Home" />
      <p className="lead">
        This site is a rough data center made for&nbsp;
        <AnchorToTab href="https://github.com/Rangi42/polishedcrystal#pok%C3%A9mon-polished-crystal">
          Polished Crystal.
        </AnchorToTab>
      </p>
      <img src={TitleImg} />
    </>
  )
}
