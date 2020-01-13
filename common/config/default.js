'use strict';
const path = require('path');
const frame = require('egg-moe/config');
const defaultDatabaseConfig = {
  mysql: {
    hostname: '47.97.40.152',
    username: 'demo',
    password: 'B3yAxFTlWytOEeso',
  },
  slave: {
    hostname: '47.97.40.152',
    username: 'demo',
    password: 'B3yAxFTlWytOEeso',
  },
};
let database = {};
try {
  database = require('./database.local');
} catch (e) {
  database = defaultDatabaseConfig;
}

const common = {
  ports: {
    app: 7001,
    passport: 7002,
    socket: 7003,
    backend: 7100,
    deploy: 8200,
  },
  host: {
    mysql: database.mysql.hostname,
    redis: '47.97.40.152',
    slave: database.slave.hostname,
  },
  localhost: {
    mysql: '172.16.215.64',
    redis: '172.16.215.64',
    slave: '172.16.215.64',
  },
  getHost(service, env = 'local') {
    const lists = env.indexOf('prod.next') > -1 ? this.localhost : this.host;
    return lists[service];
  },
  alinode: {
  },
};
function inject(appInfo = {}) {
  const name = appInfo.name.replace('demo-', '');
  const config = frame(appInfo) || {};
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.cluster = {
    listen: {
      path: '',
      port: common.ports[name],
      hostname: '',
    },
  };
  config.uploadPath = path.join(appInfo.baseDir, 'public/files');
  config.middleware = [];
  config.proxy = true;
  if (!config.noDatabase && !config.db) {
    config.db = {
      client: {
        configs: {
          common: {
            hostname: common.getHost('mysql', appInfo.env),
            database: 'demo',
            username: database.mysql.username,
            password: database.mysql.password,
            tablepre: 'moe_',
            charset: 'utf-8',
            type: 'mysql',
            debug: false,
            slave: {
              hostname: common.getHost('slave', appInfo.env),
              database: 'demo',
              username: database.mysql.username,
              password: database.slave.password,
              tablepre: 'moe_',
              charset: 'utf-8',
              type: 'mysql',
              debug: false,
            },
          },
          logger: {
            hostname: common.getHost('mysql', appInfo.env),
            database: 'log',
            username: database.mysql.username,
            password: database.mysql.password,
            tablepre: 'moe_',
            charset: 'utf-8',
            type: 'mysql',
            debug: false,
          },
        },
      },
      app: true,
      agent: false,
    };
  }
  if (!config.noRedis && !config.redis) {
    config.redis = {
      client: {
        port: 6379, // Redis port
        host: common.getHost('redis', appInfo.env), // Redis host
        password: 'demo-redis-2020',
        db: 0,
      },
    };
  }
  config.oss = {
    clients: {
    },
    default: {
      endpoint: '',
      accessKeyId: '',
      accessKeySecret: '',
    },
  };
  if (!config.noAlinode && common.alinode[name]) {
    config.alinode = {
      appid: common.alinode[name].appid,
      secret: common.alinode[name].secret,
    };
  } else {
    config.alinode = {
      enable: false,
    };
  }
  config.payment = common.payment;
  config.request = {
    service: 'Request',
  };
  config.logrotator = config.logrotator || {};
  config.logrotator.maxDays = 3;

  return config;
}

module.exports = {
  common,
  inject,
};
