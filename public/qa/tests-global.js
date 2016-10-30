suite('Global Test', function () {
    test('This page has a valid title', function () {
        assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() != 'TODO');
    });
});
