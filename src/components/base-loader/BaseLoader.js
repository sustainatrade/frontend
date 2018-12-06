import React from 'react';
import ContentLoader from 'react-content-loader';
import ResponsiveContext from './../../contexts/Responsive';

export default class BaseLoader extends React.Component {
  render() {
    const {
      children,
      height: defaultHeight,
      mobileHeight,
      desktopHeight,
      width: defaultWidth,
      mobileWidth,
      desktopWidth,
      isMobile,
      ...rest
    } = this.props;
    return (
      <ResponsiveContext.Consumer>
        {context => {
          const height = (context.isMobile ? mobileHeight : desktopHeight) || defaultHeight;
          const width = (context.isMobile ? mobileWidth : desktopWidth) || defaultWidth;
          const ownProps = {};
          if (height) ownProps.height = height;
          if (width) ownProps.width = width;

          return (
            <ContentLoader speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb" {...rest} {...ownProps}>
              {children({ ...context, height, width })}
            </ContentLoader>
          );
        }}
      </ResponsiveContext.Consumer>
    );
  }
}
