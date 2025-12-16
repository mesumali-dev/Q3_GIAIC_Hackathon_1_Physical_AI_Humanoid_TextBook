import React from 'react';

function Prerequisites({ children }) {
  return (
    <div className="prerequisites">
      <h4>Prerequisites</h4>
      <ul>{children}</ul>
    </div>
  );
}

export default Prerequisites;