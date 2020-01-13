'use strict';
const { ActiveRecord, Validate, Field } = require('moe-query');
const { Rule } = Validate;

module.exports = app => {
  class Model extends ActiveRecord {

    tableName() {
      return 'admin';
    }
    extras() {
      return {
      };
    }

    relation() {
      return {
        User: this.hasOne(app.model.User, {
          mobile: 'mobile',
        }),
      };
    }

    Master() {
      return app.db;
    }

    getAdminListByMobile(mobile) {
      const where = [
        [ 'mobile', '=', mobile ],
      ];
      return this.query.where(where).all();
    }

    getAdminUser(mobile) {
      mobile = mobile || this.mobile;
      return app.model.User.fetch(mobile, 'mobile');
    }

  }
  const model = new Model();
  model.fields({
    name: new Field('name').label('管理员姓名').string(32)
      .required(),
    mobile: new Field('mobile').label('管理员手机号').mobile()
      .required()
      .unique(model),
    update_time: new Field('update_time').label('更新时间').int(10),
    create_time: new Field('create_time').label('创建时间').time(),
  });
  model.rules([
    new Rule(model.Fields.name),
    new Rule(model.Fields.mobile),
  ]);
  if (app.rule.Time) {
    model.mount(app.rule.Time);
  }
  if (app.rule.LogOperation) {
    model.mount(app.rule.LogOperation('授权管理/管理员管理'));
  }
  return model;
};
