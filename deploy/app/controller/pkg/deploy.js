'use strict';

const Controller = require('egg-moe/component').Controller.UnAuth;
const Builder = require('egg-moe-builder');
const path = require('path');
const isWin = process.platform == 'win32';

class MoeController extends Controller {

  async __construct() {
  }

  async path() {
    const target = this.gp.target || '';
    const task = this.gp.task || '';
    const app = this.gp.app || '';
    const baseDeployPath = this.app.config.deployPath || (isWin ? path.join(this.app.config.baseDir, 'deploys') : '/app/ews/deploys');
    const basePrePath = this.app.baseDir + '/pre';
    const prePath = path.join(basePrePath, task);
    const deployPath = path.join(baseDeployPath, app);
    const common = path.join(deployPath, 'common');
    const main = path.join(deployPath, 'main');
    // const name = app.replace('ews-', '');
    if (!this.app.serviceList[app]) {
      this.app.serviceList[app] = {
        app,
      };
    }
    const service = this.app.serviceList[app];

    this.ctx.runInBackground(async () => {
      service.deploying = 1;
      service.label = 'warning';
      service.state = '正在解压';
      await Builder.util.unzip(target, deployPath);
      service.state = '正在构建';
      await Builder.util.install(common);
      await Builder.util.install(main);
      console.log('install ok');
      service.state = '准备启动';
      await Builder.util.stop(main);
      console.log('stop ok');
      service.state = '启动中';
      await Builder.util.start(main);
      console.log('start ok');
      service.deploying = 0;
      service.state = '';
      service.label = '';
    });

    // await Builder.util.stop(this.app.baseDir + '/test/ews-app');
    // setp.1 create pre project
    // setp.2 check project status
    // setp.3 try stop old project
    // setp.4 remove old project
    // setp.5 move project
    // setp.6 try start project
    // await Builder.util.start(this.app.baseDir + '/test/ews-app');
    return {
      test: this.app.deployTasks,
    };
  }

}

module.exports = MoeController;
