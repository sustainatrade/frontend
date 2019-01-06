import React from 'react';
// import { createWidget } from "./lib";
// import { capitalize } from "lodash";
import config from './../../config';
import loadable from 'loadable-components';
import { Loader } from 'semantic-ui-react';
import WidgetBase from './base/WidgetBase';

const contents = {};
const registerTemplate = ({ code, name, tags, icon, color, description }) => {
  contents[code] = {
    code,
    name,
    tags,
    icon,
    color,
    description,
    component: loadable(() => import(`./contents/${code}`), {
      render: ({ Component, error, loading, ownProps }) => {
        if (error) return <div>Oups! {error.message}</div>;
        if (loading) return <Loader inline="centered" />;
        return (
          <Component
            {...ownProps}
            {...{
              code,
              name,
              tags,
              icon,
              description
            }}
          >
            {cProps => <WidgetBase {...cProps} />}
          </Component>
        );
      }
    })
  };
};

for (const tpl of config.contents) {
  registerTemplate(tpl);
}

const MODES = {
  VIEW: 'view',
  COMPACT: 'compact',
  EDITOR: 'editor'
};

export { contents, MODES };
