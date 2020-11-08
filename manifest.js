import path from 'path'

export default {
  filename: 'manifest.json',
  short_name: 'Polished Crystal Data',
  name: 'Polished Crystal Data',
  description: 'Find stats and other data for the Polished Crystal rom-hack!.',
  theme_color: '#000000',
  start_url: '.',
  background_color: '#ffffff',
  display: 'standalone',
  keywords: [
    'pokemon',
    'crystal',
    'pokemon crystal',
    'polished',
    'polished crystal',
    'gameboy',
    'game boy',
    'gameboycolor',
    'game boy color',
    'rom',
    'romhack',
    'rom hack',
    'retro',
    'gaming',
    'retro gaming',
  ],
  icons: [
    {
      src: path.resolve('src/assets/crystal-c.png'),
      sizes: [ 96, 128, 192, 256, 384, 512 ],
    },
  ],
}
