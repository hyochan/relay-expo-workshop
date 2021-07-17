import {Button, EditText} from 'dooboo-ui';
import React, {FC, useState} from 'react';
import {
  UserSignInEmailMutation,
  UserSignInEmailMutationResponse,
} from '../../__generated__/UserSignInEmailMutation.graphql';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthPayload} from '../../types/graphql';
import {RootStackNavigationProps} from '../navigations/RootStack';
import {signInEmail} from '../../relay/queries/User';
import styled from '@emotion/native';
import {useMutation} from 'react-relay';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
  padding: 0 40px;

  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

interface Props {
  navigation: RootStackNavigationProps<'default'>;
}

const User: FC<Props> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [commitEmail, isInFlight] =
    useMutation<UserSignInEmailMutation>(signInEmail);

  const signIn = (): void => {
    const mutationConfig = {
      variables: {
        email,
        password,
      },

      onCompleted: (response: UserSignInEmailMutationResponse) => {
        const {token, user} = response.signInEmail as AuthPayload;

        AsyncStorage.setItem('token', token);

        console.log('user', user);
      },

      onError: (error: Error): void => {
        console.log('error', error);
      },
    };

    commitEmail(mutationConfig);
  };

  return (
    <Container>
      <EditText
        style={{marginTop: 48}}
        labelText="Email"
        placeholder="email@email.com"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
        onSubmitEditing={signIn}
      />
      <EditText
        style={{marginVertical: 24}}
        labelText="Password"
        secureTextEntry
        placeholder="******"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
        }}
        onSubmitEditing={signIn}
      />
      <Button onPress={signIn} text="Sign In" loading={isInFlight} />
    </Container>
  );
};

export default User;
