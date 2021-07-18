# Relay Store

State management is Relay's bread & butter. "Relay store" is where cached queries & records are stored,
and you do not need to worry about state management for the most part. Relay is fairly good at guessing
when to use cached query results vs when to refetch queries. Also, it can update the cached records
when a new version is fetched.

However, there are time when we need to manually instruct Relay to update records.
Here are some examples of such cases:

- When a new message is received, Relay knows how to add the new message to the store but does not
  necessarily know how to append the new message to its corresponding channel.
- When the authenticated user follows another user, Relay knows how to increment the number of follows
  but does not necessarily know how to increment the other user's follower count.

For these cases where Relay does not know how to update the store appropriately,
a programmer should intervene and provide specific instruction on how to update the store.

There are two ways to achieve this:

1. Refetch the new version of updated record.
1. Manually modify the Relay store.

In this article, we will learn how to make modifications in Relay store
using `updater` & `optimisticUpdater` functions.

### Demo

Let's add a form to edit user's name. Relay knows how to update the name in Relay store by
reading the response of mutation request, but it takes a while (couple seconds) until
the client can receive a response from the GraphQL server.
Relay provides an option to update the Relay store immediately after request is made
and roll back this temporary update when it receives a response.

1. Create an empty `EditProfile` component.

   ```tsx
   const Root = styled.View`
     flex: 1;
     align-self: center;
     background-color: transparent;
     flex-direction: column;
     align-items: center;
     justify-content: center;
   `;

   const EditProfileContainer: FC = () => {
     return (
       <Root>
         <Text>Edit Profile</Text>
       </Root>
     );
   };

   export default EditProfileContainer;
   ```

1. Register a new path in `RootStackNavigator`.

   ```diff
   export type RootStackParamList = {
     default: undefined;
     SignIn: undefined;
     UserList: undefined;
     Profile: undefined;
     ProfileLazy: undefined;
   +  EditProfile: undefined;
   };
   ```

   ```diff
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
           <Stack.Screen name="UserList" component={UserList} />
           <Stack.Screen name="Profile" component={Profile} />
           <Stack.Screen name="ProfileLazy" component={ProfileLazy} />
   +        <Stack.Screen name="EditProfile" component={EditProfile} />
         </Stack.Navigator>
       </NavigationContainer>
   ```

1. Add a navigation button in `Profile`.

   ```diff
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
   +      <Button
   +        text="Go to EditProfile"
   +        style={{marginTop: 10}}
   +        onPress={() => {
   +          navigation.navigate('EditProfile');
   +        }}
   +      />
       </View>
     );
   ```

1. Add a preview section in `EditProfile` page.

   ```diff
   const Root = styled.View`
     flex: 1;
     align-self: center;
     background-color: transparent;
     flex-direction: column;
     align-items: center;
     justify-content: center;
   `;

   +const ProfilePreview: FC = () => {
   +  const {me} = useLazyLoadQuery<UserMeQuery>(meQuery, {});
   +
   +  return (
   +    <Fragment>
   +      <Text style={{fontWeight: 'bold'}}>Preview</Text>
   +      <Text>{`id: ${me?.id}`}</Text>
   +      <Text>{`email: ${me?.email}`}</Text>
   +      <Text>{`name: ${me?.name}`}</Text>
   +      <Text>{`nickname: ${me?.nickname}`}</Text>
   +    </Fragment>
   +  );
   +};

   const EditProfileContainer: FC = () => {
     return (
       <Root>
   -      <Text>Edit Profile</Text>
   +      <Suspense fallback={LoadingIndicator}>
   +        <ProfilePreview />
   +      </Suspense>
       </Root>
     );
   };

   export default EditProfileContainer;
   ```

1. Add a text input form for editing user's name.

   ```diff
   const Root = styled.View`
     flex: 1;
     align-self: center;
     background-color: transparent;
     flex-direction: column;
     align-items: center;
     justify-content: center;
   `;

   const ProfilePreview: FC = () => {
     const {me} = useLazyLoadQuery<UserMeQuery>(meQuery, {});

     return (
       <Fragment>
         <Text style={{fontWeight: 'bold'}}>Preview</Text>
         <Text>{`id: ${me?.id}`}</Text>
         <Text>{`email: ${me?.email}`}</Text>
         <Text>{`name: ${me?.name}`}</Text>
         <Text>{`nickname: ${me?.nickname}`}</Text>
       </Fragment>
     );
   };

   +const EditProfile: FC = () => {
   +  const [name, setName] = useState('');
   +
   +  return (
   +    <Fragment>
   +      <Text style={{fontWeight: 'bold', marginTop: 48}}>Edit</Text>
   +      <Fragment>
   +        <EditText
   +          style={{
   +            maxWidth: 200,
   +          }}
   +          labelText="Name"
   +          value={name}
   +          onChangeText={setName}
   +        />
   +        <Button
   +          text="Submit"
   +        />
   +      </Fragment>
   +    </Fragment>
   +  );
   +};

   const EditProfileContainer: FC = () => {
     return (
       <Root>
         <Suspense fallback={LoadingIndicator}>
           <ProfilePreview />
         </Suspense>
   +      <EditProfile />
       </Root>
     );
   };
   ```

1. Request GraphQL mutation on form submit.

   ```diff
   +const editProfileMutation = graphql`
   +  mutation EditProfileMutation($name: String!) {
   +    updateProfile(user: {name: $name}) {
   +      id
   +      name
   +    }
   +  }
   +`;

   const Root = styled.View`
     flex: 1;
     align-self: center;
     background-color: transparent;
     flex-direction: column;
     align-items: center;
     justify-content: center;
   `;

   const ProfilePreview: FC = () => {
     const {me} = useLazyLoadQuery<UserMeQuery>(meQuery, {});

     return (
       <Fragment>
         <Text style={{fontWeight: 'bold'}}>Preview</Text>
         <Text>{`id: ${me?.id}`}</Text>
         <Text>{`email: ${me?.email}`}</Text>
         <Text>{`name: ${me?.name}`}</Text>
         <Text>{`nickname: ${me?.nickname}`}</Text>
       </Fragment>
     );
   };

   const EditProfile: FC = () => {
     const [name, setName] = useState('');
   +  const [commit, isLoading] = useMutation<EditProfileMutation>(editProfileMutation);

     return (
       <Fragment>
         <Text style={{fontWeight: 'bold', marginTop: 48}}>Edit</Text>
         <Fragment>
           <EditText
             style={{
               maxWidth: 200,
             }}
             labelText="Name"
             value={name}
             onChangeText={setName}
           />
           <Button
             text="Submit"
   +          loading={isLoading}
   +          onPress={() => {
   +            commit({
   +              variables: {name},
   +            });
   +            setName('');
   +          }}
           />
         </Fragment>
       </Fragment>
     );
   };

   const EditProfileContainer: FC = () => {
     return (
       <Root>
         <Suspense fallback={LoadingIndicator}>
           <ProfilePreview />
         </Suspense>
         <EditProfile />
       </Root>
     );
   };
   ```

1. Add `optimisticUpdater` property to the mutation config object.
   An optimistic updater gets Relay store as the first parameter, so programmers can manually modify
   Relay store within the optimistic updater.
   Here, we change `root.me.name` to the new name.

   ```diff
   const editProfileMutation = graphql`
     mutation EditProfileMutation($name: String!) {
       updateProfile(user: {name: $name}) {
         id
         name
       }
     }
   `;

   const Root = styled.View`
     flex: 1;
     align-self: center;
     background-color: transparent;
     flex-direction: column;
     align-items: center;
     justify-content: center;
   `;

   const ProfilePreview: FC = () => {
     const {me} = useLazyLoadQuery<UserMeQuery>(meQuery, {});

     return (
       <Fragment>
         <Text style={{fontWeight: 'bold'}}>Preview</Text>
         <Text>{`id: ${me?.id}`}</Text>
         <Text>{`email: ${me?.email}`}</Text>
         <Text>{`name: ${me?.name}`}</Text>
         <Text>{`nickname: ${me?.nickname}`}</Text>
       </Fragment>
     );
   };

   const EditProfile: FC = () => {
     const [name, setName] = useState('');
     const [commit, isLoading] = useMutation<EditProfileMutation>(editProfileMutation);

     return (
       <Fragment>
         <Text style={{fontWeight: 'bold', marginTop: 48}}>Edit</Text>
         <Fragment>
           <EditText
             style={{
               maxWidth: 200,
             }}
             labelText="Name"
             value={name}
             onChangeText={setName}
           />
           <Button
             text="Submit"
             loading={isLoading}
             onPress={() => {
               commit({
                 variables: {name},
   +              optimisticUpdater: (store) => {
   +                const root = store.getRoot();
   +                const meProxy = root.getLinkedRecord('me');
   +                meProxy?.setValue(name, 'name');
   +              },
               });
               setName('');
             }}
           />
         </Fragment>
       </Fragment>
     );
   };

   const EditProfileContainer: FC = () => {
     return (
       <Root>
         <Suspense fallback={LoadingIndicator}>
           <ProfilePreview />
         </Suspense>
         <EditProfile />
       </Root>
     );
   };
   ```

Here's the final version of `EditProfile.tsx` file:

```tsx
import {Button, EditText, LoadingIndicator} from 'dooboo-ui';
import React, {FC, Fragment, Suspense, useState} from 'react';
import {graphql, useLazyLoadQuery, useMutation} from 'react-relay';

import {EditProfileMutation} from '../../__generated__/EditProfileMutation.graphql';
import {Text} from 'react-native';
import {UserMeQuery} from '../../__generated__/UserMeQuery.graphql';
import {meQuery} from '../../relay/queries/User';
import styled from '@emotion/native';

const editProfileMutation = graphql`
  mutation EditProfileMutation($name: String!) {
    updateProfile(user: {name: $name}) {
      id
      name
    }
  }
`;

const Root = styled.View`
  flex: 1;
  align-self: center;
  background-color: transparent;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProfilePreview: FC = () => {
  const {me} = useLazyLoadQuery<UserMeQuery>(meQuery, {});

  return (
    <Fragment>
      <Text style={{fontWeight: 'bold'}}>Preview</Text>
      <Text>{`id: ${me?.id}`}</Text>
      <Text>{`email: ${me?.email}`}</Text>
      <Text>{`name: ${me?.name}`}</Text>
      <Text>{`nickname: ${me?.nickname}`}</Text>
    </Fragment>
  );
};

const EditProfile: FC = () => {
  const [name, setName] = useState('');

  const [commit, isLoading] =
    useMutation<EditProfileMutation>(editProfileMutation);

  return (
    <Fragment>
      <Text style={{fontWeight: 'bold', marginTop: 48}}>Edit</Text>
      <Fragment>
        <EditText
          style={{
            maxWidth: 200,
          }}
          labelText="Name"
          value={name}
          onChangeText={setName}
        />
        <Button
          text="Submit"
          loading={isLoading}
          onPress={() => {
            commit({
              variables: {name},
              optimisticUpdater: (store) => {
                const root = store.getRoot();
                const meProxy = root.getLinkedRecord('me');
                meProxy?.setValue(name, 'name');
              },
            });
            setName('');
          }}
        />
      </Fragment>
    </Fragment>
  );
};

const EditProfileContainer: FC = () => {
  return (
    <Root>
      <Suspense fallback={LoadingIndicator}>
        <ProfilePreview />
      </Suspense>
      <EditProfile />
    </Root>
  );
};

export default EditProfileContainer;
```

### Updater VS Optimistic Updater

Both `updater` and `optimisticUpdater` can be used to modify Relay store, so what's the difference
between these two functions?

1. `optimisticUpdater` is called **before** the response while `updater` is called **after** the response.
   This allows programmers to control when to make changes to the Relay store.
1. `optimisticUpdater` is rolled back on response. Because `optimisticUpdater` is for making
   temporary changes to Relay store until the response arrives from server,
   any changes made to the store is rolled back when actual response is received
   (even after a successful response).
1. `optimisticUpdater` is always called while `updater` is only called after a successful response.

In short, `updater` is for making persistent changes after a successful GraphQL mutation
while `optimisticUpdater` is for making temporary changes.

### Read More About Relay Store!

- My Medium article: https://medium.com/dooboolab/how-to-update-relay-cache-d04ee074eb98
- Official Relay docs: https://relay.dev/docs/principles-and-architecture/runtime-architecture/
