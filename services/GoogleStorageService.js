const {Storage} = require('@google-cloud/storage');
const config = require('config');

const storage = new Storage({
  projectId: config.get('google.project'),
  keyFilename: config.get('google.key_path')
});

const bucket = storage.bucket(config.get('google.bucket'));
const uri = `https://storage.googleapis.com/${config.get('google.bucket')}`;

module.exports = function GoogleStorage() {

  this.setCors = () => {
    return new Promise(async (resolve, reject) => {
      try {

        await bucket.setCorsConfiguration([
          {
            method: ['GET', 'OPTIONS'],
            origin: ['*'],
            responseHeader: ['Content-Type']
          }
        ]);

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  };

  this.uri = () => uri;

  this.upload = (path, content, options = {}) => {
    return new Promise((resolve, reject) => {
      const ws = bucket.file(path).createWriteStream({
        public: true,
        gzip: true,
        resumable: false,
        metadata: {
          cacheControl: 'no-cache',
          ...options
        }
      });
      ws.write(content);
      ws.end();
      ws.on('error', (e) => reject(e));
      ws.on('finish', () => resolve(`${uri}/${path}`));
    });
  };

  this.delete = async (prefix) => {
    await bucket.deleteFiles({force: true, prefix});
  };
};

