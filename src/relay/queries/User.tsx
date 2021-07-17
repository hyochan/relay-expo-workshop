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
