import React from 'react';

function Exercise({ children }) {
  return (
    <div className="exercise">
      <h3>Exercise</h3>
      {children}
    </div>
  );
}

export default Exercise;