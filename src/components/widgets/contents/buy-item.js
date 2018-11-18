import React, { Component } from "react";
import Content from "./../base/Content";
import get from "lodash/get";
import debounce from "lodash/debounce";
import { MODES } from "../index";
import { Icon, Label, Input, Dropdown, Segment } from "semantic-ui-react";

const options = [{ key: "php", text: "Php", value: "php" }];

export const categoryArray = [
  {
    key: 1,
    name: "Animal Slurry",
    icon: "paw"
  },
  {
    key: 2,
    name: "Agricultural ByProducts",
    icon: "leaf"
  },
  {
    key: 3,
    name: "Aluminum",
    icon: "cube"
  },
  {
    key: 4,
    name: "Batteries",
    icon: "battery full"
  },
  {
    key: 5,
    name: "Chemicals",
    icon: "flask"
  },
  {
    key: 6,
    name: "Electronics",
    icon: "tv"
  },
  {
    key: 7,
    name: "Glass",
    icon: "columns"
  },
  {
    key: 8,
    name: "Hospital Waste",
    icon: "hospital"
  },
  {
    key: 9,
    name: "Ink Cartridges",
    icon: "eye dropper"
  },
  {
    key: 10,
    name: "Metals",
    icon: "cubes"
  },
  {
    key: 11,
    name: "Mixed Waste",
    icon: "cogs"
  },
  {
    key: 12,
    name: "Paper",
    icon: "newspaper outline"
  },
  {
    key: 13,
    name: "Plastic",
    icon: "ticket"
  },
  {
    key: 14,
    name: "Rubber tires",
    icon: "life ring"
  },
  {
    key: 15,
    name: "Tetra Paks",
    icon: "shopping bag"
  },
  {
    key: 16,
    name: "Tin Cans",
    icon: "trash"
  },
  {
    key: 17,
    name: "Used Oil",
    icon: "tint"
  }
];

export function getCategory(props) {
  const cat = get(props, "values.category");
  let category;
  if (cat) {
    category = categoryArray.find(c => c.key === cat);
    return category;
  }
  return {};
}

const BuyItemView = props => {
  const cat = getCategory(props);
  return (
    <Segment secondary basic>
      <Label basic size="small" pointing="right" color="orange">
        BUYING
      </Label>
      |{"  "}
      <b>
        {get(props, "values.price.currency")}{" "}
        {get(props, "values.price.amount")}
      </b>{" "}
      |{" "}
      {cat && (
        <>
          <a href="#search">
            <Icon name={cat.icon} />
            {cat.name}
          </a>
        </>
      )}
    </Segment>
  );
};

export default class BuyItem extends Component {
  render() {
    return (
      <Content
        previewData={{
          test: "haha",
          price: { currency: "Php", amount: 100000 },
          category: 2
        }}
        editor={props => {
          return (
            <div>
              <Input
                style={{ marginRight: 10, marginBottom: 5 }}
                defaultValue={get(props, "defaultValues.price.amount")}
                label={<Dropdown defaultValue="php" options={options} />}
                placeholder="Enter amount"
                onChange={debounce((_, { value }) => {
                  // const newPrice = Object.assign(oldPrice, { amount: value });
                  props.updateValues({
                    price: { amount: value, currency: "Php" }
                  });
                }, 200)}
              />
              <Dropdown
                placeholder="Select Category"
                search
                selection
                defaultValue={get(props, "defaultValues.category")}
                onChange={(_, { value }) => {
                  props.updateValues({
                    category: value
                  });
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
          );
        }}
        view={props => <BuyItemView {...props} />}
        compact={props => <BuyItemView {...props} />}
        onSave={props => {}}
        {...this.props}
      />
    );
  }
}
