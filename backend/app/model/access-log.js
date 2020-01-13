'use strict';
const { ActiveRecord, Validate, Field } = require('moe-query');
const { Rule } = Validate;
module.exports = app => {
  class Model extends ActiveRecord {
    tableName() {
      return 'backend_access_log';
    }

    config() {
      return {
        db: 'logger',
      };
    }

    safely() {
      return true;
    }

    extras() {
      return {
        path() {
          const url = this.url || '';
          return url.split('?')[0];
        },
      };
    }

    writeDetail(detail) {
      const model = app.model.AccessLogDetail;
      return model.create(detail).save();
    }

    queryDetail(logid) {
      logid = logid || this.Pid;
      return app.model.AccessLogDetail.fetch(logid, 'logid');
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
    name: new Field('name').label('名称').string(32)
      .required(),
    adminid: new Field('adminid').label('操作人标识').int(10)
      .default(0),
    behavior: new Field('behavior').label('行为').string(32),
    admin: new Field('admin').label('操作人').string(32),
    uuid: new Field('uuid').label('uuid').string(128),
    url: new Field('path').label('路由').string(128),
    method: new Field('method').label('方法').string(16),
    status: new Field('status').label('状态码').string(16),
    load_time: new Field('load_time').label('载入时间').int(10),
    update_time: new Field('update_time').label('更新时间').int(10),
    create_time: new Field('create_time').label('创建时间').time(),
  });
  model.rules([
    new Rule(model.Fields.name),
    new Rule('Restrict').validate({
      message: '管理员设置不允许删除',
      validate() {
        return false;
      },
    }).on('delete'),
  ]);
  if (app.rule.Time) {
    model.mount(app.rule.Time);
  }
  if (app.rule.Access) {
    model.mount(app.rule.Access);
  }
  return model;
};
