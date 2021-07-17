import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import User from '../pages/User';
import {useTheme} from 'dooboo-ui';

export type RootStackParamList = {
  default: undefined;
  User: undefined;
};

export type RootStackNavigationProps<
  T extends keyof RootStackParamList = 'default',
> = StackNavigationProp<RootStackParamList, T>;

const Stack = createStackNavigator<RootStackParamList>();

function RootStack(): React.ReactElement {
  const {theme, themeType} = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="User"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {color: theme.text},
          headerTintColor: theme.primary,
        }}
        headerMode={themeType === 'dark' ? 'screen' : 'float'}>
        <Stack.Screen name="User" component={User} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;
