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
