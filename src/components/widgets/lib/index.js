import Loadable from 'react-loadable';
import React from 'react'
import PropTypes from 'prop-types';
import _ from 'lodash';

export const TYPE_CONVERTER = {
    array(value, propTypes){
        //TODO: array not supported yet
        if(Array.isArray(value)){
            return value.map((v,i)=>TYPE_CONVERTER[i](value,propTypes[i]));
        }
    },
    bool(value){
        return JSON.parse(value);
    },
    func(value){
        return value;
    },
    number(value){
        return Number(value);
    },
    object(value){
        return value;
    },
    string(value){
        return value.toString();
    },
    symbol(value){
        return value
    }
}

export function parseGraphData({name,types,values,...rest}){
    
    const jsonTypes = JSON.parse(types)
    const jsonValues = JSON.parse(values);
    
    //convert types
    for (const key in jsonValues) {
        const value = jsonValues[key]
        let propType = jsonTypes[key];
        jsonValues[key] = TYPE_CONVERTER[propType](value);
    }
    const parsedData =  {
        name,
        types: jsonTypes,
        values: jsonValues,
        ...rest
    }
    return parsedData;
}


const PROP_TYPE_NAMES = _.compact(
    Object.keys(PropTypes).map(k => {
      if ([   
        // 'array',
        'bool',
        'number',
        // 'object',
        'string',
        // 'symbol'
        ].indexOf(k)>-1) {
        return k;
      }
      return undefined;
    })
  );
const t = {}
PROP_TYPE_NAMES.forEach(k=>{
    const propFnc = PropTypes[k];
    propFnc.typeName = k;
    t[k] = propFnc;
})
console.log('PROP_TYPE_NAMES')//TRACE
console.log(PROP_TYPE_NAMES)//TRACE
export const WidgetPropTypes = t;

export function createWidget(widgetObj,opts){
    return {
        description: 'sample',
        size: 0,
        async propTypes(){
            const widget = await widgetObj;

            return widget.default.propTypes || {};
        },
        async propObjects(){
            const widget = await widgetObj;

            return widget.default.propObjects || {};
        },
        component: Loadable({
            loader: () => widgetObj,
            loading: ()=><div>Loading..</div>,
        }),
        ...opts
    }
}
