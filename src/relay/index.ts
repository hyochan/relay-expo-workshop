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
