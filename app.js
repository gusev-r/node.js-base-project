var express = require('express');
var fortune = require('./lib/fortune.js');
var app = express();
app.set('port', process.env.PORT || 30000);

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


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
    res.render('home');
    // res.type('text/paint');
    // res.send('Home page');
});

app.get('/about', function (req, res) {
    res.render('about',{
        'fortune': fortune.getFortune(),
        'pageTestScript': '/qa/tests-about.js'
    });
    // res.type('text/paint');
    // res.send('About page');
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

app.listen(app.get('port'), function () {
    console.log('Express run on http://localhost:' + app.get('port'));
});