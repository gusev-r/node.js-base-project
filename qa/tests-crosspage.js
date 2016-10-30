var assert = require('chai').assert;

var Browser = require('zombie');
Browser.localhost('localhost', 30000);

var browser;
suite('Межстраничные тесты', function () {
    setup(function () {
        browser = new Browser();
    });
    test('Запрос расценок для групп со страницы туров по реке Худ'
        +'долден заполнять поле рефера', function (done) {
            var referrer = 'http://localhost:30000/tours/hood-river';
            browser.visit(referrer, function() {
                browser.clickLink('.requestGroupRate', function () {
                    console.log('val: '+browser.field('referrer').value);
                    assert(browser.field('referrer').value === referrer);
                    done();
                });



            });
    });
    test('Запрос расценок для групп со страницы туров пансионата "Орегон Коуст" должен заполнять реферера', function (done) {
        var referrer = 'http://localhost:30000/tours/hood-river';
            browser.visit(referrer, function () {
                browser.clickLink('.requestGroupRate', function () {
                    assert(browser.field('referrer').value === referrer);
                    done();
                });
            });
    });
    test('Посечение страницы "Запрос цены для групп" напрямую'
        +'должен привести к пустому полю рефера', function (done) {
	var referrer = 'http://localhost:30000/tours/request-group-rate';
        browser.visit(referrer, function () {
                assert(browser.field('referrer').value === '');
                done();
        });
    });
})
