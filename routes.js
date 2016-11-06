var main = require('./handlers/main.js');
var contest = require('./handlers/contest.js');
var tours = require('./handlers/tours.js');
var sample = require('./handlers/sample.js');
module.exports = function (app) {
    app.get('/', main.home);
    app.get('/about', main.about);
    app.post('/about/process', main.aboutProcessPost);
    app.get('/newsletter', main.newsletter);
    app.post('/process', main.processPost);
    app.get('/thank-you', main.thankYou);

    app.get('/contest/vacation-photo', contest.vacationPhoto);
    app.post('/contest/vacation-photo/:year/:month', contest.vacationPhotoProcessPost);

    app.get('/tours/hood-river', tours.HoodRiver);
    app.get('/tours/request-group-rate', tours.requestGroupRate);

    app.get('/fail', sample.fail);
    app.get('/epic-fail', sample.epicFail);
};