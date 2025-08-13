const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Bookmark = require('../models/Bookmark');

// ✅ ADD Bookmark
router.post('/add', authenticate, async (req, res) => {
    try {
        const { title, url } = req.body;

        if (!title || !url) {
            return res.status(400).json({ message: 'Title and URL are required' });
        }

        const newBookmark = new Bookmark({
            userId: req.user.id,  // ✅ Correct user ID from auth middleware
            title,
            url
        });

        await newBookmark.save();
        res.json({ message: 'Bookmark saved successfully' });
    } catch (err) {
        console.error('Bookmark Add Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ✅ LIST Bookmarks
router.get('/list', authenticate, async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ userId: req.user.id });
        res.json(bookmarks);
    } catch (err) {
        console.error('Bookmark List Error:', err.message);
        res.status(500).json({ message: 'Failed to load bookmarks' });
    }
});

// ✅ DELETE Bookmark
router.delete('/delete/:id', authenticate, async (req, res) => {
    try {
        const bookmarkId = req.params.id;

        const bookmark = await Bookmark.findOneAndDelete({
            _id: bookmarkId,
            userId: req.user.id  // ✅ Ensure only user's bookmark is deleted
        });

        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        res.json({ message: 'Bookmark deleted successfully' });
    } catch (err) {
        console.error('Bookmark Delete Error:', err.message);
        res.status(500).json({ message: 'Failed to delete bookmark' });
    }
});

module.exports = router;
