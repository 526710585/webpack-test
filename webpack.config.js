const path = require('path');

module.exports = {

    mode: "production",

    entry: ['./src/index.js'],

    output: {

        path: path.resolve(__dirname, 'dist'),

        filename: '[name].js'

    },

    module: {

        rules: [{

            test: /\.js$/,

            include: [

                path.resolve(__dirname, 'src')

            ],

            exclude: /(node_modules|bower_components)/,

            loader: "babel-loader",

        }]

    }

}
