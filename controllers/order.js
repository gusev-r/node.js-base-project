var Order = require('../models/order');

module.exports = {
    registerRoutes: function (app) {
        app.get('/order/add', this.add);
        app.post('/order/add', this.processAdd);

        app.get('/order/:id', this.home);
    },
    add: function (req, res, next) {
        res.render('order/add');
    },
    processAdd: function (req, res, next) {
        var newOrder = new Order({
            orderNumber: req.body.orderNumber,
            customerId: req.body.customerId,
            date: req.body.date,
            status: req.body.status
        });
        newOrder.save(function (err) {
            if (err) return next(err);
            res.redirect(303, '/order/' + newOrder._id);
        });
    },
    home: function (req, res, next) {
        Order.findById(req.params.id, function (err, order) {
            if (err) return next(err);
            if (!order) return next(); 	// pass this on to 404 handler

            res.render('order/home', order)
        });
    }
}