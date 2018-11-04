const postFragment = `
fragment PostFragment on Post {
  id
  _refNo
  title
  section
  category
  description
  photos
  tags
  createdBy
  createdDate
  followerCount
  isFollowing
  parentPostRefNo
  widgets {
    id
    code
    values
    postRefNo
    name
    displayName
    _refNo
  }
}
`;

export default postFragment;
