import * as React from 'react';

import {Button, Text, View} from 'react-native';
import {ResettableRelayProvider, useReducerContext} from '../ResettableRelayProvider';
import {RenderAPI, render} from '@testing-library/react-native';

const FakeChild = (): React.ReactElement => {
  const {state, setUser} = useReducerContext();

  return (
    <View>
      <Text testID="TEXT">{JSON.stringify(state, null, 2)}</Text>
      <Button
        testID="BUTTON"
        onPress={(): void => {
          setUser({
            displayName: 'test',
          });
        }}
        title="Button"
      />
    </View>
  );
};

describe('[ResettableRelayProvider] rendering test', () => {
  const component = (
    <ResettableRelayProvider>
      <FakeChild />
    </ResettableRelayProvider>
  );

  const testingLib: RenderAPI = render(component);

  it('component and snapshot matches', () => {
    const baseElement = testingLib.toJSON();

    expect(baseElement).toMatchSnapshot();
    expect(baseElement).toBeTruthy();
  });
});

// TODO: add more interaction test, refer to ThemeProvider test
