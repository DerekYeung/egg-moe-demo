'use strict';
const path = require('path');

module.exports = appInfo => {
  const common = require(path.resolve(appInfo.baseDir, appInfo.pkg.moe.common + '/config/default'));
  const config = exports = common.inject(appInfo) || {};
  config.keys = appInfo.name + '_1532673501201_1218';
  return config;
};
