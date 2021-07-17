import React, {FC, Suspense} from 'react';
import {Text, View} from 'react-native';

import {LoadingIndicator} from 'dooboo-ui';
import {RootStackNavigationProps} from '../navigations/RootStack';
import {UserMeQuery} from '../../__generated__/UserMeQuery.graphql';
import {meQuery} from '../../relay/queries/User';
import styled from '@emotion/native';
import {useLazyLoadQuery} from 'react-relay';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Profile: FC = () => {
  const {me} = useLazyLoadQuery<UserMeQuery>(meQuery, {});

  return (
    <View>
      <Text>{me?.email}</Text>
      <Text>{me?.name}</Text>
      <Text>{me?.nickname}</Text>
      <Text>{me?.statusMessage}</Text>
    </View>
  );
};

interface Props {
  navigation: RootStackNavigationProps<'default'>;
}

const ProfileContainer: FC<Props> = () => {
  return (
    <Container>
      <Suspense fallback={<LoadingIndicator />}>
        <Profile />
      </Suspense>
    </Container>
  );
};

export default ProfileContainer;
