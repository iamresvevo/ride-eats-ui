import React from "react";
import { Button } from "../react/index.jsx";

// A catalog/chunk failure must not take down the docs navigation or other demos.
export default class CatalogBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="catalog-recovery" role="alert">
        <h3>The icon library couldn’t load</h3>
        <p>
          Reload to get the latest files. If you’re offline, reconnect and try
          again.
        </p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Reload icon library
        </Button>
      </div>
    );
  }
}
