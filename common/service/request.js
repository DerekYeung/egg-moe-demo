'use strict';
const Service = require('egg-moe/component').Service;

class MoeService extends Service {

  constructor(ctx) {
    super(ctx);
    this.acceptEvent = true;
  }

  beforeRequest(request) {
    return request;
  }

  afterRequest(request, response, error) {
    const model = this.ctx.model.ApiRequestLog;
    model.create().save({
      url: request.req.url,
      method: request.config.options.method,
      request: JSON.stringify(request.config),
      response: JSON.stringify(response),
      error: JSON.stringify(error),
    });
    return request;
  }

  send() {
  }

  pull() {
  }

}

module.exports = MoeService;
