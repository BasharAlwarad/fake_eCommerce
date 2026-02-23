import React from 'react';
import { useNavigate } from 'react-router';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div>
      404 error this page is not available
      <button className="btn" onClick={() => navigate(-1)}>
        go back
      </button>
    </div>
  );
};

export default NotFound;
