import React from "react";
import { Segment } from "semantic-ui-react";
import loadable from "loadable-components";

const createSectionAction = importObj => {
  return loadable(() => import(`./${importObj}`), {
    render: ({ Component, loading, ownProps }) => {
      if (loading) return <div>Loading...</div>;
      return <Component {...ownProps} />;
    }
  });
};

// const Report = loadable(() => import("./Report"), {
//   render: ({ Component, loading, ownProps }) => {
//     if (loading) return <div>Loading...</div>;
//     return <Component {...ownProps} />;
//   }
// });
//TODO: add dynamic section load from config here here
const Report = createSectionAction("Report");

export default class SectionActions extends React.Component {
  render() {
    const buttonProps = { size: "huge", compact: true };
    return (
      <Segment basic textAlign="right">
        {/* <Button {...buttonProps} primary>
          <Icon name="edit" />
          Answer
        </Button> */}
        <Report {...buttonProps} />
      </Segment>
    );
  }
}
