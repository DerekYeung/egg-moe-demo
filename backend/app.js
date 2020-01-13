'use strict';
module.exports = app => {
  app.beforeStart(async () => {
    if (app.config.env == 'prod') {
      const Export = app.ctx.service.Export;
      Export.clearUndone();
    }
  });
};
