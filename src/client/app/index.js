import React, {
  useState,
} from 'react'
import {
  Helmet,
} from 'react-helmet-async'

import { Header } from './header'
import { Footer } from './footer'
import { Routes } from './routes'

import { ConfigContext } from '../services/config'
import { VersionContext } from '../services/pc-api'

import styles from './app.module.scss'

export function App ({ data }) {
  const [ currentVersion, setCurrentVersion ] = useState(data.versions[0])

  const versionData = {
    all: data.versions,
    current: currentVersion,
    set: (v) => setCurrentVersion(v),
  }

  return (
    <React.StrictMode>
      <ConfigContext.Provider value={data.config}>
        <VersionContext.Provider value={versionData}>
          <MainSEO manifest={data.manifest} />
          <Header />
          <main className={styles.mainArea}>
            <Routes />
          </main>
          <Footer />
        </VersionContext.Provider>
      </ConfigContext.Provider>
    </React.StrictMode>
  )
}

function MainSEO ({ manifest }) {
  return (
    <Helmet
      titleTemplate={`%s | ${manifest.short_name}`}
      defaultTitle={manifest.short_name}
      htmlAttributes={{
        lang: 'en-US',
      }}
      link={[
        {
          rel: 'manifest',
          href: '/manifest.webmanifest',
        },
      ]}
      meta={[
        {
          property: 'og:site_name',
          content: manifest.name,
        },
        {
          property: 'og:title',
          content: manifest.short_name,
        },
        {
          name: 'description',
          content: manifest.description,
        },
        {
          charset: 'utf-8',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:creator',
          content: 'Alex Taxiera',
        },
        {
          name: 'twitter:title',
          content: manifest.short_name,
        },
        {
          name: 'twitter:description',
          content: manifest.description,
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        },
        {
          name: 'theme-color',
          content: manifest.theme_color,
        },
        {
          name: 'description',
          content: manifest.description,
        },
        {
          name: 'keywords',
          content: manifest.keywords?.join(', '),
        },
      ]}
    />
  )
}