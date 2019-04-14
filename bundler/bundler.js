const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
// @babel/traverse使用的是import导入
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

const moduleAnalyser = (filename) => {
    const content = fs.readFileSync(filename, 'utf-8');
    const ast = parser.parse(content, {
        sourceType: 'module',
    })
    const dependencies = {};
    traverse(ast, {
        ImportDeclaration({
            node
        }) {
            const dirname = path.dirname(filename)
            const newFile = './' + path.join(dirname, node.source.value) // 这个是我们打包的时候要使用的路径
            // console.log(newFile);
            // console.log(node);
            dependencies[node.source.value] = newFile;
            //    console.log(dependencies); //对入口文件的依赖分析
        }
    });
    // 把抽象语法树转换为一个对象,这个时候的code和之前见到的就不同了.(成了一端翻译好的代码了)
    const {
        code
    } = babel.transformFromAst(ast, null, {
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

const makeDependenciesGraph = (entry) => {
    // 拿到对入口文件做的依赖的方式
    const entryModule = moduleAnalyser(entry);
    const graphArray = [entryModule];
    for (let i = 0; i < graphArray.length; i++) {
       const item = graphArray[i];
       const { dependencies } = item;
       if(dependencies) {
           for(let j in dependencies) {
               graphArray.push(moduleAnalyser(dependencies[j]));
             // moduleAnalyser(dependencies[j]) // 达到一个递归的作用，拿到每一个依赖
           }
       }
    }
    const graph = {};
    graphArray.forEach((item)=>{
        graph[item.filename] = {
            dependencies: item.dependencies,
            code: item.code
        }
    })
    // console.log(graph);
    return graph;
}

// 一个生成代码的函数,把src目录下不能运行的内容打包成可以使用的代码

const generator = (entry) => {
    const graph = JSON.stringify(makeDependenciesGraph(entry));
    return `
      (function(){
         function require(module){
             function localRequire(relativePath){
                 return require(graph[module].dependencies[relativePath])
             }
             var exports = {};
            (function(require,exports,code){
                eval(code)
            })(localRequire , exports, graph[module].code);
            return exports;
         };
         require('${entry}')
      })(${graph})
    `;
}

const code = generator('./src/index.js');
// console.log(code);
const graphInfo = makeDependenciesGraph('./src/index.js');
const moduleInfo = moduleAnalyser('./src/index.js');