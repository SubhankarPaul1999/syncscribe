const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all document routes
// router.use(authMiddleware);

// Document routes
router.post('/',authMiddleware, documentController.createDocument);
router.get('/', authMiddleware, documentController.getUserDocuments);
router.get('/:id',authMiddleware, documentController.getDocument);
router.put('/:id',authMiddleware, documentController.updateDocument);
router.delete('/:id', authMiddleware, documentController.deleteDocument);

module.exports = router;