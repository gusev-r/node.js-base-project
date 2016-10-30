const Browser = require('zombie');

// We're going to make requests to http://example.com/signup
// Which will be routed to our test server localhost:3000
Browser.localhost('example.com', 30000);

describe('User visits signup page', function() {

    const browser = new Browser();

    before(function(done) {
        browser.visit('/about', done);
    });

    describe('submits form', function() {

        before(function(done) {
            browser
                .fill('email',    'test@test.test')
                .fill('body', 'Text message')
                .pressButton('send', done);
        });

        it('should be successful', function() {
            browser.assert.success();
        });

        it('should see welcome page', function() {
            browser.assert.text('title', 'Title');
        });
    });
});
