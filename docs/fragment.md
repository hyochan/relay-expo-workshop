# [Fragment](https://relay.dev/docs/guided-tour/rendering/fragments)

[Fragments](https://graphql.org/learn/queries/#fragments) are reusable units in GraphQL that represent a set of data to query from GraphQL type exposed in the [schema](https://graphql.org/learn/schema)

### Example

1. Change `meQuery` in `User.tsx` like below.

   ```graphql
   export const meQuery = graphql`
     query UserMeQuery {
       me {
         id
         email
         name
         nickname
         ...UserMore_me
       }
     }
   `;

   export const userMoreFragment = graphql`
     fragment UserMore_me on User {
       statusMessage
       verified
       photoURL
       thumbURL
       profile {
         authType
       }
     }
   `;
   ```

2. Run relay compiler
   ```sh
   relay-expo-workshop git:(master) ✗ yarn relay
   yarn run v1.22.10
   $ relay-compiler
   HINT: pass --watch to keep watching for changes.
 
   Writing ts
   Created:
   - UserMore_me.graphql.ts
   Updated:
   - UserMeQuery.graphql.ts
   Unchanged: 2 files
   Done in 0.65s.
   ```

3. Add `UserFragComp` fragment component in `Profile.tsx`.
   ```tsx
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
   ```

4. Render `UserFragComp` in `Profile`.
   ```diff
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
   +     {me && <UserFragComp userKey={me} />}
         <Button
           text="Go to ProfileLazy"
           style={{marginTop: 10}}
           onPress={() => {
             navigation.navigate('ProfileLazy');
           }}
         />
       </View>
     );
   };
   ```