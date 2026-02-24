import React from 'react';
import { useNavigate } from 'react-router';

/**
 * PRESENTATIONAL COMPONENT
 * Simple error page - no data fetching
 */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="text-6xl font-bold text-base-content">404</h1>
        <p className="mt-4 text-lg text-base-content/70">
          This page is not available
        </p>
        <button className="btn btn-primary mt-6" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
