import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { saveDocument, getDocument } from '../services/documentService';
import './DocumentEditor.css';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const DocumentEditor = () => {
  const { id: documentId } = useParams();
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const [title, setTitle] = useState('Untitled Document');
  const wrapperRef = useRef(null);

  // Set up Quill editor
  useEffect(() => {
    if (!wrapperRef.current) return;

    const editor = document.createElement('div');
    wrapperRef.current.append(editor);
    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText('Loading...');
    setQuill(q);

    return () => {
      wrapperRef.current.innerHTML = '';
    };
  }, []);

  // Set up Socket.io connection
  useEffect(() => {
    if (!quill || !currentUser) return;

    const s = io('http://localhost:5000');
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [quill, currentUser]);

  // Load document and join room
  useEffect(() => {
    if (!quill || !socket) return;

    const loadDocument = async () => {
      try {
        const doc = await getDocument(documentId);
        setTitle(doc.title);
        quill.setContents(doc.content);
        quill.enable();
        
        socket.emit('join-document', documentId);
      } catch (err) {
        console.error('Error loading document:', err);
      }
    };

    loadDocument();

    return () => {
      socket.emit('leave-document', documentId);
    };
  }, [quill, socket, documentId]);

  // Send changes to server
  useEffect(() => {
    if (!quill || !socket) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta, documentId);
    };

    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [quill, socket, documentId]);

  // Receive changes from server
  useEffect(() => {
    if (!quill || !socket) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };

    socket.on('receive-changes', handler);

    return () => {
      socket.off('receive-changes', handler);
    };
  }, [quill, socket]);

  // Auto-save document
  useEffect(() => {
    if (!quill || !socket) return;

    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents(), documentId);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [quill, socket, documentId]);

  const handleTitleChange = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    try {
      await saveDocument(documentId, { title: newTitle });
    } catch (err) {
      console.error('Error updating title:', err);
    }
  };

  return (
    <div className="document-container">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="document-title"
        placeholder="Document Title"
      />
      <div className="document-editor" ref={wrapperRef}></div>
    </div>
  );
};

export default DocumentEditor;