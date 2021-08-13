const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const firebase = require('firebase-admin');
const dotenv = require('dotenv');

const app = express();
const routes = require('./routes');
const port = 3000;

dotenv.config();

firebase.initializeApp({
    credential: firebase.credential.cert({
        type: 'service_account',
        project_id: process.env.project_id,
        private_key_id: process.env.private_key_id,
        private_key: process.env.private_key.replace(/\\n/g, '\n'),
        client_email: process.env.client_email,
        client_id: process.env.client_id,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.client_x509_cert_url,
    }),
    databaseURL: process.env.databaseURL,
});

app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: process.env.private_key_id,
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: true,
    })
);

routes(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
