import React, { Component } from 'react';
import Content from './../base/Content';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import { Divider, Icon, Label, Input, Dropdown, Segment, Popup, Grid, Button } from 'semantic-ui-react';
import AntButton from 'antd/lib/button';
import { DefaultSaveButton } from './_template';
import { fromJS } from 'immutable';
import { Shortcut, getCategory, categoryArray } from './buy-item';

const options = [{ key: 'php', text: 'Php', value: 'php' }];

const SellItemView = props => {
  const cat = getCategory(props);
  const style = props.compact ? {} : { fontSize: 'large' };
  const wrapStyle = { backgroundColor: 'honeydew' };
  if (props.compact) {
    wrapStyle.padding = '5px 0px';
    wrapStyle.backgroundColor = 'inherit';
  }
  return (
    <Segment style={wrapStyle} basic>
      <div style={{ paddingBottom: 5 }}>
        <Label basic size="tiny" color="green">
          SELLING
        </Label>
      </div>
      <div style={style}>
        <b>{get(props, 'values.itemName')}</b> |{' '}
        {cat && (
          <>
            <a href="#search">
              <Icon name={cat.icon} />
              {cat.name}
            </a>
          </>
        )}
        <span style={{ float: 'right', fontWeight: 'bold' }}>
          {get(props, 'values.price.currency')} {get(props, 'values.price.amount')}
        </span>
      </div>
      {/* {!props.compact && <Divider />} */}
    </Segment>
  );
};

function Editor(props) {
  const [values, setValues] = React.useState(fromJS(props.defaultValues || {}));
  return (
    <div style={{ padding: 15 }}>
      <div>
        <strong>Sell Item</strong>
      </div>
      <Divider />
      <div>
        <Input
          placeholder="Item Name"
          defaultValue={values.get('itemName')}
          onChange={debounce((_, { value }) => {
            setValues(map => map.set('itemName', value));
          }, 200)}
        />
      </div>
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Dropdown
          placeholder="Select Category"
          search
          selection
          defaultValue={values.get('category')}
          onChange={(_, { value }) => {
            setValues(map => map.set('category', value));
          }}
          labeled
          options={categoryArray.map(({ key, icon, name }) => ({
            key,
            value: key,
            text: name,
            label: { basic: true, icon, circular: true }
          }))}
        />
      </div>
      <div>
        <Input
          defaultValue={values.get('price.amount')}
          label={<Dropdown defaultValue="php" options={options} />}
          placeholder="Enter amount"
          onChange={debounce((_, { value }) => {
            setValues(map => map.set('price', { amount: value, currency: 'Php' }));
          }, 200)}
        />
      </div>
      <DefaultSaveButton {...props} onSave={() => props.actions.save(values.toJS())} />
    </div>
  );
}

export default class SellItem extends Component {
  render() {
    return (
      <Content
        previewData={{
          test: 'haha',
          price: { currency: 'Php', amount: 100000 },
          category: 2
        }}
        editor={Editor}
        view={props => <SellItemView {...props} />}
        compact={props => <SellItemView {...props} compact />}
        shortcut={Shortcut}
        onSave={props => {}}
        {...this.props}
      />
    );
  }
}
