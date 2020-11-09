import React from 'react'
import { Helmet } from 'react-helmet-async'

import { AnchorToTab } from '../components/link/link'

import {
  Section,
} from '../components/sections/section'

import TitleImg from '../../assets/title-screen.png'

export default function Home () {
  return (
    <>
      <Helmet>
        <title>
          Home
        </title>
      </Helmet>
      <Section contentClass="py-4">
        <p className="lead">
          This site is a rough data center made for (but not affiliated with) <AnchorToTab href="https://github.com/Rangi42/polishedcrystal#pok%C3%A9mon-polished-crystal">
            Polished Crystal.
            <br />
            <br />
            <img src={TitleImg} />
          </AnchorToTab>
        </p>
      </Section>
    </>
  )
}
