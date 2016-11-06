exports.fail = function (req, res) {
    throw new Error('Нет!');
};
exports.epicFail = function (req, res) {
    process.nextTick(function () {
        throw new Error('Бабах!');
    })
};