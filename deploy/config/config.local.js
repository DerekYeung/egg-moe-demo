'use strict';

const path = require('path');

module.exports = appInfo => {
  const common = require(path.resolve(appInfo.baseDir, appInfo.pkg.moe.common + '/config/default'));
  const config = exports = common.inject(appInfo) || {};
  config.keys = appInfo.name + '_1540301389788_7319';
  // config.multipart = {
  //   fileExtensions: [ '.moe' ], // 增加对 apk 扩展名的文件支持
  // };
  config.multipart.whitelist.push('.moe');
  config.deployPath = appInfo.baseDir + '/deploys';
  return config;
};
