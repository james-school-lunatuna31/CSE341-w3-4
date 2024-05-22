const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure session middleware
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));

// Enable CORS
app.use(cors());

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

const mongodb = require('./data/database');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const db = mongodb.getDb();
        let user = await db.collection('users').findOne({ githubId: profile.id });

        if (!user) {
          user = await db.collection('users').insertOne({
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            emails: profile.emails,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);
passport.serializeUser((user, done) => {
  done(null, user._id); // Ensure user._id is correct
});

passport.deserializeUser((id, done) => {
  mongodb.getUserById(id, done); // Use getUserById function
});

if (process.env.NODE_ENV === 'development' || true) {
  // this is for class, so its always true, but we cn conditionaly lock this for developments
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('./swagger.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

const { router } = require('./routes/index');
app.use('/', router);
const PORT = process.env.PORT || 3000;

mongodb.initDb((err) => {
  if (err) {
    console.error('MongoDB connection error:', err);
  } else {
    app.listen(PORT, () => {
      console.log(`Database is connected and server is running on port ${PORT}`);
    });
  }
});
