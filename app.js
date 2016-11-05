var credentials = require('./credentials.js');
var express = require('express');
var fortune = require('./lib/fortune.js');
var body_parser = require('body-parser').urlencoded({extended: true});
var formidable = require('formidable');
var cookie_parser = require('cookie-parser');
var express_session = require('express-session');
const util = require('util');
var app = express();
app.set('port', process.env.PORT || 30000);

// logging
switch(app.get('env')){
    case 'development':
        // compact, colorful dev logging
        app.use(require('morgan')('dev'));
        break;
    case 'production':
        // module 'express-logger' supports daily log rotation
        app.use(require('express-logger')({ path: __dirname + '/log/requests.log'}));
        break;
}
// info about cluster works
app.use(function (req, res, next) {
    var cluster = require('cluster');
    if(cluster.isWorker){
        console.log('Запрос обрабатывает исполнитель номер - %d', cluster.worker.id);
    };
    next();
})

app.use(cookie_parser(credentials.cookieSecret));

app.use(express_session({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret
}));

app.use(function (req, res, next) {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
})

var handlebars = require('express-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function (name, options) {
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


app.use(body_parser); 

function getWeatherData() {
    return {
        locations:[
            {
                name: 'Портленд',
                forecastUrl: 'http://vk.com',
                iconUrl: 'http://icons-ak.wxug.com/i/k/cloudy.gif',
                weather: 'Облачно',
                temp: '+2'
            },
            {
                name: 'Портленд1',
                forecastUrl: 'http://vk.com',
                iconUrl: 'http://icons-ak.wxug.com/i/k/cloudy.gif',
                weather: 'Облачно',
                temp: '+1'
            },
            {
                name: 'Портленд2',
                forecastUrl: 'http://vk.com',
                iconUrl: 'http://icons-ak.wxug.com/i/k/cloudy.gif',
                weather: 'Облачно',
                temp: '+3'
            },
        ]
    }
}

app.use(function (req, res, next) {
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weatherContext = getWeatherData();
    next();
})

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') != 'production' && req.query.test == '1';
    next();
});

app.get('/', function (req, res) {
    req.session.userName = 'TestUser';
    res.cookie('test','azaza');
    res.render('home');
    // res.type('text/paint');
    // res.send('Home page');
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
app.use(express.static( __dirname + '/public'));

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500);
    res.render('500');
});


function startServer() {
    app.listen(app.get('port'), function () {
        console.log( 'Express started in ' + app.get('env') +
            ' mode on http://localhost:' + app.get('port') +
            '; press Ctrl-C to terminate.' );
    });
}

if(require.main === module){
    // application run directly; start app server
    startServer();
} else {
    // application imported as a module via "require": export function to create server
    module.exports = startServer;
}

