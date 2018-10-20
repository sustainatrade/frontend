import React, { Component } from "react";
import { Segment, Icon, Grid } from "semantic-ui-react";
import { GlobalConsumer } from "./../../contexts";
import PostWidget from "./../post-view/PostWidget";

export default class CreateWidget extends Component {
  render() {
    return (
      <div>
        <GlobalConsumer>
          {({
            createPost: {
              photos,
              form,
              formErrors,
              loading,
              updateForm,
              modalOpened,
              widgets,
              addWidget,
              editWidget,
              deleteWidget,
              undeleteWidget,
              closeModal,
              submit
            },
            category: { categories },
            uploader: { upload, status, isUploading },
            widget: { submitWidgetsFn, selectWidgetFn }
          }) => (
            <React.Fragment>
              <Grid doubling stretched columns={1}>
                {widgets.map((widget, index) => {
                  const widgetProps = {
                    key: widget.key,
                    fluid: true,
                    editable: true,
                    onEdit: data => {
                      editWidget(index, data);
                    },
                    onDelete: () => {
                      deleteWidget(index);
                    }
                  };
                  if (widget._refNo) {
                    widgetProps.fromRefNo = widget._refNo;
                  }
                  widgetProps.data = widget;
                  if (widget.__deleted)
                    return (
                      <Grid.Column key={`post-widget-${index}`}>
                        <Segment>
                          <center>
                            Deleted
                            {` `}
                            {/*eslint-disable-next-line*/}
                            <a onClick={() => undeleteWidget(index)}>Undo</a>
                          </center>
                        </Segment>
                      </Grid.Column>
                    );
                  return (
                    <Grid.Column key={`post-widget-${index}`}>
                      <PostWidget {...widgetProps} />
                    </Grid.Column>
                  );
                })}
              </Grid>
              <Segment
                compact
                textAlign="center"
                className="ant-upload ant-upload-select-picture-card"
                style={{ width: 104, height: 104 }}
                onClick={async () => {
                  const widgetData = await selectWidgetFn();
                  console.log("add widget");

                  if (widgetData) addWidget(widgetData);
                }}
              >
                <Icon.Group size="huge">
                  <Icon name="window restore outline" />
                  <Icon corner name="add" />
                </Icon.Group>
                <div>Add Spec</div>
              </Segment>
            </React.Fragment>
          )}
        </GlobalConsumer>
      </div>
    );
  }
}
