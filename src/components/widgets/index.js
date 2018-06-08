import Loadable from 'react-loadable';
import React from 'react'

function createWidget(widgetObj){
    return {
        description: 'sample',
        size: 0,
        async propTypes(){
            const widget = await widgetObj;
            return widget.default.propTypes;
        },
        component: Loadable({
            loader: () => widgetObj,
            loading: ()=><div>Loading..</div>,
        })
    }
}

const manifests = {
    HelloWorld: createWidget(import('./HelloWorld'))
}

export {
    manifests
}