const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('config');
const express = require('express');

const app = express();
const GoogleStorage = require('./services/GoogleStorageService');
const routes = require('./routes');
const PORT = config.port || 5000;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({limit: '5mb'}));
app.use('/auth', routes.authRoutes);
app.use('/snippet', routes.snippetRoutes);
app.use('/user', routes.userRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

async function start() {
  try {
    await mongoose.connect(config.mongo_remote_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    await new GoogleStorage().setCors();
    app.listen(PORT, () =>
      console.log(`App started on port ${PORT}...`)
    );
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}
start();

