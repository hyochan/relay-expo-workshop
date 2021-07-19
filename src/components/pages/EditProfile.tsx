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
