import React from "react";
import gql from "graphql-tag";
import apolloClient from "./../lib/apollo";
import lscache from "lscache";
import keyBy from "lodash/keyBy";
import { sections } from "./../config";

const Context = React.createContext();
const { Consumer } = Context;

const CATEGORY_LIST = gql`
  query($sections: [String]!) {
    CategoryList(sections: $sections) {
      ver
      list {
        id
        name
        icon
        sections
      }
    }
  }
`;

class Provider extends React.Component {
  state = {
    reloadFn: () => {
      return this.loadCategories();
    }
  };

  setCategories(list) {
    let catMap = {};
    let iconMap = {};
    list.forEach(cat => {
      catMap[cat.id] = cat.name;
      iconMap[cat.id] = cat.icon;
    });

    this.setState({ categories: catMap, icons: iconMap, loading: undefined });
  }

  async loadCategories() {
    const self = this;
    self.setState({ loading: true });
    let CategoryList = lscache.get("sat-categories");

    if (CategoryList) {
      this.setCategories(CategoryList.list);
    }
    const sectionKeys = keyBy(sections, "key");
    const { data } = await apolloClient.query({
      query: CATEGORY_LIST,
      variables: {
        sections: Object.keys(sectionKeys)
      }
    });
    CategoryList = data.CategoryList;
    this.setCategories(CategoryList.list);
    lscache.set("sat-categories", CategoryList);
  }
  async componentWillMount() {
    await this.loadCategories();
  }

  render() {
    const { children } = this.props;
    return <Context.Provider value={this.state}>{children}</Context.Provider>;
  }
}

export default {
  Provider,
  Consumer
};
