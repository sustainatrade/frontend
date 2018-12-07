import React from 'react';
import Content from './../base/Content';
import { Input, Icon, Label } from 'semantic-ui-react';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { DefaultSaveButton } from './_template';

export default class Text extends React.Component {
  render() {
    return (
      <Content
        previewData={{
          test: 'haha'
        }}
        editor={props => {
          return (
            <div style={{ padding: 15 }}>
              <Input
                size="big"
                focus
                iconPosition="left"
                defaultValue={get(props, 'defaultValues.price')}
                icon={<Icon name="header" />}
                placeholder="Header text..."
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
          <div style={{ padding: '15px 10px' }}>
            <h2>{get(props, 'values.price')}</h2>
          </div>
        )}
        compact={props => (
          <div style={{ padding: '15px 10px' }}>
            <h2>{get(props, 'values.price')}</h2>
          </div>
        )}
        {...this.props}
      />
    );
  }
}
