const loaderUtils = require('loader-utils');

module.exports = function(source){  // 这里是不能使用箭头函数的
    return source.replace('wd',options.name);
} 