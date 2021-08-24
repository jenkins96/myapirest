
const config = {};

config.PORT = process.env.PORT || 3000;
process.env.SECRET = "secretKey";
process.env.EXPIRES = 60 * 60 * 24 * 30;

module.exports = config;