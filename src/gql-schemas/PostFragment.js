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
  widgets {
    id
    code
    values
    postRefNo
    name
    displayName
  }
}
`;

export default postFragment;
