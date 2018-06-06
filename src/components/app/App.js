import React from 'react';
import PropTypes from 'prop-types';
import AppHeader from './../app-header/AppHeader';
import AppContent from './../app-content/AppContent';
// import PrCompanyMenu from './../../components/pr-company-menu/PrCompanyMenu';
// import {  } from 'semantic-ui-react'
// // import * as dummies from './../../../data/dummies';
// import './PrProfile.css';

/**
 * General component description in JSDoc format. Markdown is *supported*.
 */
export default class App extends React.Component {
  static propTypes = {
    /** Description of prop "foo". */
    foo: PropTypes.number,
    /** Description of prop "baz". */
    baz: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  };
  static defaultProps = {
    foo: 42,
  };
  static Header = AppHeader;
  static Content = AppContent;
  state = {}
  

  render() {

    let header, content;

    React.Children.forEach(this.props.children, function(child){
      if(!child) return;
      switch(child.type){
        case AppHeader:
          header = child;
        break;
        case AppContent:
          content = child;
        break;
        default:
        break;
      }
    })
    
    return (
      <div className="App">
        {(header)?header:<AppHeader appName="undefined"/>}
        {(content)?content:<AppContent/>}
      </div>
    );
    
  }
}
