import React from 'react';

function LearningObjective({ children }) {
  return (
    <div className="learning-objective">
      <h4>Learning Objective</h4>
      <ul>{children}</ul>
    </div>
  );
}

export default LearningObjective;