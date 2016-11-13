var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    orderNumber: Number,
    customerId: Number,
    date: String,
    status: String
});
var Order = mongoose.model('Order', orderSchema);
module.exports = Order;
