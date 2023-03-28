module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-flow',
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
  ]
};
