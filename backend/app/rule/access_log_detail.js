'use strict';
const { Validate } = require('moe-query');
const { Rule } = Validate;

const requestField = 'gp';
const headerField = 'header';

module.exports = app => {
  return function(id, name) {
    const AccessRule = new Rule('access:log');
    AccessRule.inject(function() {
      let gp = this.get(requestField);
      let header = this.get(headerField);
      if (gp instanceof Object) {
        gp = JSON.stringify(gp);
      }
      if (header instanceof Object) {
        header = JSON.stringify(header);
      }
      this.gp = gp;
      this.header = header;

      const resource = this.resource;

      if (resource) {
        const {
          detail,
          description,
        } = this.explanation(this);
        this.resource = JSON.stringify(detail);
        this.description = description || '无';
      }

      return true;
    }).on([ 'before save' ]);
    return AccessRule;
  };
};
