module.exports = {
    entry : __dirname + '/index.js',
    output : {
        path : __dirname + '/dist',
        filename : 'index.js',
        libraryTarget : 'umd'
    },
    module : {
        loaders : [ {
            test : /\.jsx?$/,
            loader : 'babel'
        } ]
    },
    externals : [ "promise", "mosaic-adapters", "mosaic-dataset",
            "mosaic-dataset-index", "mosaic-intents" ]
};
