'use strict';
const { Validate } = require('moe-query');
const { Rule } = Validate;

const defaultId = 'adminid';
const defaultName = 'admin';

module.exports = app => {
  return function(name) {
    const OperationLog = new Rule('operation:log');
    OperationLog.inject(function(query) {
      const model = this.hasOperationModel ? this.hasOperationModel() : this.get(app.model.Master.OperationLog);
      const log = model.create();
      const ctx = this.ctx || app.ctx;
      const resource = this;
      const Pid = resource.Pid || 0;
      const isCreated = (query.action === 'insert');
      const nameData = isCreated ? resource.get('name') : resource.getOld('name');
      const Admin = ctx.Admin || {};

      log.name = name;
      if (log.Fields[defaultId]) {
        log[defaultId] = Admin.id;
      }
      if (log.Fields[defaultName]) {
        log[defaultName] = Admin.name;
      }
      const operation = isCreated ? '创建' : '更新';
      const description = [];
      if (log[defaultName]) {
        description.push(`管理员<${log[defaultName]}>`);
      }
      description.push(operation + '了');
      const resourceDescription = [];

      if (Pid) {
        resourceDescription.push(`${resource.Labels[resource.PrimaryKey]}为<${Pid}>`);
      }
      if (nameData) {
        resourceDescription.push(`${resource.Labels.name}为<${nameData}>`);
      }
      if (resourceDescription) {
        description.push(resourceDescription.join('、'));
      } else {
        description.push('未知');
      }
      description.push('的');
      if (resource.ModelName) {
        description.push(`<${resource.ModelName}>`);
      } else {
        description.push('未知模型');
      }

      log.description = description.join(' ');
      log.operation = operation;
      log.url = ctx.url;
      log.uuid = ctx.uuid;
      log.table = resource.getTableName();
      log.tableid = Pid;
      log.detail = {
        resource,
        isCreated,
        ua: ctx.get ? ctx.get('user-agent') : '',
        gp: ctx.gp,
        header: ctx.header,
      };
      return log.save();
    }).on([ 'after save' ]);
    const DeleteEvent = new Rule('operation:log:delete');
    DeleteEvent.inject(function(result) {
      const model = this.hasOperationModel ? this.hasOperationModel() : this.get(app.model.Master.OperationLog);
      const log = model.create();
      const ctx = this.ctx || app.ctx;
      const resource = this;
      const Pid = resource.Pid || 0;
      const isDeleted = result.affectedRows > 0;
      const nameData = resource.get('name');
      const Admin = ctx.Admin || {};

      log.name = name;
      if (log.Fields[defaultId]) {
        log[defaultId] = Admin.id;
      }
      if (log.Fields[defaultName]) {
        log[defaultName] = Admin.name;
      }
      const operation = isDeleted ? '删除' : '尝试删除';
      const description = [];
      if (log[defaultName]) {
        description.push(`管理员<${log[defaultName]}>`);
      }
      description.push(operation + '了');
      const resourceDescription = [];

      if (Pid) {
        resourceDescription.push(`${resource.Labels[resource.PrimaryKey]}为<${Pid}>`);
      }
      if (nameData) {
        resourceDescription.push(`${resource.Labels.name}为<${nameData}>`);
      }
      if (resourceDescription) {
        description.push(resourceDescription.join('、'));
      } else {
        description.push('未知');
      }
      description.push('的');
      if (resource.ModelName) {
        description.push(`<${resource.ModelName}>`);
      } else {
        description.push('未知模型');
      }

      log.description = description.join(' ');
      log.operation = operation;
      log.url = ctx.url;
      log.uuid = ctx.uuid;
      log.table = resource.getTableName();
      log.tableid = Pid;
      log.detail = {
        resource,
        isDeleted,
        ua: ctx.get ? ctx.get('user-agent') : '',
        gp: ctx.gp,
        header: ctx.header,
      };
      return log.save();
    }).on([ 'after delete' ]);
    return [ OperationLog, DeleteEvent ];
  };
};
