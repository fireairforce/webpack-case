const loaderUtils = require('loader-utils');

module.exports = function(source){  // 这里是不能使用箭头函数的
    const options = loaderUtils.getOptions(this);
    const callback = this.async();

    setTimeout(()=>{
        const result = source.replace('zoomdong',options.name);
        callback(null,result);
    },1000)
} 