const {Router} = require('express');
const Formidable = require('formidable');
const authParser = require('../middleware/authParser');
const authChecker = require('../middleware/authChecker');
const UserService = require('../services/UserService');

const router = Router();
router.use(authParser);

router.get('/profile/:username', (req, res) => {
  const {username} = req.params;
  new UserService()
    .findProfile(username)
    .then((profile) => res.status(200).json(profile))
    .catch((e) => res.status(500).json({message: e}));
});

router.post('/forgot-password', (req, res) => {
  const {emailOrUsername} = req.body;
  new UserService()
    .forgotPassword(emailOrUsername)
    .then(() => res.status(200).json({}))
    .catch((error) => res.status(500).json({error}));
});

router.post('/change-avatar', authChecker, (req, res) => {
  const {userId} = req.body;
  const form = new Formidable();
  form.parse(req, (err, fields, files) => {
    const {avatar} = files;
    new UserService()
      .uploadAvatar(userId, avatar)
      .then((uri) => res.status(200).json(uri))
      .catch((error) => res.status(500).json({error}));
  });
});

router.post('/change-email', authChecker, (req, res) => {
  const {userId, newEmail} = req.body;
  new UserService()
    .changeEmail(userId, newEmail)
    .then(() => res.status(200).json({}))
    .catch((error) => res.status(500).json({error}));
});

router.post('/change-username', authChecker, (req, res) => {
  const {userId, newUsername} = req.body;
  new UserService()
    .changeUsername(userId, newUsername)
    .then(() => res.status(200).json({}))
    .catch((error) => res.status(500).json({error}));
});

router.post('/change-profile', authChecker, (req, res) => {
  const {userId, fields} = req.body;
  new UserService()
    .changeProfile(userId, fields)
    .then(() => res.status(200).json({message: 'Profile changed'}))
    .catch((e) => res.status(500).json({message: e.message ? e.message : e}));
});

router.post('/change-password', authChecker, (req, res) => {
  const {userId, oldPassword, newPassword} = req.body;
  new UserService()
    .changePassword(userId, oldPassword, newPassword)
    .then(() => res.status(200).json({message: 'Password changed'}))
    .catch((e) => res.status(500).json({message: e.message ? e.message : e}));
});

router.post('/add-pin', authChecker, (req, res) => {
  const {snippetId, userId} = req.body;
  new UserService()
    .addPin(userId, snippetId)
    .then(message => res.status(200).json({message}))
    .catch(error => res.status(500).json({error}));
});

router.post('/delete-pin', authChecker, (req, res) => {
  const {snippetId, userId} = req.body;
  new UserService()
    .deletePin(userId, snippetId)
    .then(message => res.status(200).json({message}))
    .catch(error => res.status(500).json({error}));
});

router.post('/pins', authChecker, (req, res) => {
  const {userId} = req.body;
  const {order, keywords} = req.query;
  new UserService()
    .findPins({userId, keywords}, order)
    .then((snippets) => res.status(200).json(snippets))
    .catch((e) => res.status(500).json({message: e}));
});

router.post('/snippets', authChecker, (req, res) => {
  const {userId} = req.body;
  const {order, keywords} = req.query;
  new UserService()
    .findSnippets({userId, keywords}, order)
    .then((snippets) => res.status(200).json(snippets))
    .catch((e) => res.status(500).json({message: e}));
});

module.exports = router;

