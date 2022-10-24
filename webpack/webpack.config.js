module.exports = (env) => {
    console.log('process.env', env)

    global.PRODUCTION = process.env.production;

    const webpackDevConfig = require('./webpack.dev.config');
    const webpackProdConfig = require('./webpack.prod.config');

    if (process.env && process.env.production) {
        if (process.env.production === "prod") {
            return webpackProdConfig;
        } else {
            return webpackDevConfig;
        }
    } else {
        return webpackDevConfig;
    }
};