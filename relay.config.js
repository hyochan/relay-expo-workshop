module.exports = {
  exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
  src: './src',
  schema: 'schema.graphql',
  language: 'typescript',
  artifactDirectory: './src/__generated__',
  noFutureProofEnums: true,
};
