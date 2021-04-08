const express = require('express');
const router = express.Router();
const { getPosts, createPost, updatePost, likePost, deletePost } = require ('../../controllers/posts');
const auth = require('../../middleware/auth');

router.get('/', getPosts);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

module.exports = router;

