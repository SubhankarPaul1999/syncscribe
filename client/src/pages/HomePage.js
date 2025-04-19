import React from 'react';
import DocumentList from '../components/DocumentList';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>My Documents</h1>
      <DocumentList />
    </div>
  );
};

export default HomePage;