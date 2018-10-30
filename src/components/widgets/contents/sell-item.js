import React, { Component } from "react";
import WidgetBase from "./../base/WidgetBase";
import get from "lodash/get";
import debounce from "lodash/debounce";
import { MODES } from "../index";
import { Icon, Input, Dropdown, Label } from "semantic-ui-react";
import { categoryArray, getCategory } from "./buy-item";

const options = [{ key: "php", text: "Php", value: "php" }];

const SellItemView = props => {
  const cat = getCategory(props);
  return (
    <div>
      <Label basic size="small" pointing="right" color="green">
        SELLING
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
    </div>
  );
};

export default class SellItem extends Component {
  render() {
    return (
      <WidgetBase
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
        view={props => <SellItemView {...props} />}
        compact={props => <SellItemView {...props} />}
        onSave={props => {}}
        {...this.props}
      />
    );
  }
}
