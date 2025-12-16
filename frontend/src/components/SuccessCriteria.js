import React from 'react';

function SuccessCriteria({ children }) {
  return (
    <div className="success-criteria">
      <h4>Success Criteria</h4>
      <ul>{children}</ul>
    </div>
  );
}

export default SuccessCriteria;