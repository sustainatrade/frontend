import { createWidget } from './lib'

const manifests = {
    HelloWorld: createWidget(import('./HelloWorld'),{icon:'plus',disabled:true}),
    PriceTag: createWidget(import('./PriceTag'),{icon:'money bill alternate'}),
    Color: createWidget(import('./Color'),{icon:'paint brush'}),
    Quality: createWidget(import('./Quality'),{icon:'shield alternate'})
}

export {
    manifests
}