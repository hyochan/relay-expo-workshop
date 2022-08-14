# Relay Runtime Config

[ResettableRelayProvider]: https://gist.github.com/hyochan/7ea10143fbba62c3205bf8d59e6461a8

> Configure [relay runtime](https://relay.dev/docs/getting-started/step-by-step-guide/#42-configure-relay-runtime).

Configure babel plugin as described in [doc](https://relay.dev/docs/getting-started/installation-and-setup/#set-up-babel-plugin-relay).

```
{
  "plugins": [
    "relay"
  ]
}
```

## Setup

Create `relay` dir in your project.

```
mkdir relay
```

Add `fetch.ts`, `index.ts`, `util.ts` files under `relay` folder.

```
relay/
├─ fetch.ts
├─ index.ts
└─ util.ts
```

### index.ts

```ts
import {
  Environment,
  IEnvironment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';

import fetchGraphQL from './fetch';
import {relayTransactionLogger} from './util';

export function createRelayEnvironment(): IEnvironment {
  return new Environment({
    network: Network.create(fetchGraphQL),
    store: new Store(new RecordSource()),
    log: __DEV__ ? relayTransactionLogger : null,
  });
}
```

- RecordSource: An abstract interface for storing [records](https://relay.dev/docs/glossary/#record), keyed by [DataID](https://relay.dev/docs/glossary/#dataid), used both for representing the store's cache for updates to it.
- Store: [RelayModernStore](https://relay.dev/docs/api-reference/store)
- Network: Relay environments contain a `network` object, which exposes a single `execute` function. All network requests initiated by Relay will go through this piece of code.


### fetch.ts

```ts
import {GRAPHQL_URL} from '../../config';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {FetchFunction} from 'relay-runtime';

type RequestProps = {
  method: string;
  headers: Record<string, string>;
  body: string | FormData | null;
};

const fetchGraphQL: FetchFunction = async (
  operation,
  variables,
  cacheConfig,
  uploadables,
) => {
  const config: RequestProps = {
    method: 'POST',
    headers: {
      Authorization: (await AsyncStorage.getItem('token')) || '',
      Accept: 'application/json',
    },
    body: '',
  };

  // When the `uploadables` are provided the [formData] is built following the GraphQL multipart request specification.
  // https://github.com/jaydenseric/graphql-multipart-request-spec

  if (uploadables) {
    const formData = new FormData();

    const requestText = operation?.text?.replace(/\n/g, '');

    const query = JSON.stringify({
      query: requestText,
      variables,
    });

    formData.append('operations', query);

    let map: {[key: number]: string[]} = {};

    let idx = 0;
    const prefix = 'variables';

    Object.keys(uploadables).forEach((field: string) => {
      const files = uploadables[field];

      if (Array.isArray(files)) {
        // multi uploads
        for (let i in files) {
          map[idx] = [`${prefix}.${field}.${i}`];
          formData.append(`${idx}`, files[i]);
          idx++;
        }

        formData.append('map', JSON.stringify(map));
      } else {
        // single upload
        map[idx] = [`${prefix}.${field}`];
        formData.append('map', JSON.stringify(map));
        formData.append(`${idx}`, files);
      }
    });

    formData.append('map', JSON.stringify(map));

    config.body = formData;
  } else {
    config.headers['Content-Type'] = 'application/json';

    config.body = JSON.stringify({
      query: operation.text,
      variables,
    });
  }

  return fetch(GRAPHQL_URL, config).then((response) => response.json());
};

export default fetchGraphQL;
```

### util.ts

```ts
import {LogRequestInfoFunction} from 'relay-runtime';

export const relayTransactionLogger =
  () =>
  (event: LogRequestInfoFunction): void => {
    console.log('RELAY_CONSOLE', event);
  };
```

