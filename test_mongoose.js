var mongoose = require('mongoose');
console.log(mongoose.version);

var db = mongoose.createConnection('mongodb://localhost/towns');

db.on("error", console.error.bind(console, "connection error:"));


var UserSchema = new mongoose.Schema({
    name: {type: String, default: "hahaha"},
    age: {type: Number, min: 18, index: true},
    bio: {type: String, match: /[a-z]/},
    date: {type: Date},
    buff: Buffer
});
UserSchema.path("name").set(function (name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
});
UserSchema.methods.speak = function () {
    var greeting = this.name
        ? "My name is " + this.name
        : "I don't have a name";
    console.log(greeting);
};

var User = db.model("User", UserSchema);
var newUser = new User({name: "Петя", age: 35});

db.once("open", function callback() {
    console.log("Connected!");

    newUser.save(function (err, newUser) {
        if (err) {
            console.log("Something goes wrong with user " + newUser.name);
        } else {
            console.log("add new user");

            User.find(function (err, users) {
                console.log(users)
            });
            User.find({name: /^Al/}, function (err, users) {
                console.log(users)
            })
            db.close();
        }
    });
});

//
//
// // initialize vacations
// Vacation.find(function(err, vacations){
//     if(vacations.length) return;
//
//     new Vacation({
//         name: 'Hood River Day Trip',
//         slug: 'hood-river-day-trip',
//         category: 'Day Trip',
//         sku: 'HR199',
//         description: 'Spend a day sailing on the Columbia and ' +
//         'enjoying craft beers in Hood River!',
//         priceInCents: 9995,
//         tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
//         inSeason: true,
//         maximumGuests: 16,
//         available: true,
//         packagesSold: 0,
//     }).save();
//
//     new Vacation({
//         name: 'Oregon Coast Getaway',
//         slug: 'oregon-coast-getaway',
//         category: 'Weekend Getaway',
//         sku: 'OC39',
//         description: 'Enjoy the ocean air and quaint coastal towns!',
//         priceInCents: 269995,
//         tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
//         inSeason: false,
//         maximumGuests: 8,
//         available: true,
//         packagesSold: 0,
//     }).save();
//
//     new Vacation({
//         name: 'Rock Climbing in Bend',
//         slug: 'rock-climbing-in-bend',
//         category: 'Adventure',
//         sku: 'B99',
//         description: 'Experience the thrill of rock climbing in the high desert.',
//         priceInCents: 289995,
//         tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing', 'hiking', 'skiing'],
//         inSeason: true,
//         requiresWaiver: true,
//         maximumGuests: 4,
//         available: false,
//         packagesSold: 0,
//         notes: 'The tour guide is currently recovering from a skiing accident.',
//     }).save();
// });
