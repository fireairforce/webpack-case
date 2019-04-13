const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
// @babel/traverse使用的是import导入
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

const moduleAnalyser = (filename) =>{
    const content = fs.readFileSync(filename,'utf-8');
    const ast = (parser.parse(content,{
        sourceType:'module',
    }))
    const dependencies = {};
    traverse(ast,{
        ImportDeclaration({ node }){
            const dirname = path.dirname(filename)
            const newFile = './' + path.join(dirname,node.source.value)  // 这个是我们打包的时候要使用的路径
            // console.log(newFile);
           // console.log(node);
           dependencies[node.source.value]= newFile;
        //    console.log(dependencies); //对入口文件的依赖分析
        }
    });
    // 把抽象语法树转换为一个对象,这个时候的code和之前见到的就不同了.(成了一端翻译好的代码了)
    const { code } = babel.transformFromAst(ast,null,{ 
        presets: ["@babel/preset-env"]
    });
    // console.log(code);
    return {
        filename,
        dependencies,
        code
    }
    // console.log(ast.program.body);
}
const moduleInfo = moduleAnalyser('./src/index.js');

console.log(moduleInfo);