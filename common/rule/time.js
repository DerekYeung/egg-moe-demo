'use strict';
const { ActiveRecord, Validate, Field } = require('moe-query');
const { Rule } = Validate;

const CreateAttribute = 'create_time';
const UpdateAttribute = 'update_time';

const TimeRule = new Rule('time:save');
TimeRule.inject(function(query) {
  const isNew = this.is('exists');
  const time = Math.round(new Date().getTime() / 1000);
  if (!isNew || !this[CreateAttribute]) {
    if (this.Fields[CreateAttribute]) {
      this[CreateAttribute] = time;
    }
  }
  if (this.Fields[UpdateAttribute]) {
    this[UpdateAttribute] = time;
  }
  return true;
}).on([ 'before save' ]);

module.exports = TimeRule;
