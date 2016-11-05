var fortune = require('../lib/fortune.js');

exports.home = function (req, res) {
    res.render('home');
};
exports.about = function (req, res) {
    var test_session = req.session.userName;
    var test_cookie = req.cookies.test;
    res.render('about',{
        'test_session': test_session,
        'test_cookie': test_cookie,
        'fortune': fortune.getFortune(),
        'pageTestScript': '/qa/tests-about.js'
    });
    // res.type('text/paint');
    // res.send('About page');
};