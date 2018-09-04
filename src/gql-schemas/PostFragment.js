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
}
`;

export default postFragment;
