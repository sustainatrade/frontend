export const TYPES = {
  NOT_LOGGED_IN: {
    eventName: "not-logged-in",
    description: "Not logged in",
    matcher(error) {
      return error.message === "Please login";
    }
  }
};
