// Create web server

// Import express
const express = require('express');
const app = express();

// Import body-parser to parse the body of requests
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Import mongoose
const mongoose = require('mongoose');

// Import the Comment model
require('./models/Comment');
const Comment = mongoose.model('Comment');

// Import the Post model
require('./models/Post');
const Post = mongoose.model('Post');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/posts');

// Create a GET route to get all comments
app.get('/comments', async (req, res) => {
    const comments = await Comment.find({});
    res.send(comments);
});

// Create a GET route to get a specific comment
app.get('/comments/:id', async (req, res) => {
    const comment = await Comment.findOne({ _id: req.params.id });
    res.send(comment);
});

// Create a POST route to create a new comment
app.post('/comments', async (req, res) => {
    const comment = new Comment(req.body);
    await comment.save();
    res.send(comment);
});

// Create a PUT route to update a comment
app.put('/comments/:id', async (req, res) => {
    const comment = await Comment.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
    );
    res.send(comment);
});

// Create a DELETE route to delete a comment
app.delete('/comments/:id', async (req, res) => {
    const comment = await Comment.findOneAndRemove({
        _id: req.params.id
    });
    res.send(comment);
});

// Create a GET route to get all comments for a specific post
app.get('/posts/:postId/comments', async (req, res) => {
    const comments = await Comment.find({
        postId: req.params.postId
    });
    res.send(comments);
});

// Create a POST route to create a new comment for a specific post
app.post('/posts/:postId/comments', async (req, res) => {
    const post = await Post.findOne({ _id: req.params.postId });
    const comment = new Comment(req.body);
    post.comments.push(comment);
    await Promise.all([post.save(), comment.save()]);
    res.send(comment);
});

// Create a PUT route to update a comment for a specific post
app