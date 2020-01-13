'use strict';
module.exports = app => {
  const helper = app.ctx.helper;
  const datetime = helper.datetime;
  class Bridge {
    constructor(nsp, message = {}, fn) {
      this.uuid = helper.uuid.v4();
      this.timeout = message.timeout || 15000;
      this.create_time = datetime.microtime(true);
      const client = app.io.of(nsp).to(message.id);
      if (client) {
        const params = Object.assign({}, message.params || {}, {
          uuid: this.uuid,
        });
        client.emit(message.action, params);
        this.fn = fn;
      } else {
        fn({
          error: 'no-client',
        });
      }
    }
  }
  class ProxyBridge {
    constructor() {
      this.channels = [];
    }

    create(nsp, message = {}, fn) {
      const bridge = new Bridge(nsp, message, fn);
      const channel = {
        uuid: bridge.uuid,
        bridge,
      };
      channel.timer = setTimeout(() => {
        this.timeout(channel.uuid);
      }, bridge.timeout);
      this.channels.push(channel);
      return channel;
    }

    receive(message = {}) {
      const uuid = message.uuid || '';
      const channel = this.channels.find(node => {
        return node.uuid == uuid;
      });
      if (channel) {
        if (channel.timer) {
          clearTimeout(channel.timer);
        }
        message.Times = {
          create_time: channel.bridge.create_time,
          receive_time: datetime.microtime(true),
        };
        message.Times.take = message.Times.receive_time - message.Times.create_time;
        channel.bridge.fn(message);
      }
    }

    timeout(uuid) {
      const index = this.channels.findIndex(node => {
        return node.uuid == uuid;
      });
      if (index > -1) {
        this.channels.splice(index, 1);
      }
    }
  }
  app.beforeStart(async () => {
    if (app.redis) {
      await app.redis.set('socket/alive', 0);
    }
  });
  app.proxyBridge = new ProxyBridge();
};
