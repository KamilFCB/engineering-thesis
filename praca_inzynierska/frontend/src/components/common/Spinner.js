import React, { Component } from "react";

export class Spinner extends Component {
  /**
   * Loading spinner
   */
  render() {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-grow" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
}

export default Spinner;
