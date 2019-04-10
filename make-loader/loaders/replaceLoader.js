const loaderUtils = require('loader-utils');

module.exports = function(source){  // 这里是不能使用箭头函数的
    const options = loaderUtils.getOptions(this);
    return source.replace('hello',options.say);
} 