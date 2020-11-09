function isWebTarget (caller) {
  return caller?.target === 'web'
}

function isWebpack (caller) {
  return caller?.name === 'babel-loader'
}

module.exports = (api) => {
  const web = api.caller(isWebTarget)
  const webpack = api.caller(isWebpack)

  return {
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          targets: !web ? { node: 'current' } : undefined,
          modules: webpack ? false : 'commonjs',
        },
      ],
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@loadable/babel-plugin',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-transform-runtime',
    ],
  }
}
