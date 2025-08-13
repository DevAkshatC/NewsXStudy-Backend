const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

// 📌 Default Top Headlines
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${GNEWS_BASE_URL}/top-headlines`, {
            params: {
                lang: 'en',
                country: 'in',
                max: 10,
                token: process.env.NEWS_API_KEY
            }
        });
        res.json({ articles: response.data.articles });
    } catch (error) {
        console.error('GNews fetch error:', error.message);
        res.status(500).json({ message: 'Failed to fetch news' });
    }
});

// 🔍 Search News
router.get('/search', async (req, res) => {
    const { q } = req.query;

    if (!q) return res.status(400).json({ message: 'Query is required' });

    try {
        const response = await axios.get(`${GNEWS_BASE_URL}/search`, {
            params: {
                q,
                lang: 'en',
                country: 'in',
                max: 10,
                token: process.env.NEWS_API_KEY
            }
        });

        res.json({ articles: response.data.articles });
    } catch (error) {
        console.error('GNews search error:', error.message);
        res.status(500).json({ message: 'Failed to search news' });
    }
});

// 🗂️ Category Filter (simulated using keywords)
router.get('/category/:category', async (req, res) => {
    const category = req.params.category;

    try {
        const response = await axios.get(`${GNEWS_BASE_URL}/search`, {
            params: {
                q: category, // GNews does not have strict category endpoint like NewsAPI
                lang: 'en',
                country: 'in',
                max: 10,
                token: process.env.NEWS_API_KEY
            }
        });

        res.json({ articles: response.data.articles });
    } catch (error) {
        console.error('GNews category error:', error.message);
        res.status(500).json({ message: 'Failed to fetch category news' });
    }
});

module.exports = router;
