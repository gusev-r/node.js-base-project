var fortune = require('../lib/fortune.js');

exports.home = function (req, res) {
    res.render('home');
};
exports.about = function (req, res) {
    var test_session = req.session.userName;
    var test_cookie = req.cookies.test;
    res.render('about', {
        'test_session': test_session,
        'test_cookie': test_cookie,
        'fortune': fortune.getFortune(),
        'pageTestScript': '/qa/tests-about.js'
    });
    // res.type('text/paint');
    // res.send('About page');
};

exports.aboutProcessPost = function (req, res) {
    var email = req.body.email || '';
    var body = req.body.body || '';
    console.log(email);
    console.log(body);
    if (body == '' || email == '') {
        req.session.flash = {
            type: 'danger',
            intro: 'Ошибка проверки формы!',
            message: 'Заполните пустые поля'
        };
    } else {
        req.session.flash = {
            type: 'info',
            intro: 'Сообщение отправлено',
            message: 'Спасибо!!!'
        };
    }
    return res.redirect(303, '/about');
};

exports.newsletter = function (req, res) {
    res.render('newsletter', {
        csrf: 'CSRF token goes here'
    });
};

exports.processPost = function (req, res) {
    if (req.xhr || req.accepts('json.html') == 'json') {
        console.log(util.inspect(req.query, {showHidden: false, depth: null}));
        console.log(util.inspect(req.body, {showHidden: false, depth: null}));
        console.log('form (form query): ' + req.query.form);
        console.log('CSRF token (form hidden form field): ' + req.body._csrf);
        console.log('Name: ' + req.body.name);
        console.log('Email: ' + req.body.email);
        res.send({success: true})
    } else {
        res.redirect(303, '/thank-you');
    }
};

exports.thankYou = function (req, res) {
    res.render('thank-you');
};