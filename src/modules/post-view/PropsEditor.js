import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
    Form,
    List
} from 'semantic-ui-react'

const PROP_TYPE_NAMES = _.compact(
    Object.keys(PropTypes).map(k => {
      if (PropTypes[k] && PropTypes[k].name === "bound checkType") {
        return k;
      }
      return undefined;
    })
  );
function getPropTypeName(propType) {
    for (const pName of PROP_TYPE_NAMES) {
      if (
        propType === PropTypes[pName] ||
        propType === PropTypes[pName].isRequired
      ) {
        return pName;
      }
    }
  }

function resolveValue(value){
  let pFnc = value;
  if (typeof value === 'function')
    pFnc = value();
  return Promise.resolve(pFnc)
}

export default class PropsEditor extends Component {
    state = {}
  async triggerChange(){
    const { onChange, propTypes } = this.props;
    const changedProps = Object.assign({},this.state);
    delete changedProps.propsTypes;
    delete changedProps.propsTypeOptions;
    const thePropTypes = await resolveValue(propTypes)
    //TODO: add field validation
    PropTypes.checkPropTypes(thePropTypes, changedProps, 'prop', 'MyComponent');
    onChange && onChange({
        propTypes:this.state.propsTypes,
        propValues:changedProps});
  }
  
  async componentDidMount(){
      const { propTypes={}, propTypeOptions={} } = this.props;
      const thePropTypes = await resolveValue(propTypes)
      const propsTypeOptions = await resolveValue(propTypeOptions)
      const propsTypes = {}
      for (const propKey in thePropTypes) {
          propsTypes[propKey] = getPropTypeName(thePropTypes[propKey]);
      }
      this.setState({ propsTypes, propsTypeOptions })
  }

  render() {
    const { propsTypes, propsTypeOptions } = this.state;
    if (!propsTypes) {
      return <div>loading...</div>
    }
    console.log('propsTypeOptions')//TRACE
    console.log(propsTypeOptions)//TRACE
    console.log('propsTypes')//TRACE
    console.log(propsTypes)//TRACE
    return (
      <List horizontal>
        {Object.keys(propsTypes).map(pKey => {
          const propName = propsTypes[pKey];
          const labelTxt = _.capitalize(_.kebabCase(pKey).replace('-',' '));
          return (
              <List.Item key={pKey}>
              { propsTypeOptions[pKey] &&
                <Form.Select label={`${labelTxt} `} 
                  options={propsTypeOptions[pKey].map(opt=>({
                    text:opt,
                    value:opt
                  }))}
                  onChange={async (e,data) => {
                    await this.setState({ [pKey]: (data.value) } )
                    this.triggerChange();
                }}/>
              }
              { !propsTypeOptions[pKey] &&
                <React.Fragment>
                {["string", "number"].indexOf(propName) > -1 && (
                  <Form.Input label={`${labelTxt} `} onChange={async (data) => {
                      await this.setState({ [pKey]: (data.target.value) } )
                      this.triggerChange();
                    }}/>
                )}
                {["bool"].indexOf(propName) > -1 && (
                    <Form.Checkbox label={labelTxt} onChange={async (_,data) => {
                      await this.setState({[pKey]: (data.checked) });
                      this.triggerChange();
                    }}/>
                )}
                </React.Fragment>
              }
              </List.Item>
          );
        })}
      </List>
    );
  }
}