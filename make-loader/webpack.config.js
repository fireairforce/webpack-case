const path = require('path')

module.exports = {
    mode:'development',
    entry: {
      main:'./src/index.js',
    },
    module:{
       rules: [{
           loader: path.resolve(__dirname,'./loaders/replaceLoader.js'),
           options:{
               name:'wd'
           }
        //    test: /\.js/,
        //    use: [path.resolve(__dirname,'./loaders/replaceLoader.js')]
       }]
    },
    output:{
        path: path.resolve(__dirname,'dist'),
        filename:'[name].js'
    }
}