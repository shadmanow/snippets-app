const {Router} = require('express');
const authParser = require('../middleware/authParser');
const authChecker = require('../middleware/authChecker');
const SnippetService = require('../services/SnippetService');

const router = Router();
router.use(authParser);

router.post('/comments', (req, res) => {
  const {userId, snippetId} = req.body;
  new SnippetService()
    .findComments(snippetId, userId)
    .then((comments) => res.status(200).json(comments))
    .catch((e) => res.status(500).json({error: e}));
});

router.post('/details', (req, res) => {
  const {userId, snippetId} = req.body;
  new SnippetService()
    .findDetails(snippetId, userId)
    .then((details) => res.status(200).json(details))
    .catch((e) => res.status(500).json({error: e}));
});

router.get('/find/:username?', (req, res) => {
  const { userId } = req.body;
  const {username} = req.params;
  const {keywords, order} = req.query;
  new SnippetService()
    .findSnippets({username, keywords, userId}, order)
    .then((snippets) => res.status(200).send(snippets))
    .catch((e) => res.status(500).send({error: e}));
});

router.post('/view-analytics', (req, res) => {
  const {snippetId} = req.body;
  new SnippetService()
    .viewAnalytics(snippetId)
    .then(() => res.status(200).json({}))
    .catch((e) => res.status(500).json({message: e.message}));
});

router.post('/save', authChecker, (req, res) => {
  const {userId, snippet} = req.body;
  new SnippetService()
    .saveSnippet(snippet, userId)
    .then((snippetId) => res.status(200).json({snippetId}))
    .catch((e) => res.status(500).json({message: e.message}));
});

router.post('/update', authChecker, (req, res) => {
  const {snippet, userId} = req.body;
  new SnippetService()
    .updateSnippet(snippet, userId)
    .then((snippetId) => res.status(200).json({snippetId}))
    .catch((e) => res.status(500).send({error: e.message}));
});

router.post('/delete', authChecker, (req, res) => {
  const {snippetId, userId} = req.body;
  new SnippetService()
    .deleteSnippet(snippetId, userId)
    .then(() => res.status(200).send({message: 'File deleted.'}))
    .catch((e) => res.status(500).send({error: e.message}));
});

router.post('/add-comment', authChecker, (req, res) => {
  const {snippetId, userId, text} = req.body;
  new SnippetService()
    .addComment(snippetId, userId, text)
    .then(m => res.status(200).json({message: m}))
    .catch(e => res.status(500).json({message: e.message}));
});

router.post('/delete-comment', authChecker, (req, res) => {
  const {snippetId, commentId} = req.body;
  new SnippetService()
    .deleteComment(snippetId, commentId)
    .then(m => res.status(200).json({message: m}))
    .catch(e => res.status(500).json({message: e.message}));
});

module.exports = router;

