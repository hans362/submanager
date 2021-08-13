module.exports = function (app) {
    app.get('/', (req, res) => {
        res.send('Welcome to SubManager Backend API Server!');
    });
    app.use('/users', require('./users'));
    app.use('/register', require('./register'));
};
