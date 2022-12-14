module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '10'
        },
        debug: false,
        useBuiltIns: 'usage',
        corejs: 3,
        shippedProposals: true
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties'
  ]
};
