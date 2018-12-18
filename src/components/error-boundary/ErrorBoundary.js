import React from 'react';
import { Button } from 'semantic-ui-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ marginTop: 100 }}>
          <center>
            <h1>Something went wrong.</h1>
            <Button
              onClick={() => {
                localStorage.removeItem('_c');
                window.location.reload();
              }}
            >
              Go Back
            </Button>
          </center>
        </div>
      );
    }

    return this.props.children;
  }
}
