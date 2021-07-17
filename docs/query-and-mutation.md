# Queries and Mutations

We'll cover how to handle [graphql queries and mutations](https://graphql.org/learn/queries) in [relay](http://relay.dev).

## Mutation
We'll discover `mutation` queries first to create the data. Mutation query provides a way to modify server-side data.

### Example

1. Create `queries` dir under `relay` dir and create `User.tsx` file.
   ```
   relay/
   └── queries/
     └─ User.tsx
   ```

2. Add below `signUp` and `signInEmail` mutation queries.

   ```tsx
   import {graphql} from 'react-relay';
   
   export const signUp = graphql`
     mutation UserSignUpMutation($user: UserCreateInput!, $photoUpload: Upload) {
       signUp(user: $user, photoUpload: $photoUpload) {
         id
         email
         name
         photoURL
         verified
       }
     }
   `;
   
   export const signInEmail = graphql`
     mutation UserSignInEmailMutation($email: String!, $password: String!) {
       signInEmail(email: $email, password: $password) {
         token
         user {
           id
           email
           name
           photoURL
           verified
           profile {
             authType
           }
         }
       }
     }
   `;
   ```

3. Run relay compiler and generate types.

   ```
   (base) ➜ relay-expo-workshop git:(master) ✗ yarn relay
   yarn run v1.22.10
   $ relay-compiler
   HINT: pass --watch to keep watching for changes.
   
   Writing ts
   Created:
    - UserSignInEmailMutation.graphql.ts
    - UserSignUpMutation.graphql.ts
   Unchanged: 0 files
   Done in 0.62s.
   ```

4. Prepare sample [SignIn](https://gist.github.com/hyochan/8b090764a3ebd4450e04d2d99023822a) page.

   ```
   dooboo page SignIn
   ```

   ![image](https://user-images.githubusercontent.com/27461460/126028979-be152595-7998-499d-ae3a-d3cd1578f518.png)


5. Import packages and queries
   ```tsx
   import {UserSignInEmailMutation} from '../../__generated__/UserSignInEmailMutation.graphql';
   import {signInEmail} from '../../relay/queries/User';
   import {useMutation} from 'react-relay';
   ```

6. Use query
   1. Declare query
      ```tsx
      const [commitEmail, isInFlight] =
        useMutation<UserSignInEmailMutation>(signInEmail);
      ```

   2. Commit query in function
      ```tsx
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
      ```

7. Create user with local server
   ![image](https://user-images.githubusercontent.com/27461460/126030046-256bd4cb-5721-4f2f-9fe4-e0edbcc7b84f.png)

   - User: test@email.com
   - Password: password12

8. Get the correct response from the server
   ![image](https://user-images.githubusercontent.com/27461460/126030147-95b39c00-4ab5-4abb-8791-73ef05a3a5c4.png)

## Query

Now we'll try `query` and see how it works.

### Example of [preloaded query](https://relay.dev/docs/api-reference/use-preloaded-query)

1. Add `Profile` page.

   ```sh
   dooboo page Profile
   ```

2. Add `meQuery` in `User.tsx`.

   ```tsx
   export const meQuery = graphql`
     query UserMeQuery {
       me {
         id
         email
         name
         nickname
         statusMessage
         verified
         photoURL
         thumbURL
         profile {
           authType
         }
       }
     }
   `;
   ```

3. Run relay compiler.

   ```sh
   relay-expo-workshop git:(step3/queries-and-mutations) ✗ yarn relay
   yarn run v1.22.10
   $ relay-compiler
   HINT: pass --watch to keep watching for changes.
 
   Writing ts
   Created:
   - UserMeQuery.graphql.ts
   Unchanged: 2 files
   Done in 0.62s.
   ```

4. Create `Profile` page and add to `RootStack`. Here you can see the [sample of preloaded query](https://gist.github.com/hyochan/8b090764a3ebd4450e04d2d99023822a#gistcomment-3816183).

5. Navigate to `Profile` page when `signIn` completes in `SignIn` page.
   ```ts
   navigation.navigate('Profile');
   ```

### Example of [lazy load query](https://relay.dev/docs/api-reference/use-lazy-load-query)

