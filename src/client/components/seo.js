import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet-async'

export function SEO ({
  title,
  description,
  image,
}) {
  const meta = [
    { property: 'og:title', content: title },
    { name: 'twitter:title', content: title },
  ].concat(
    description ? [
      { name: 'description', content: description },
      { name: 'twitter:description', content: description },
      { name: 'description', content: description },
    ] : [],
  ).concat(
    image ? [
      { property: 'og:image', content: image },
      { property: 'twitter:image', content: image },
    ] : [],
  )
  return (
    <Helmet
      title={title}
      meta={meta}
    />
  )
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
}
