import React from "react";
import Content from "./../base/Content";
import { Input, Icon, Segment, Label } from "semantic-ui-react";
import debounce from "lodash/debounce";
import get from "lodash/get";
import { DefaultSaveButton } from "./_template";

export default class Text extends React.Component {
  render() {
    return (
      <Content
        previewData={{
          test: "haha"
        }}
        editor={props => {
          return (
            <div>
              <Input
                size="big"
                focus
                defaultValue={get(props, "defaultValues.price")}
                icon={<Icon name="tag" inverted circular link />}
                placeholder="Enter price offer..."
                onChange={debounce((_, { value }) => {
                  props.updateValues({
                    price: value
                  });
                }, 200)}
              />
              <DefaultSaveButton {...props} />
            </div>
          );
        }}
        view={props => (
          <div>
            <Label color="teal" tag size="large">
              Offer | <strong>{get(props, "values.price")}</strong>
            </Label>
          </div>
        )}
        compact={props => (
          <div>
            <Label color="teal" tag size="tiny">
              Offer | <strong>{get(props, "values.price")}</strong>
            </Label>
          </div>
        )}
        {...this.props}
      />
    );
  }
}
