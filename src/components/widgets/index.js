import Loadable from 'react-loadable';
import React from 'react'

const TYPE_CONVERTER = {
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

function parseGraphData({name,types,values,...rest}){
    
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

function createWidget(widgetObj,opts){
    return {
        description: 'sample',
        size: 0,
        async propTypes(){
            const widget = await widgetObj;
            return widget.default.propTypes || {};
        },
        async propTypeOptions(){
            const widget = await widgetObj;
            return widget.default.propTypeOptions || {};
        },
        component: Loadable({
            loader: () => widgetObj,
            loading: ()=><div>Loading..</div>,
        }),
        ...opts
    }
}

const manifests = {
    HelloWorld: createWidget(import('./HelloWorld'),{icon:'plus',disabled:true}),
    PriceTag: createWidget(import('./PriceTag'),{icon:'money bill alternate'}),
    Color: createWidget(import('./Color'),{icon:'paint brush'}),
    Quality: createWidget(import('./Quality'),{icon:'shield alternate'})
}

export {
    manifests,
    parseGraphData
}