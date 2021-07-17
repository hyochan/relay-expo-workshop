import {PreloadedQuery, usePreloadedQuery, useQueryLoader} from 'react-relay';
import React, {FC, Suspense, useEffect} from 'react';
import {Text, View} from 'react-native';

import {LoadingIndicator} from 'dooboo-ui';
import {RootStackNavigationProps} from '../navigations/RootStack';
import {UserMeQuery} from '../../__generated__/UserMeQuery.graphql';
import {meQuery} from '../../relay/queries/User';
import styled from '@emotion/native';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

type ProfileProps = {
  meQueryReference: PreloadedQuery<UserMeQuery, Record<string, unknown>>;
};

const Profile: FC<ProfileProps> = ({meQueryReference}) => {
  const {me} = usePreloadedQuery<UserMeQuery>(meQuery, meQueryReference);

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
