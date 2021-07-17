# Relay Cursor Pagination

You can read more about pagination in [Redner List Data and Pagination](https://relay.dev/docs/guided-tour/list-data/connections) in relay doc.

In relay, cursor pagination is supported which specification is described in [GraphQL Cursor Connections Sepecification](https://relay.dev/graphql/connections.htm).

### Example

We'll create a [UserList] page and consume `users` connection query in local [HackaTalk server](https://website.hackatalk.dev/docs/server/installation).

1. Create [UserList] page and put them in `RootStack`.

   ```
   dooboo page UserList
   ```

2. Add `usersQuery` and `usersFragment` in `User.tsx`.
   ```tsx
   export const usersQuery = graphql`
     query UserUsersPaginationQuery(
       $first: Int!
       $after: String
       $searchText: String
     ) {
       ...UserFrag_user
         @arguments(first: $first, after: $after, searchText: $searchText)
     }
   `;

   export const usersFragment = graphql`
     fragment UserFrag_user on Query
     @argumentDefinitions(
       first: {type: "Int"}
       after: {type: "String"}
       searchText: {type: "String"}
     )
     @refetchable(queryName: "UsersQuery") {
       users(first: $first, after: $after, searchText: $searchText)
         @connection(key: "SearchUserComponent_users") {
         edges {
           cursor
           node {
             id
             photoURL
             nickname
             name
             statusMessage
             isOnline
             hasBlocked
           }
         }
         pageInfo {
           hasNextPage
           endCursor
         }
       }
     }
   `;
   ```

3. Run relay compiler
   ```sh
   relay-expo-workshop git:(step5/relay-cursor-pagination) ✗ yarn relay
   yarn run v1.22.10
   $ relay-compiler
   HINT: pass --watch to keep watching for changes.

   Writing ts
   Created:
   - UserUsersPaginationQuery.graphql.ts
   - UsersQuery.graphql.ts
   - UserFrag_user.graphql.ts
   Unchanged: 4 files
   Done in 0.80s.
   ```

4. Add button to navigate from `Profile` page.
   ```tsx
   <Button
     text="Go to UserList"
     style={{marginTop: 10}}
     onPress={() => {
       navigation.navigate('UserList');
     }}
   />
   ```

5. Use cursor pagination query in `UserList` page.
   1. Create `UserListContainer` component with query loader.
      ```tsx
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
      ```
   2. Create `UserList` component with `FlatList`.
      ```tsx
      const UserList: FC<UserListProps> = ({usersQueryRef}) => {
         const response = usePreloadedQuery<UsersQuery>(usersQuery, usersQueryRef);

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
             style={{ width: '100%' height: '100%' }}
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
      ```
   3. Integrate `usersQuery`.
      ```tsx
      const response = usePreloadedQuery<UsersQuery>(usersQuery, usersQueryRef);
      ```

   4. Lastly, query pagination fragment using `usePaginationFragment`.
      ```tsx
      const {data, isLoadingNext, loadNext} = usePaginationFragment<
        UserUsersPaginationQuery,
        UserFrag_user$key
      >(usersFragment, response);

      const users = data?.users?.edges || [];
      ```

The final [sourcecode for the UserList component is here](https://gist.github.com/hyochan/8b090764a3ebd4450e04d2d99023822a#gistcomment-3816264).


## The result

![users](https://user-images.githubusercontent.com/27461460/126039176-e65d509c-70a9-4575-b2d4-4871a1170484.gif)
