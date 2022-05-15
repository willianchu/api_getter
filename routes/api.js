const express = require('express');
const { SORT_DIRECTIONS, SORT_FIELDS, getPosts } = require('../externalApi.js');

const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({
    success: true
  });
});


router.get('/posts', async function (req, res) {
  try {
    const { tag, sortBy, direction } = req.query;
    if (!tag) {
      res.status(400).json({ error: 'Tags parameter is required' });
      return;
    }
    if (sortBy && !SORT_FIELDS.includes(sortBy)) {
      res.status(400).json({ error: 'sortBy parameter is invalid' });
      return;
    }
    if (direction && !SORT_DIRECTIONS.includes(direction)) {
      res.status(400).json({ error: 'direction parameter is invalid' });
      return;
    }
    const posts = await getPosts(tag, sortBy, direction);
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: "something wrong" });
  }
    
});

module.exports = router;
