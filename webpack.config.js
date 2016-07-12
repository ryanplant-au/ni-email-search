module.exports = {
    entry: './src/typescript/work.tsx',
    output: {
        filename: './dist/bundle.js',
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.react.tsx', '.tsx', '.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            }
        ],
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    }
};