import React from 'react';
import './common.css'; // Make sure to create this CSS file

const Spinner = ({ isLoading }) => {
  return (
    isLoading ? (
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
    ) : null
  );
};

export default Spinner;