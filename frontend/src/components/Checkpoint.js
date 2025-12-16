import React from 'react';

function Checkpoint({ children }) {
  return (
    <div className="checkpoint">
      <h3>Checkpoint</h3>
      {children}
    </div>
  );
}

export default Checkpoint;