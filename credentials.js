module.exports = {
    cookieSecret: 'Секрет cookie-файл',
    mongo: {
        development:{
            connectionString: 'mongodb://localhost/towns'
        },
        production: {
            connectionString: 'mongodb://localhost/towns'
        }
    }
};