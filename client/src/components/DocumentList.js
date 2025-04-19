import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserDocuments, createDocument } from '../services/documentService';
import './DocumentList.css';

const DocumentList = () => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getUserDocuments();
        setDocuments(docs);
      } catch (err) {
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDocuments();
    }
  }, [currentUser]);

  const handleCreateDocument = async () => {
    try {
      const newDoc = await createDocument();
      setDocuments([newDoc, ...documents]);
    } catch (err) {
      console.error('Error creating document:', err);
    }
  };

  if (loading) {
    return <div>Loading documents...</div>;
  }

  return (
    <div className="document-list">
      <button onClick={handleCreateDocument} className="create-doc-btn">
        + New Document
      </button>
      
      <div className="documents-grid">
        {documents.map((doc) => (
          <Link to={`/document/${doc._id}`} key={doc._id} className="document-card">
            <div className="document-card-content">
              <h3>{doc.title}</h3>
              <p>
                Last updated: {new Date(doc.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;