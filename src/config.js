module.exports = Object.assign(
  {
    siteName: 'Sustain@trade',
    publicToken: 'please no hax',
    facebookAppId: '320301788758144',
    graphqlServer: localStorage.getItem('graphql'),
    graphqlWsServer: localStorage.getItem('graphql-ws'),
    reqCredentials: 'include',
    sections: [],
    contents: [
      {
        code: 'text',
        name: 'Text',
        icon: { type: ':email:', theme: 'outlined' }
      },
      {
        code: 'header',
        name: 'Header',
        icon: { type: ':newspaper:', theme: 'outlined' }
      },
      {
        code: 'photo',
        name: 'Photo',
        icon: { type: ':octocat:', theme: 'outlined' }
      },
      {
        code: 'buy-item',
        name: 'Buying Item',
        icon: { type: 'emojione:shopping-cart', theme: 'outlined' }
      },
      {
        code: 'sell-item',
        name: 'Selling Item',
        icon: { type: 'emojione-v1:label', theme: 'outlined' }
      },
      {
        code: 'offer',
        name: 'Offer',
        icon: { type: 'flat-color-icons:document', theme: 'outlined' }
      }
    ],
    posts: {
      actionButtonSize: 'medium'
    },
    fbAppID: 512081562521251,
    fbPageUrl: 'https://www.facebook.com/chingchong-df209613652859324/',
    staticPages: {
      privacy: '',
      about: 'https://www.sustainatrade.com',
      terms: 'https://www.sustainatrade.com'
    },
    swConfigUrl: process.env['NODE_ENV'] === 'production' ? '/sw-config' : 'http://localhost:3001/sw-config'
  },
  window.OVERRIDE_CONFIG
);
