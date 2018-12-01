import gql from 'graphql-tag';
import USER_DETAIL_FRAGMENT from './UserDetailFragment';

const key = `GetMe`;
const query = gql`
${USER_DETAIL_FRAGMENT}
query ${key} {
  Me {
    ...UserDetail
  }
}
`;

export const GET_ME = { key, query };
