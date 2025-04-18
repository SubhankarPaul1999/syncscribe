const Document = require('../models/Document');
const User = require('../models/User');

// Create a new document
exports.createDocument = async (req, res) => {
    
  try {
   
    const document = new Document({
      owner: req.userId,
      title: req.body.title || 'Untitled Document'
    });
    
    // console.log('Document created:', document); // Debugging line
    await document.save();
    res.status(201).json(document);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all documents for a user
exports.getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [
        { owner: req.userId },
        { collaborators: req.userId }
      ]
    }).sort({ updatedAt: -1 });
    
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single document
exports.getDocument = async (req, res) => {
    console.log("Searching for document:", req.params.id); // Debugging line
  try {
    
    const document = await Document.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.userId },
        { collaborators: req.userId },
        { isPublic: true }
      ]
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    console.log(document); // Debugging lines
    
    res.json(document);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update document content
exports.updateDocument = async (req, res) => {

    console.log('User ID:', req.userId);
    console.log('Document ID:', req.params.id);
    console.log('Update data:', req.body);
    const exists = await Document.exists({ _id: req.params.id });
if (!exists) return res.status(404).json({ message: 'Document not found' });
  try {
    const document = await Document.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { owner: req.user._id },
          { collaborators: req.user._id }
        ]
      },
      { 
        content: req.body.content,
        title: req.body.title
      },
      { new: true }
    );
    console.log("Updated document:", document); // Debugging line
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json(document);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a document
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};