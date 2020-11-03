import React, {
  useContext,
} from 'react'
import {
  VersionContext,
} from '../services/pc-api'

export function VersionSelect () {
  const version = useContext(VersionContext)
  // const key = 'version-select'
  console.log('version :', version)
  return (<div></div>)
  //     throw version
  // const options = version?.all?.map((version, i) => (
  //   <option key={`${key}-${i}`} value={version}>{version}</option>
  // ))

  // return (
  //   <>
  //     <span>Version:&nbsp;</span>
  //     <select
  //       value={version.current ?? ''}
  //       onChange={(event) => {
  //         version.set(event.target.value)
  //       }}
  //     >
  //       {options}
  //     </select>
  //   </>
  // )
}
