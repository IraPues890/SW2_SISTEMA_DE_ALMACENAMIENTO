const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { shareFolder, listShared, revokeShare } = require('../controllers/shareController');

// POST /api/folders/:id/share
router.post('/:id/share', authMiddleware, shareFolder);

// GET /api/folders/:id/shared
router.get('/:id/shared', authMiddleware, listShared);

// DELETE /api/folders/:id/share/:shareId
router.delete('/:id/share/:shareId', authMiddleware, revokeShare);

module.exports = router;
