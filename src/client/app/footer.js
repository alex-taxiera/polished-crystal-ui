import React from 'react'
import { AnchorToTab } from '../components/link'

export function Footer () {
  return (
    <footer className="d-flex justify-content-center m-2">
      <AnchorToTab href="https://github.com/alex-taxiera">
        Alex Taxiera
      </AnchorToTab>
      &nbsp;
      <AnchorToTab href="https://github.com/alex-taxiera/polished-crystal-ui">
        {'<Code />'}
      </AnchorToTab>
    </footer>
  )
}
