import gql from "graphql-tag";

const key = `GetUserInfo`;
const query = gql`
  query ${key} ($_refNo: String, $username: String, $email: String, $accessToken: String, $providerId: String) {
    UserInfo(input:{
      _refNo: $_refNo
      accessToken: $accessToken
      providerId: $providerId
      username: $username
      email: $email
    }){
      status
      user{
        id
        displayName
        photoUrl
      }
    }
  }
`;

export const GetUserInfo = { key, query };
