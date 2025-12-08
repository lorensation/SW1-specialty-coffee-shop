import express from 'express';
import upload from '../middlewares/upload.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload a file
 * @access  Private/Admin
 */
router.post('/', authenticate, authorize('admin'), upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/${req.file.path}`;

        res.json({
            success: true,
            message: 'File uploaded successfully',
            url: fileUrl,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Server error during upload' });
    }
});

export default router;
