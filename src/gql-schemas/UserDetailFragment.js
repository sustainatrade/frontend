const USER_DETAIL_FRAGMENT = `
  fragment UserDetail on MeOutput {
    status
      user {
        id
        displayName
        roles
        photoUrl
        editDate
        editBy
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
