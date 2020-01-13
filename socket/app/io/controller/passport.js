'use strict';

const quickBaseToken = 'demo-quick-token';

module.exports = app => {
  class Controller extends app.Controller {
    async quickLoginRequest() {
      const { socket } = this;
      const id = socket.id;
      const message = this.args[0] || {};
      const client = message.client || '';
      const expire = 2 * 60;
      const quickid = this.helper.jwt.sign({
        data: client,
        exp: Math.floor(Date.now() / 1000) + expire,
      }, quickBaseToken);
      const key = `quick/login/${quickid}`;
      const exists = await app.redis.get(key);
      if (exists) {
        await socket.emit('quick/occupy', {
          id,
          quickid,
        });
      } else {
        await socket.emit('quick/id', {
          id,
          quickid,
        });
        await app.redis.set(key, JSON.stringify({
          id,
          status: 'pending',
        }), 'EX', expire);
      }
      setTimeout(() => {
        try {
          socket.emit('quick/expired');
        } catch (e) {
          console.log(e);
        }
      }, expire * 1000);
      // await this.ctx.socket.emit('pong', 'pong');
    }

    async quickLoginScan() {
      const {
        socket,
      } = this;
      const id = socket.id;
      const message = this.args[0] || {};
      const fn = this.args[1];
      const quickid = message.quickid || '';
      const token = message.token || '';
      const key = `quick/login/${quickid}`;
      const verify = this.helper.jwt.verify(quickid, quickBaseToken);
      if (verify) {
        const exists = await app.redis.get(key);
        const name = socket.nsp.name;
        const nsp = app.io.of(name);
        if (exists && token) {
          const json = JSON.parse(exists);
          await nsp.to(json.id).emit('quick/scaned', {
            id,
            quickid,
          });
          if (fn) {
            fn(1);
          }
        }
      }
    }

    async quickLoginConfirm() {
      const {
        socket,
      } = this;
      const id = socket.id;
      const message = this.args[0] || {};
      const fn = this.args[1];
      const quickid = message.quickid || '';
      const token = message.token || '';
      const key = `quick/login/${quickid}`;
      const exists = await app.redis.get(key);
      const name = socket.nsp.name;
      const nsp = app.io.of(name);
      if (exists && token) {
        const json = JSON.parse(exists);
        await nsp.to(json.id).emit('quick/confirm', {
          id,
          quickid,
          token,
        });
      }
      if (fn) {
        fn(1);
      }
    }

    async quickLoginSuccess() {
      const {
        socket,
      } = this;
      const id = socket.id;
      const message = this.args[0] || {};
      const fn = this.args[1];
      const target = message.id;
      const name = socket.nsp.name;
      const nsp = app.io.of(name);
      await nsp.to(target).emit('quick/logined', {
        id,
      });
      if (fn) {
        fn(1);
      }
    }

  }

  return Controller;
};

//  // or async functions
// exports.ping = async function() {
//   const message = this.args[0];
//   await this.socket.emit('res', `Hi! I've got your message: ${message}`);
// };
