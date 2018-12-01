import gql from 'graphql-tag';
// import USER_DETAIL_FRAGMENT from './UserDetailFragment';

const key = `UpdateUserInfo`;
const query = gql`
  mutation($updates: UpdateUserInfoInput) {
    ${key}(input:$updates){
      user{
        id
        displayName
        photoUrl
      }
    }
  }
`;

export const UPDATE_USER_PROFILE = { key, query };
