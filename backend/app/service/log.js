'use strict';
const Service = require('egg-moe/component').Service;

class MoeService extends Service {

  async getAccessLogList(gp = this.gp) {
    const model = this.ctx.model.AccessLog;
    const name = gp.name || '';
    const operation = gp.operation || '';
    const admin = gp.admin || '';
    const url = gp.url || '';
    const uuid = gp.uuid || '';
    const description = gp.description || '';
    const datetime = this.ctx.helper.datetime;
    const begin_time = gp.begin_time || '';
    const end_time = gp.end_time || '';
    const where = [];
    if (name) {
      where.push([ 'name', 'LIKE', name ]);
    }
    if (url) {
      where.push([ 'url', 'LIKE', url ]);
    }
    if (operation) {
      where.push([ 'operation', 'LIKE', operation ]);
    }
    if (admin) {
      where.push([ 'admin', 'LIKE', admin ]);
    }
    if (uuid) {
      where.push([ 'uuid', 'LIKE', uuid ]);
    }
    if (description) {
      where.push([ 'description', 'LIKE', description ]);
    }

    if (begin_time) {
      where.push([ 'create_time', '>=', datetime.strtotime(begin_time) ]);
    }
    if (end_time) {
      where.push([ 'create_time', '<=', datetime.strtotime(end_time) ]);
    }
    const list = await model.query.where(where).desc().list(this.gp);
    const logs = list.datas;
    const pages = list.pages;
    return {
      logs,
      pages,
    };
  }

  async getOperationLogList(gp = this.gp) {
    const model = this.ctx.model.OperationLog;
    const name = gp.name || '';
    const operation = gp.operation || '';
    const admin = gp.admin || '';
    const uuid = gp.uuid || '';
    const description = gp.description || '';
    const datetime = this.ctx.helper.datetime;
    const begin_time = gp.begin_time || '';
    const end_time = gp.end_time || '';
    const where = [];
    if (name) {
      where.push([ 'name', 'LIKE', name ]);
    }
    if (operation) {
      where.push([ 'operation', 'LIKE', operation ]);
    }
    if (admin) {
      where.push([ 'admin', 'LIKE', admin ]);
    }
    if (uuid) {
      where.push([ 'uuid', 'LIKE', uuid ]);
    }
    if (description) {
      where.push([ 'description', 'LIKE', description ]);
    }

    if (begin_time) {
      where.push([ 'create_time', '>=', datetime.strtotime(begin_time) ]);
    }
    if (end_time) {
      where.push([ 'create_time', '<=', datetime.strtotime(end_time) ]);
    }
    const list = await model.query.where(where).desc().list(this.gp);
    const logs = list.datas;
    const pages = list.pages;
    return {
      logs,
      pages,
    };
  }

}

module.exports = MoeService;
