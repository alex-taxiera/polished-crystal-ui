import React, {
  useContext,
} from 'react'
import {
  VersionContext,
} from '../services/pc-api'

export function VersionSelect () {
  const version = useContext(VersionContext)
  const key = 'version-select'

  const options = version?.all && version.all.map((version, i) => (
    <option key={`${key}-${i}`} value={version}>{version}</option>
  ))

  return (
    <>
      <span>Version:&nbsp;</span>
      <select
        value={version.current ?? ''}
        onChange={(event) => {
          version.set(event.target.value)
        }}
      >
        {options}
      </select>
    </>
  )
}
