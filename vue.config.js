// https://github.com/vuejs/vue-cli/blob/dev/docs/config.md

module.exports = {
    baseUrl: `/${process.env.APP_SUB_PATH?process.env.APP_SUB_PATH:''}`,
    chainWebpack: (config) => {
        //https://github.com/GoogleChromeLabs/preload-webpack-plugin
        config.plugin('preload').tap(options => {
            if(typeof options[0].fileBlacklist === "undefined")
                options[0].fileBlacklist=[];
            options[0].fileBlacklist.push(/datapacker\.v\d+\.js$/);
            return options;
        });
        config.plugin('prefetch').tap(options => {
            if(typeof options[0].fileBlacklist === "undefined")
                options[0].fileBlacklist=[];
            options[0].fileBlacklist.push(/.*datapacker\.v\d+\.js$/);
            return options;
        });
    }
};