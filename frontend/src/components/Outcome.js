import React from 'react';

function Outcome({ children }) {
  return (
    <div className="outcome">
      <h4>Outcome</h4>
      <ul>{children}</ul>
    </div>
  );
}

export default Outcome;