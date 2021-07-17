import {Button, LoadingIndicator} from 'dooboo-ui';
import {
  PreloadedQuery,
  useFragment,
  usePreloadedQuery,
  useQueryLoader,
} from 'react-relay';
import React, {FC, Suspense, useEffect} from 'react';
import {Text, View} from 'react-native';
import {meQuery, userMoreFragment} from '../../relay/queries/User';

import {RootStackNavigationProps} from '../navigations/RootStack';
import {UserMeQuery} from '../../__generated__/UserMeQuery.graphql';
import {UserMore_me$key} from '../../__generated__/UserMore_me.graphql';
import styled from '@emotion/native';
import {useNavigation} from '@react-navigation/core';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

type UserFragProps = {
  userKey: UserMore_me$key;
};

const UserFragComp: FC<UserFragProps> = ({userKey}) => {
  const data = useFragment(userMoreFragment, userKey);

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>{data?.statusMessage}</Text>
      <Text>{data?.photoURL}</Text>
      <Text>{data?.profile?.authType}</Text>
      <Text>{data?.verified}</Text>
    </View>
  );
};

type ProfileProps = {
  meQueryReference: PreloadedQuery<UserMeQuery, Record<string, unknown>>;
};

const Profile: FC<ProfileProps> = ({meQueryReference}) => {
  const {me} = usePreloadedQuery<UserMeQuery>(meQuery, meQueryReference);
  const navigation = useNavigation();

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>{me?.email}</Text>
      <Text>{me?.name}</Text>
      <Text>{me?.nickname}</Text>
      {me && <UserFragComp userKey={me} />}
      <Button
        text="Go to ProfileLazy"
        style={{marginTop: 10}}
        onPress={() => {
          navigation.navigate('ProfileLazy');
        }}
      />
      <Button
        text="Go to UserList"
        style={{marginTop: 10}}
        onPress={() => {
          navigation.navigate('UserList');
        }}
      />
    </View>
  );
};

interface Props {
  navigation: RootStackNavigationProps<'default'>;
}

const ProfileContainer: FC<Props> = () => {
  const [meQueryReference, loadMeQuery] = useQueryLoader<UserMeQuery>(meQuery);

  useEffect(() => {
    loadMeQuery({});
  }, [loadMeQuery]);

  return (
    <Container>
      <Suspense fallback={<LoadingIndicator />}>
        {meQueryReference && <Profile meQueryReference={meQueryReference} />}
      </Suspense>
    </Container>
  );
};

export default ProfileContainer;
