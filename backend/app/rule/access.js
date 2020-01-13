'use strict';
const { Validate } = require('moe-query');
const { Rule } = Validate;

const defaultId = 'adminid';
const defaultName = 'admin';

module.exports = app => {
  return function(id, name) {
    const AccessRule = new Rule('access:log');
    AccessRule.inject(function() {
      id = id || defaultId;
      name = name || defaultName;
      // console.log('this.ctx');
      // console.log(this.ctx.Admin);
      const ctx = this.ctx || {};
      const Admin = ctx.Admin || {};
      if (this.Fields[id]) {
        this[id] = Admin.id;
      }
      if (this.Fields[name]) {
        this[name] = Admin.name;
      }
      return true;
    }).on([ 'before save' ]);
    const AccessLogDetailRule = new Rule('access:log:detail');
    AccessLogDetailRule.inject(function(result) {
      const detail = this.get('detail');
      if (detail) {
        detail.logid = this.id;
        return this.writeDetail(detail);
      }
    }).on([ 'after save' ]);
    return [ AccessRule, AccessLogDetailRule ];
  };
};
