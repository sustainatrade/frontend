import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Container, Icon, Header } from 'semantic-ui-react'
// import Notification from 'core/components/notification/Notification';
/**
 * General component description in JSDoc format. Markdown is *supported*.
 */
export default class AppHeader extends React.Component {
  static propTypes = {
    /** Description of prop "foo". */
    appName: PropTypes.string.isRequired,
    /** Description of prop "baz". */
    isModule: PropTypes.bool,
    icon: PropTypes.string,
    iconColor: PropTypes.string
  };
  static defaultProps = {
    icon: 'window maximize',
    iconColor: 'grey'
  };

  state = { }
  static Menu = Menu.Menu;
  static MenuItem = Menu.Item;


  render() {

    const { isModule, icon, iconColor, color } = this.props
    let menuRight = [], menuLeft = [];

    React.Children.forEach(this.props.children, function(child){
      if(!child) return;
      switch(child.type){
        case AppHeader.MenuItem:
        case AppHeader.Menu:
          if(child.props.position === 'right')
            menuRight.push(child);
          else
            menuLeft.push(child);
        break;
        default:
        break;
      }
    })

    const menuProps = {
      inverted: true,
      pointing: true,
      size: 'massive',
      color
    };
    return (
      <div>
        <div>
          { 
            !isModule &&
            <Menu {...menuProps}>
              <Menu.Item header>{this.props.appName}</Menu.Item>
              {this.props.children}
            </Menu>
          }
          {
            isModule &&
            <Menu {...menuProps} widths={3}>
                <Container>
                  <Menu fluid {...menuProps}>
                    {menuLeft}
                  </Menu>
                </Container>
                <Container>
                  <Menu fluid {...menuProps} widths={1}>
                      <Header inverted as='h3'>
                        <Icon name={icon} inverted color={iconColor}/>
                        <Header.Content>
                          {this.props.appName}
                        </Header.Content>
                      </Header>
                  </Menu>
                </Container>
                
                <Container>
                <Menu fluid {...menuProps}>
                  {menuRight}
                </Menu>
                </Container>
                
            </Menu>
          }
        </div>
      </div>
    )
  }
}