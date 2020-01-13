'use strict';
const { ActiveRecord, Validate, Field } = require('moe-query');
const { Rule } = Validate;
module.exports = app => {
  class Model extends ActiveRecord {
    tableName() {
      return 'backend_operation_log_detail';
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

    explanation(model) {
      model = model || this;
      const detail = {};
      const desc = [];
      const resource = model.resource || {};
      const Fields = resource.Fields || {};
      const isCreated = model.isCreated;
      const isDeleted = model.isDeleted;
      if (isDeleted !== undefined) {
        desc.push('该记录操作状态：' + (isDeleted ? '删除' : '尝试删除'));
        for (const k in Fields) {
          const field = Fields[k];
          const label = field.get('label');
          const formatter = field.get('formatter');
          let now = resource.get(k) || '';
          if (formatter) {
            now = formatter(now);
          }
          desc.push(`<${label}>为<${now}>`);
        }
      } else {
        desc.push('该记录操作状态：' + (isCreated ? '新增' : '编辑'));
        for (const k in Fields) {
          const field = Fields[k];
          const label = field.get('label');
          const formatter = field.get('formatter');
          let now = resource.get(k);
          let old = resource.getOld(k);
          if (formatter) {
            old = formatter(old);
          }
          if (formatter) {
            now = formatter(now);
          }
          old = old || null;
          now = now || null;
          if (isCreated) {
            if (now !== null) {
              desc.push(`将<${label}>设置为<${now}>`);
            }
          } else {
            if (now !== old && ((now != null || old != null))) {
              if (old) {
                desc.push(`<${label}>由<${old}>变更为<${now}>`);
              } else {
                desc.push(`将<${label}>设置为<${now}>`);
              }
            }
          }
        }
      }
      detail.main = resource || {};
      detail.old = resource.oldAttributes || {};
      const description = desc.join('\n');
      return {
        detail,
        description,
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
    resource: new Field('resource').label('资源').string(128),
    description: new Field('description').label('详解').string(128),
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
