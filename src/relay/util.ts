import {LogRequestInfoFunction} from 'relay-runtime';

export const relayTransactionLogger =
  () =>
  (event: LogRequestInfoFunction): void => {
    console.log('RELAY_CONSOLE', event);
  };
