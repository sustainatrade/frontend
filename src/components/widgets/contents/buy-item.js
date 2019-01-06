import React, { Component } from 'react';
import Content from './../base/Content';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import { Divider, Icon, Label, Input, Dropdown, Segment, Popup, Grid, Button } from 'semantic-ui-react';
import AntButton from 'antd/lib/button';
import { DefaultSaveButton, DIVIDER_COLOR } from './_template';
import { fromJS } from 'immutable';

const options = [{ key: 'php', text: 'Php', value: 'php' }];

export const categoryArray = [
  {
    key: 1,
    name: 'Animal Slurry',
    icon: 'paw'
  },
  {
    key: 2,
    name: 'Agricultural ByProducts',
    icon: 'leaf'
  },
  {
    key: 3,
    name: 'Aluminum',
    icon: 'cube'
  },
  {
    key: 4,
    name: 'Batteries',
    icon: 'battery full'
  },
  {
    key: 5,
    name: 'Chemicals',
    icon: 'flask'
  },
  {
    key: 6,
    name: 'Electronics',
    icon: 'tv'
  },
  {
    key: 7,
    name: 'Glass',
    icon: 'columns'
  },
  {
    key: 8,
    name: 'Hospital Waste',
    icon: 'hospital'
  },
  {
    key: 9,
    name: 'Ink Cartridges',
    icon: 'eye dropper'
  },
  {
    key: 10,
    name: 'Metals',
    icon: 'cubes'
  },
  {
    key: 11,
    name: 'Mixed Waste',
    icon: 'cogs'
  },
  {
    key: 12,
    name: 'Paper',
    icon: 'newspaper outline'
  },
  {
    key: 13,
    name: 'Plastic',
    icon: 'ticket'
  },
  {
    key: 14,
    name: 'Rubber tires',
    icon: 'life ring'
  },
  {
    key: 15,
    name: 'Tetra Paks',
    icon: 'shopping bag'
  },
  {
    key: 16,
    name: 'Tin Cans',
    icon: 'trash'
  },
  {
    key: 17,
    name: 'Used Oil',
    icon: 'tint'
  }
];

export function getCategory(props) {
  const cat = get(props, 'values.category');
  let category;
  if (cat) {
    category = categoryArray.find(c => c.key === cat);
    return category;
  }
  return {};
}

const BuyItemView = props => {
  const cat = getCategory(props);
  const style = props.compact ? {} : { fontSize: 'large' };
  const wrapStyle = {};
  if (props.compact) {
    wrapStyle.padding = '5px 0px';
    wrapStyle.backgroundColor = 'inherit';
  }
  return (
    <>
      <Segment style={wrapStyle} basic>
        {!props.compact && (
          <div style={{ paddingBottom: 5 }}>
            <Label basic size="tiny" color="orange">
              BUYING
            </Label>
          </div>
        )}
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
      {!props.compact && (
        <div style={{ backgroundColor: DIVIDER_COLOR, padding: 5, paddingBottom: 0 }}>
          <Button floated="right" primary content="Create Quote" size="mini" />
          <Popup trigger={<Button floated="right" basic icon="reply" size="mini" />} content="Add Comment" />
          <Divider hidden fitted clearing />
        </div>
      )}
    </>
  );
};

export function Shortcut({ loading, postData, shortcutOptions }) {
  const { onSelect } = shortcutOptions;
  console.log('postData', postData); //TRACE
  const widgets = get(postData, 'widgets', []);
  let hasSelling, hasBuying, hasTags;
  widgets.forEach(w => {
    switch (w.code) {
      case 'buy-item':
        hasBuying = true;
        break;
      case 'sell-item':
        hasSelling = true;
        break;
      case 'tags':
        hasTags = true;
        break;
    }
  });
  const hasItem = hasBuying || hasSelling;
  return (
    <>
      {!hasItem && (
        <Popup
          wide
          trigger={
            <AntButton type="dashed" loading={loading} size="large" icon="plus">
              Add Item
            </AntButton>
          }
          on="click"
        >
          <Grid divided columns="equal">
            <Grid.Column>
              <Button
                color="green"
                basic
                loading={loading}
                content="Sell Item"
                fluid
                onClick={() => {
                  onSelect && onSelect('sell-item');
                }}
              />
            </Grid.Column>
            <Grid.Column>
              <Button
                color="orange"
                basic
                loading={loading}
                content="Buy Item"
                fluid
                onClick={() => {
                  onSelect && onSelect('buy-item');
                }}
              />
            </Grid.Column>
          </Grid>
        </Popup>
      )}
      {hasItem && (
        <AntButton
          type="dashed"
          loading={loading}
          size="large"
          icon="plus"
          style={{ marginRight: 5, marginBottom: 5 }}
          onClick={() => {
            onSelect && onSelect('text');
          }}
        >
          Add Description
        </AntButton>
      )}
      {hasItem && !hasTags && (
        <AntButton
          type="dashed"
          loading={loading}
          size="large"
          icon="plus"
          onClick={() => {
            onSelect && onSelect('tags');
          }}
        >
          Add Tags
        </AntButton>
      )}
    </>
  );
}

function Editor(props) {
  const [values, setValues] = React.useState(fromJS(props.defaultValues || {}));
  return (
    <div style={{ padding: 15 }}>
      <div>
        <strong>Buy Item</strong>
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

export default class BuyItem extends Component {
  render() {
    return (
      <Content
        previewData={{
          test: 'haha',
          price: { currency: 'Php', amount: 100000 },
          category: 2
        }}
        editor={Editor}
        view={props => <BuyItemView {...props} />}
        compact={props => <BuyItemView {...props} compact />}
        shortcut={Shortcut}
        onSave={props => {}}
        {...this.props}
      />
    );
  }
}
