// src/features/(landing)/pages/PropertyDetails.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const PropertyDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800">Property Details #{id}</h1>
        <p className="mt-4 text-gray-600">Property details page coming soon...</p>
      </div>
    </div>
  );
};

export default PropertyDetails;