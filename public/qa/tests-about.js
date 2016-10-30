suite('Тест страницы About', function () {
    test('The page must contain a link to the contact page', function () {
        assert($('a[href="/contact"]').length);
    });
});
