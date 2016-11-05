module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('home');
    });
    app.get('/contest/vacation-photo', function (req, res) {
        var now = new Date();
        res.render('contest/vacation-photo',{
            year: now.getFullYear(),
            month: now.getMonth()
        });
    });
    app.post('/contest/vacation-photo/:year/:month', function (req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if(err){
                return res.redirect(303, '/error');
            }
            console.log('received fields: ');
            console.log(fields);
            console.log('received files: ');
            console.log(files);
            res.redirect(303, '/thank-you');
        });
    });
    app.get('/newsletter', function (req, res) {
        res.render('newsletter',{
            csrf: 'CSRF token goes here'
        });
    });
    app.post('/process',function (req, res) {
        if(req.xhr || req.accepts('json.html') == 'json'){
            console.log(util.inspect(req.query, {showHidden: false, depth: null}));
            console.log(util.inspect(req.body, {showHidden: false, depth: null}));
            console.log('form (form query): ' +req.query.form);
            console.log('CSRF token (form hidden form field): ' +req.body._csrf);
            console.log('Name: ' +req.body.name);
            console.log('Email: ' +req.body.email);
            res.send({success: true})
        } else{
            res.redirect(303, '/thank-you');
        }
    });
    app.get('/thank-you', function (req, res) {
        res.render('thank-you');
    });
    var fortune = require('./lib/fortune.js');
    app.get('/about', function (req, res) {
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
    });
    app.post('/about/process',function (req, res) {
        var email = req.body.email || '';
        var body = req.body.body || '';
        console.log(email);
        console.log(body);
        if(body == '' || email == ''){
            req.session.flash = {
                type: 'danger',
                intro: 'Ошибка проверки формы!',
                message: 'Заполните пустые поля'
            };
        }else{
            req.session.flash = {
                type: 'info',
                intro: 'Сообщение отправлено',
                message: 'Спасибо!!!'
            };
        }
        return res.redirect(303, '/about');
    });
    app.get('/tours/hood-river', function (req, res) {
        res.render('tours/hood-river');
    });
    app.get('/tours/request-group-rate', function (req, res) {
        res.render('tours/request-group-rate');
    });
};