const path = require('path')

module.exports = {
    mode:'development',
    entry: {
      main:'./src/index.js',
    },
    // 这个配置的作用是当你使用loaders的时候去对应的文件夹下面找相应的loader
    resolveLoader: {
       modules: ['node_modules','./loaders'] 
    },
    module:{
       rules: [{
           test:/\.js/,
           use:[
               {
                 loader:'replaceLoader',
                 options: {
                     say:'goodbye'
                 }
               },{
                   loader:'replaceLoaderAsync',
                   options: {
                       name:'wd'
                   }
               },
           ]
       }]
    },
    output:{
        path: path.resolve(__dirname,'dist'),
        filename:'[name].js'
    }
}