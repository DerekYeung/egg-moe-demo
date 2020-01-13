'use strict';
const Service = require('egg-moe/component').Service;
const fs = require('fs');
const util = require('util');
const path = require('path');

const runScript = require('runscript');
const isWin = process.platform === 'win32';
const REGEX = isWin ? /^(.*)\s+(\d+)\s*$/ : /^\s*(\d+)\s+(.*)/;
const osRelated = {
  titleTemplate: isWin ? '\\"title\\":\\"%s\\"' : '"title":"%s"',
  appWorkerPath: isWin ? 'egg-cluster\\lib\\app_worker.js' : 'egg-cluster/lib/app_worker.js',
  agentWorkerPath: isWin ? 'egg-cluster\\lib\\agent_worker.js' : 'egg-cluster/lib/agent_worker.js',
};

function customRequire(file = '') {
  const read = fs.readFileSync(file);
  const raw = read.toString();
  return JSON.parse(raw);
}

class MoeService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  async getProcesslist() {
    const filterFn = null;
    const command = isWin ?
      'wmic Path win32_process Where "Name = \'node.exe\'" Get CommandLine,ProcessId' :
    // command, cmd are alias of args, not POSIX standard, so we use args
      'ps -eo "pid,args"';

    const stdio = await runScript(command, { stdio: 'pipe' });
    const processList = stdio.stdout.toString().split('\n')
      .reduce((arr, line) => {
        if (!!line && !line.includes('/bin/sh') && line.includes('node')) {
          const m = line.match(REGEX);
          /* istanbul ignore else */
          if (m) {
            const item = isWin ? { pid: m[2], cmd: m[1] } : { pid: m[1], cmd: m[2] };
            if (!filterFn || filterFn(item)) {
              arr.push(item);
            }
          }
        }
        return arr;
      }, []);
    const argv = {
      title: '',
    };
    const processes = processList.filter(item => {
      const cmd = item.cmd;
      return argv.title ?
        cmd.includes('start-cluster') && cmd.includes(util.format(osRelated.titleTemplate, argv.title)) :
        cmd.includes('start-cluster');
    });
    const list = processes.map(node => {
      const explode = (node.cmd || '').split(' ');
      const [ bash, cluster, options ] = explode;
      node.explode = explode;
      node.bash = bash;
      node.cluster = cluster;
      if (isWin) {
      	const pre = JSON.parse(options).replace(new RegExp(/\\/,'g'), '\\\\');
      	node.options = options ? JSON.parse(pre) : {};
      } else {
      	node.options = options ? JSON.parse(options) : {};
      }
      const dirs = (node.options.baseDir || '').split(path.sep);
      const dir = dirs[dirs.length - 1];
      const app = dir == 'main' ? dirs[dir.length - 2] : dir;
      const title = node.options.title || '';
      node.app = title ? title.replace('egg-server-', '') : app;
      return node;
    });
    return list;
  }

  async getServiceList() {
    const processList = await this.getProcesslist();
    const serviceList = this.app.serviceList;
    processList.forEach(node => {
      const exists = serviceList[node.app];
      if (!exists) {
        serviceList[node.app] = {
          app: node.app,
          // process: node,
        };
      }
    });
    const list = [];
    for (const k in serviceList) {
      list.push(serviceList[k]);
    }
    const services = list.map(node => {
      const pro = processList.find(data => {
        return data.app == node.app;
      }) || {};
      node.process = pro;
      if (node.process && node.process.pid && !node.deploying) {
        node.state = '运行中';
        node.label = 'success';
      }
      let pkg = {};
      if (node.process) {
        const options = node.process.options || {};
        if (options.baseDir) {
          const container = path.join(path.dirname(options.baseDir), 'pkg.json');
          try {
            pkg = customRequire(container);
          } catch (e) {
            pkg = {};
          }
        }
      }
      node.pkg = pkg;
      if (!node.state) {
        node.state = '已停止';
        node.label = 'error';
      }
      node.process = node.process || {};
      return node;
    });
    return {
      services,
    };
  }

}

module.exports = MoeService;
