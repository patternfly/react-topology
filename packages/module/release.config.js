module.exports = {
  branches: [{ name: 'main', channel: 'prerelease' }, { name: 'v5', channel: 'alpha', prerelease: 'alpha' }],
  analyzeCommits: {
    preset: 'angular'
  },
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          { type: 'chore', scope: 'deps', release: 'patch' }
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    '@semantic-release/npm'
  ],
  tagFormat: 'prerelease-v${version}'
};
