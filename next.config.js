module.exports = {
    poweredByHeader: false,
    webpack: (config, {webpack, buildId}) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
        };
        config.plugins.push(
            new webpack.DefinePlugin({
                __BUILD_ID__: JSON.stringify(buildId)
            }),
        );

        return config;
    },
    images: {
        domains: ['media.elrond.com'],
    }
}