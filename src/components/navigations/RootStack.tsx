import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';

import {NavigationContainer} from '@react-navigation/native';
import Profile from '../pages/Profile';
import ProfileLazy from '../pages/ProfileLazy';
import React from 'react';
import SignIn from '../pages/SignIn';
import {useTheme} from 'dooboo-ui';

export type RootStackParamList = {
  default: undefined;
  SignIn: undefined;
  Profile: undefined;
  ProfileLazy: undefined;
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
        initialRouteName="SignIn"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {color: theme.text},
          headerTintColor: theme.primary,
        }}
        headerMode={themeType === 'dark' ? 'screen' : 'float'}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ProfileLazy" component={ProfileLazy} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;
