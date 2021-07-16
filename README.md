## Relay Workshop with Expo

### Requirements

### Test Server (HackaTalk)
- [SourceCode](https://github.com/dooboolab/hackatalk/tree/master/server)
- [Installation](https://website.hackatalk.dev/docs/server/installation)

### Install Relay

Here is [installation guide](https://relay.dev/docs/getting-started/installation-and-setup) for [relay](https://relay.dev) and we'll summarize them here.

1. Install relay
   ```sh
   yarn add react react-dom react-relay
   yarn add -D relay-config babel-plugin-relay graphql relay-compiler relay-compiler-language-typescript
   ```

2. Create the configuration file
   ```js
   module.exports = {
     exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
     src: './src',
     schema: 'schema.graphql',
     language: 'typescript',
     artifactDirectory: './src/__generated__',
     noFutureProofEnums: true,
   };

   ```
   > Note that the `schema` path should be the schema generated from [Test Server](#test-server). We'll see how to generate it automatically soon.

3. Add `npm script` in `package.json`
   ```sh
    "relay": "relay-compiler",
    "relay-watch": "yarn relay-compiler --watch",
   ```
   > Running `yarn relay` will generate schema types.

### Install graphql-codegen
> You can automatically download `schema.graphql` from server and generate types with [graphql-code-generator](https://www.graphql-code-generator.com).

1. Install packages
   ```sh
   yarn add -D get-graphql-schema @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-document-nodes @graphql-codegen/typescript-graphql-files-modules @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
   ```

   Currently, below are the packages versions.
   ```sh
   "get-graphql-schema": "^2.1.2",
   "@graphql-codegen/cli": "^1.21.6",
   "@graphql-codegen/typescript": "^1.22.4",
   "@graphql-codegen/typescript-document-nodes": "^1.17.15",
   "@graphql-codegen/typescript-graphql-files-modules": "^1.18.1",
   "@graphql-codegen/typescript-operations": "^1.18.3",
   "@graphql-codegen/typescript-react-apollo": "^2.3.0",
   ```

2. Add below scripts to `package.json`.
   ```
   "schema": "get-graphql-schema http://localhost:4000/graphql > schema.graphql",
   "codegen": "graphql-codegen --config codegen.yml",
   "generate": "yarn schema && yarn codegen",
   ``` 

3. Add `codegen.yml`
   ```yml
   overwrite: true
   schema:
     - './schema.graphql'
   generates:
     src/types/graphql.tsx:
       config:
         gqlImport: graphql-tag
         skipDocumentsValidation: true
         flattenGeneratedTypes: true
         enumsAsTypes: true
       plugins:
         - 'typescript'
         - 'typescript-operations'
         - 'typescript-react-apollo'
   ```
   
   > Follow [codegen-specification](#codegen-specification) for detailed information.

4. While the server is running, run `yarn generate`. This will generate `src/types/graphql.tsx` which has all schema types. You can safely ignore type warning in `.eslintignore`.
   - Create `.eslintignore` file.
    ```sh
    touch .eslintignore
    ```
   - Add `src/types/graphql.tsx` in `.eslintignore`.

### Codegen Sepecification
Description on specs we use for in `codegen`.

#### Config

- skipDocumentsValidation
  When using relay, some relay style arguments fails when running codgen. You can see [related issue here](https://github.com/dotansimha/graphql-code-generator/issues/2565).

  Therefore we are setting this value to `true`.

- flattenGeneratedTypes
  Flatten fragment spread and inline fragments into a simple selection set before generating.

- gqlImport
  type: `string` default: `graphql-tag#gql`

  Customize from which module will `gql` be imported from. This is useful if you want to use modules other than `graphql-tag`, e.g. `graphql.macro`.

- enumsAsType
  type: `boolean` default: `false`

  Generates enum as TypeScript type instead of enum.

#### Plugin
Describes plugins we are using for graphql codegen.

- [typescript-operations](https://www.graphql-code-generator.com/docs/plugins/typescript-operations)
  This plugin generates TypeScript types based on your GraphQLSchema and your GraphQL operations and fragments. It generates types for your GraphQL documents: Query, Mutation, Subscription and Fragment.

  Note: In most configurations, this plugin requires you to use `typescript as well, because it depends on its base types.

- [typescript-react-apollo](https://www.graphql-code-generator.com/docs/plugins/typescript-react-apollo)
  This plugin generates React Apollo components and HOC with TypeScript typings.

  It extends the basic TypeScript plugins: [@graphql-codegen/typescript](https://www.graphql-code-generator.com/docs/plugins/typescript), [@graphql-codegen/typescript-operations](https://www.graphql-code-generator.com/docs/plugins/typescript-operations) - and thus shares a similar configuration.

