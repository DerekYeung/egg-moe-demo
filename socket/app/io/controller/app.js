'use strict';

const quickBaseToken = 'ewsedu-quick-token';

module.exports = app => {
  class Controller extends app.Controller {

    async login() {
      const { socket } = this;
      const id = socket.id;
      const message = this.args[0] || {};
      const fn = this.args[1] || null;
      const accessToken = message.accessToken || '';
      // const model = this.model.Master.Client;
      const jwt = this.helper.jwt;
      console.log('login');
      console.log(message);
      const decode = jwt.decode(accessToken);
      console.log(decode);
      if (fn) {
        console.log('fn call');
        fn({
          success: 1,
        });
      }
      // decode = decode || {};
      // const exists = await model.fetch(decode.id, 'userid');
      // const nsp = this.app.io.of('/master');
      // await nsp.emit('remote/login', {
      //   userid: decode.id,
      //   accessToken: exists.token,
      // });
    }

    async logout() {
      const {
        socket,
      } = this;
      const id = socket.id;
      const message = this.args[0] || {};
      const fn = this.args[1] || null;
      const user = message.user || {};
      const nsp = this.app.io.of('/master');
      await nsp.emit('remote/logout', {
        userid: user.id,
      });
    }

    async test() {
      const { socket } = this;
      const id = socket.id;
      const message = this.args[0] || {};
      const fn = this.args[1] || null;
    }

    async remotePutScreenshots() {
      const { socket } = this;
      const id = socket.id;
      const message = this.args[0] || {};
      const fn = this.args[1] || null;
      this.app.proxyBridge.receive(message);
    }

    async testBack() {
      console.log('testBack');
    }

    async sendChatMessage() {
      const { socket } = this;
      const id = socket.id;
      const message = this.args[0] || {};
      const fn = this.args[1] || null;
      const Chat = this.service.Chat;
      Chat.sendChatMessage(socket.User, message);

      console.log(socket.User);

      if (fn) {
        console.log('fn call');
        fn({
          success: 1,
        });
      }
    }
  }

  return Controller;
};
