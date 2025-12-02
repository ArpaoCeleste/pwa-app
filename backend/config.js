const config = {
    db: 'mongodb+srv://Sapo:1234@nerpa.wzmhcpm.mongodb.net/stadium',
    secret: 'a-string-secret-at-least-256-bits-long',
    expiresPassword: 86400, // expires in 24hours
    saltRounds: 10
 }
 
 module.exports = config;