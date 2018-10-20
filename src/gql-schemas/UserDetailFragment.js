const USER_DETAIL_FRAGMENT = `
  fragment UserDetail on MeOutput {
    status
      user {
        id
        displayName
        roles
      }
      roles {
        code
        name
        isAdmin
      }
      socialServices{
        type
        accessToken{
          token
          expiration
        }
      }
  }
`;

export default USER_DETAIL_FRAGMENT;
