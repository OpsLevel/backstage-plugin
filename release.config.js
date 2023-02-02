module.exports = {
  branches: ['feat/service-repository-connection', {name: 'beta', prerelease: true}],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          {breaking: true, release: 'major'},
          {type: 'refactor', release: 'patch'},
          {type: 'style', release: 'patch'},
          {type: 'release', release: 'patch'},
        ],
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
        tarballDir: 'dist',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: ['package.json', 'yarn.lock', 'CHANGELOG.md'],
      },
    ],
  ],
};
