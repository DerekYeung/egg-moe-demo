'use strict';
const { ActiveRecord, Validate, Field } = require('moe-query');
const { Rule } = Validate;
module.exports = app => {
  class Model extends ActiveRecord {
    tableName() {
      return 'backend_access_log_detail';
    }

    config() {
      return {
        db: 'logger',
      };
    }

    extras() {
      return {
        path() {
          const url = this.url || '';
          return url.split('?')[0];
        },
      };
    }

    Master() {
      return app.db;
    }

    relation() {
      return {
      };
    }
  }
  const model = new Model();
  model.fields({
    logid: new Field('logid').label('日志标识').string(32)
      .required(),
    ua: new Field('ua').label('UserAgent').string(128),
    gp: new Field('gp').label('Request').string(128),
    header: new Field('header').label('Header').string(128),
    update_time: new Field('update_time').label('更新时间').int(10),
    create_time: new Field('create_time').label('创建时间').time(),
  });
  model.rules([
    new Rule(model.Fields.logid),
  ]);
  if (app.rule.Time) {
    model.mount(app.rule.Time);
  }
  if (app.rule.AccessLogDetail) {
    model.mount(app.rule.AccessLogDetail);
  }
  return model;
};
