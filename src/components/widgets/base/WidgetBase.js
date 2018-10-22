import React from "react";
import PropTypes from "prop-types";
import { Segment, Header, Label, Divider, Button } from "semantic-ui-react";
import Icon from "antd/lib/icon";
import { MODES } from "./../index";
import PostWidgetContext from "../../../contexts/WidgetContext";
import apolloClient from "lib/apollo";

class WidgetBase extends React.Component {
  state = { values: null, loading: false };

  render() {
    const {
      code,
      name,
      icon,
      editor,
      view,
      compact,
      mode = "view",
      defaultValues,
      onValuesChanged,
      previewData = {},
      preview,
      basic,
      style,
      _refNo,
      postRefNo,
      children
    } = this.props;
    const { values, loading } = this.state;
    return (
      <Segment basic={basic} key={code} style={style}>
        {mode === MODES.COMPACT ? (
          <Label basic style={{ float: "right" }}>
            <Icon {...icon} />
            {`  ${name}`}
          </Label>
        ) : (
          <Header>
            {mode === MODES.EDITOR && (
              <Icon type="edit" theme="twoTone" style={{ marginRight: 5 }} />
            )}
            <Icon {...icon} /> {name}
          </Header>
        )}
        <PostWidgetContext.Consumer>
          {context => {
            let RenderObj;
            switch (mode) {
              case "compact":
                RenderObj = compact;
                break;
              case "view":
                RenderObj = view;
                break;
              case "editor":
                RenderObj = editor;
                break;
              default:
                RenderObj = () => <span>Empty</span>;
            }
            const ownProps = {
              context,
              values: values ? values : defaultValues
            };
            if (preview) {
              ownProps.values = previewData;
            }
            console.log("moddd"); //TRACE
            console.log(mode, values); //TRACE
            return (
              <>
                <RenderObj
                  {...ownProps}
                  updateValues={newValues => {
                    const updatedValues = Object.assign({}, values, newValues);
                    this.setState({ values: updatedValues });
                    onValuesChanged && onValuesChanged(updatedValues);
                  }}
                />
                {mode === "editor" && children ? (
                  <>
                    <Divider />
                    <Button
                      content="Save"
                      icon="save"
                      size="small"
                      loading={context.submitting}
                      primary
                      onClick={async () => {
                        // await apolloClient.
                        console.log("values"); //TRACE
                        console.log(values); //TRACE
                        await context.submitWidgetsFn([
                          {
                            _refNo,
                            code,
                            name,
                            values: JSON.stringify(values),
                            postRefNo
                          }
                        ]);
                      }}
                    />
                    <Button content="Remove" icon="trash" size="small" basic />
                    {children({ save: () => this.save(), hello: "haha" })}
                  </>
                ) : (
                  children
                )}
              </>
            );
          }}
        </PostWidgetContext.Consumer>
      </Segment>
    );
  }
}

WidgetBase.propTypes = {
  code: PropTypes.string.isRequired,
  editor: PropTypes.func.isRequired,
  view: PropTypes.func.isRequired,
  compact: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default WidgetBase;
