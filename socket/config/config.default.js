'use strict';
const path = require('path');

module.exports = appInfo => {
  const common = require(path.resolve(appInfo.baseDir, appInfo.pkg.moe.common + '/config/default'));
  const config = exports = common.inject(appInfo) || {};
  config.keys = appInfo.name + '_1531706294242_5606';
  config.cluster = {
    sticky: true,
    listen: {
      path: '',
      sticky: true,
      port: 7003,
      hostname: '',
    },
  };
  config.io = {
    init: {
      wsEngine: 'ws',
    },
    namespace: {
      '/passport': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
      '/app': {
        connectionMiddleware: [ ],
        packetMiddleware: [],
      },
      '/game': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
  };
  return config;
};
