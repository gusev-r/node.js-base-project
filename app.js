var credentials = require('./credentials.js');
var body_parser = require('body-parser').urlencoded({extended: true});
var cookie_parser = require('cookie-parser');
var express_session = require('express-session');
var http = require('http');
var vhost = require('vhost');
const util = require('util');
var express = require('express');
var app = express();

// template engine
var handlebars = require('express-handlebars').create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');


app.set('port', process.env.PORT || 30000);

var admin = express.Router();
app.use(vhost('admin.*', admin));
admin.get('/', function (req, res) {
    res.render('home');
});

// use domains for better error handling
app.use(function (req, res, next) {
    // create a domain for this request
    var domain = require('domain').create();
    // handle errors on this domain
    domain.on('error', function (err) {
        console.error('ПЕРЕХВАТ ОШИБКИ ДОМЕНА\n', err.stack);
        try {
            // failsafe shutdown in 5 seconds
            setTimeout(function () {
                console.error('Отказобезобасный сотанов');
                process.exit(1);
            }, 5000);

            // disconnect from the cluster
            var worker = require('cluster').worker;
            if (worker) worker.disconnect();

            // stop taking new requests
            server.close();

            try {
                // attempt to use Express error route
                next(err);
            } catch (error) {
                // if Express error route failed, try
                // plain Node response
                console.error('Сбой механизмоа обработки ошибок Express.\n', error.stack);
                res.statusCode = 500;
                res.setHeader('content-type', 'text/plain');
                res.end('Server error.');
            }
        } catch (error) {
            console.error('Unable to send 500 response.\n', error.stack);
        }
    });

    // add the request and response objects to the domain
    domain.add(req);
    domain.add(res);

    // execute the rest of the request chain in the domain
    domain.run(next);
});

// logging
switch (app.get('env')) {
    case 'development':
        // compact, colorful dev logging
        app.use(require('morgan')('dev'));
        break;
    case 'production':
        // module 'express-logger' supports daily log rotation
        app.use(require('express-logger')({path: __dirname + '/log/requests.log'}));
        break;
}
// info about cluster works
app.use(function (req, res, next) {
    var cluster = require('cluster');
    if (cluster.isWorker) {
        console.log('Запрос обрабатывает исполнитель номер - %d', cluster.worker.id);
    }
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

app.use(body_parser);

function getWeatherData() {
    return {
        locations: [
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
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weatherContext = getWeatherData();
    next();
});

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') != 'production' && req.query.test == '1';
    next();
});


// database configuration
var mongoose = require('mongoose');
var options = {
    server: {
        socketOptions: {keepAlive: 1}
    }
};
switch (app.get('env')) {
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, options);
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, options);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}

require('./routes.js')(app);

app.use(express.static(__dirname + '/public'));
app.use(function (req, res) {
    res.status(404).render('404');
});
app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).render('500');
});

var server;

function startServer() {
    server = http.createServer(app).listen(app.get('port'), function () {
        console.log('Express started in ' + app.get('env') +
            ' mode on http://localhost:' + app.get('port') +
            '; press Ctrl-C to terminate.');
    });
}

if (require.main === module) {
    // application run directly; start app server
    startServer();
} else {
    // application imported as a module via "require": export function to create server
    module.exports = startServer;
}

