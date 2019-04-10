class CopyrightWebpackPlugin{
    
    apply(compiler){
        compiler.hooks.emit.tap('CopyrightWebpackPlugin',(compilation)=>{
            console.log('compiler');
        })
        // 异步的时候     
        compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin',(compilation,cb) => {
        //   console.log(compilation.assets);//可以查看打包生成的内容
        //   console.log(23333);   
          compilation.assets['copyright.txt'] = {
              source: function(){
                  return 'Copyright by zoomdong'
              },
              size: function(){
                  return '21'
              }
          }
          cb();

        })
    }

}
module.exports = CopyrightWebpackPlugin;