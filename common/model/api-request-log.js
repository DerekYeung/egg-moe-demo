'use strict';
const { ActiveRecord, Validate, Field } = require('moe-query');
const { Rule } = Validate;

module.exports = app => {
  class Model extends ActiveRecord {

    tableName() {
      return 'api_request_log';
    }

    config() {
      return {
        db: 'logger',
      };
    }

    extras() {
      return {
      };
    }

    relation() {
      return {
      };
    }

    Master() {
      return app.db;
    }

  }
  const model = new Model();
  model.fields({
    uuid: new Field().label('uuid').string(16),
    url: new Field().label('url').string(16),
    method: new Field().label('method').string(16),
    request: new Field().label('response').string(16),
    response: new Field().label('response').string(16),
    error: new Field().label('error').string(16),
    create_time: new Field('create_time').label('创建时间').time(),
  });
  if (app.rule.Time) {
    model.mount(app.rule.Time);
  }
  return model;
};
