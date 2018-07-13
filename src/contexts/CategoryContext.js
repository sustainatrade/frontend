import React from "react";
import gql from "graphql-tag";
import apolloClient from "./../lib/apollo";
import lscache from "lscache";

const Context = React.createContext();
const { Consumer } = Context;

const CATEGORY_LIST = gql`
  query {
    CategoryList {
      list {
        id
        name
        icon
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
  async loadCategories() {
    const self = this;
    self.setState({ loading: true });
    let CategoryList = lscache.get("sat-categories");

    if (!CategoryList) {
      const { data } = await apolloClient.query({
        query: CATEGORY_LIST
      });
      CategoryList = data.CategoryList;
      lscache.set("sat-categories", CategoryList);
    }

    let catMap = {};
    let iconMap = {};
    CategoryList.list.forEach(cat => {
      catMap[cat.id] = cat.name;
      iconMap[cat.id] = cat.icon;
    });

    self.setState({ categories: catMap, icons: iconMap, loading: undefined });
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
