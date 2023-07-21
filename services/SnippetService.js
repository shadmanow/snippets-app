const nodeHtmlToImage = require('node-html-to-image');
const {Snippet, User} = require('../models');
const GoogleStorage = require('../services/GoogleStorageService');
const googleStorage = new GoogleStorage();

module.exports = function SnippetService() {
  this.saveSnippet = (snippet, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!snippet.name.length) snippet.name = 'New Snippet';

        const newSnippet = await Snippet.create({
          ...snippet,
          userId
        });

        const image = await getImage(snippet.code.html, snippet.code.css);
        newSnippet.img = await googleStorage.upload(userId + '/' + newSnippet._id + '.png', image);
        await newSnippet.save();
        resolve({id: newSnippet._id});
      } catch (e) {
        reject(e);
      }
    });
  };
  this.updateSnippet = (snippet, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!snippet.name.length) snippet.name = 'New Snippet';

        const _id = snippet._id;
        snippet.updatedAt = new Date();
        delete snippet._id;

        await Snippet.findOneAndUpdate({_id}, {...snippet});
        const image = await getImage(snippet.code.html, snippet.code.css);
        await googleStorage.upload(userId + '/' + snippet._id + '.png', image);
        resolve(snippet._id);
      } catch (e) {
        reject(e);
      }
    });
  };
  this.deleteSnippet = (_id, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await Snippet.deleteOne({_id});
        await googleStorage.delete(userId + '/' + _id + '.png');
        resolve('Snippet deleted.');
      } catch (e) {
        reject(e);
      }
    });
  };
  this.findComments = (snippetId, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const comments = await Snippet.aggregate([
          {$match: {_id: snippetId}},
          {$unwind: '$comments'},
          {$lookup: {from: 'users', localField: 'comments.userId', foreignField: '_id', as: 'comments.user'}},
          {$unwind: '$comments.user'},
          {
            $group: {
              _id: '$comments._id',
              userId: {$first: '$comments.user._id'},
              username: {$first: '$comments.user.username'},
              user_avatar: {$first: '$comments.user.avatar'},
              date: {$first: '$comments.date'},
              text: {$first: '$comments.text'}
            }
          },
          {$sort: {'date': -1}}]).exec();

        for (let comment of comments) {
          comment.isYour = comment.userId.toString() === userId
        }

        resolve(comments);
      } catch (e) {
        reject(e);
      }
    });
  };
  this.addComment = (_id, userId, text) => {
    return new Promise(async (resolve, reject) => {
      try {
        const comment = {userId, text, date: new Date()};
        await Snippet.findOneAndUpdate(
          {_id},
          {$push: {'comments': comment}}
        );
        resolve('Comment added');
      } catch (e) {
        reject(e);
      }
    });

  };
  this.deleteComment = (_id, commentId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await Snippet.findOneAndUpdate(
          {_id: _id},
          {$pull: {'comments': {_id: commentId}}}
        );
        resolve('Comment deleted');
      } catch (e) {
        reject(e);
      }
    });
  };
  this.viewAnalytics = (_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const snippet = await Snippet.findOne({_id});
        snippet.views = snippet.views + 1;
        await snippet.save();
        resolve();
      } catch (e) {
        reject(e.message);
      }
    });
  };
  this.findDetails = (_id, userId) => {
    return new Promise(async (resolve, reject) => {
      try {

        const snippets = await Snippet.aggregate([
          {$match: {_id}}, {
            $project: {
              name: 1,
              userId: 1,
              code: 1,
              description: 1,
              keywords: 1,
              createdAt: 1,
              updatedAt: 1,
            }
          }
        ]).exec();

        if (userId) {
          const user = await User.findOne({_id: userId}).lean().exec();
          snippets[0].canEdit = snippets[0].userId.toString() === userId;
          snippets[0].pinned = user.pins.map(el => el.snippetId).includes(_id);
        }

        resolve({...snippets[0]});
      } catch (e) {
        console.log(e);
        reject(e);
      }
    })
  };
  this.findSnippets = (selectors, order = 'recent') => {
    return new Promise(async (resolve, reject) => {
      try {

        const authUserId = selectors.userId;
        delete selectors.userId;

        if (selectors.username) {
          const user = await User.findOne({username: selectors.username}).lean().exec();
          selectors.userId = user._id;
        }

        delete selectors.username;

        if (selectors.keywords) {
          selectors.keywords = {$in: [selectors.keywords]};
        } else {
          delete selectors.keywords;
        }

        if (!Object.keys(selectors).length) selectors._id = {$exists: true};

        const sort = {};
        if (order === 'recent') sort.createdAt = -1;
        if (order === 'top') {
          sort.comments = -1;
          sort.views = -1;
        }

        const snippets = await Snippet.aggregate([
          {$match: {...selectors}},
          {$lookup: {from: 'users', localField: 'userId', foreignField: '_id', as: 'user'}},
          {$unwind: '$user'}, {
            $project: {
              _id: 1,
              name: 1,
              views: 1,
              img: 1,
              user: {_id: 1, username: 1, avatar: 1},
              comments: {
                $cond: {
                  if: {$isArray: '$comments'},
                  then: {$size: '$comments'},
                  else: '0'
                }
              }
            }
          },
          {$sort: sort}
        ]).exec();

        for (let snippet of snippets) {
          snippet.canDeleted = snippet.user._id.toString() === authUserId
        }

        resolve(snippets);
      } catch (e) {
        reject(e.message);
      }
    });
  };
};
async function getImage(html, css) {
  return await nodeHtmlToImage({
    html: `<html>
    <body>${html}</body>
    <style>${css}</style>
    </html>`,
    puppeteerArgs: {
      args: ['--no-sandbox']
    }
  });
}

