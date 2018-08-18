const postFragment = `
fragment PostFragment on Post {
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
