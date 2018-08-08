const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');

module.exports = class Application {
    constructor() {
        this.setupExpress();
        this.setRouters();
    }
    setupExpress() {
        const server = http.createServer(app);
        server.listen(3000 , () => console.log('Listening on port 3000'));
    }
    setRouters() {
        app.use(require('app/routes/api'));
        app.use(require('app/routes/web'));        
    }
}