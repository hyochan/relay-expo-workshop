import {FlatList, ListRenderItem, Text, View} from 'react-native';
import {
  PreloadedQuery,
  usePaginationFragment,
  usePreloadedQuery,
  useQueryLoader,
} from 'react-relay';
import React, {FC, Suspense, useEffect} from 'react';
import {usersFragment, usersQuery} from '../../relay/queries/User';

import {LoadingIndicator} from 'dooboo-ui';
import {RootStackNavigationProps} from '../navigations/RootStack';
import {UserFrag_user$key} from '../../__generated__/UserFrag_user.graphql';
import {UserUsersPaginationQuery} from '../../__generated__/UserUsersPaginationQuery.graphql';
import {UsersQuery} from '../../__generated__/UsersQuery.graphql';
import styled from '@emotion/native';

const Container = styled.View`
  flex: 1;
  background-color: transparent;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

type UserListProps = {
  usersQueryRef: PreloadedQuery<UsersQuery, Record<string, unknown>>;
};

const UserList: FC<UserListProps> = ({usersQueryRef}) => {
  const response = usePreloadedQuery<UsersQuery>(usersQuery, usersQueryRef);

  const {data, isLoadingNext, loadNext} = usePaginationFragment<
    UserUsersPaginationQuery,
    UserFrag_user$key
  >(usersFragment, response);

  const users = data?.users?.edges || [];

  const renderItem: ListRenderItem<typeof users[number]> = ({item}) => {
    return (
      <View
        style={{
          height: 120,
          backgroundColor: 'green',

          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>{item?.node?.id}</Text>
        <Text>{item?.node?.nickname}</Text>
        <Text>{item?.node?.name}</Text>
      </View>
    );
  };

  return (
    <FlatList
      style={{
        width: '100%',
        height: '100%',
      }}
      ItemSeparatorComponent={() => (
        <View style={{height: 1, backgroundColor: 'black'}} />
      )}
      contentContainerStyle={
        users?.length === 0
          ? {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }
          : undefined
      }
      keyExtractor={(item, index): string => index.toString()}
      data={users}
      renderItem={renderItem}
      refreshing={isLoadingNext}
      // onRefresh={() => {
      //   refetch(searchArgs, {fetchPolicy: 'network-only'});
      // }}
      onEndReachedThreshold={0.1}
      onEndReached={() => loadNext(10)}
    />
  );
};

interface Props {
  navigation: RootStackNavigationProps<'default'>;
}

const UserListContainer: FC<Props> = () => {
  const [usersQueryRef, loadUsersQuery] =
    useQueryLoader<UsersQuery>(usersQuery);

  useEffect(() => {
    loadUsersQuery({
      first: 10,
    });
  }, [loadUsersQuery]);

  return (
    <Container>
      <Suspense fallback={<LoadingIndicator />}>
        {usersQueryRef && <UserList usersQueryRef={usersQueryRef} />}
      </Suspense>
    </Container>
  );
};

export default UserListContainer;
