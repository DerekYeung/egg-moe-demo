'use strict';
const { ActiveRecord, Validate, Field } = require('moe-query');
const { Rule } = Validate;

const crypto = require('crypto');

const PublicTokenSecrectKey = 'demo-basic-jwt-key';
const OpenidTokenSecrectKey = 'demo-basic-openid-key';

module.exports = app => {
  const jwt = app.ctx.helper.jwt;
  class Model extends ActiveRecord {

    get RootKey() {
      return '!#@#^%*^$#%';
    }

    tableName() {
      return 'user';
    }

    makeSecurePassword(password, rootKey) {
      rootKey = rootKey || this.RootKey;
      let str;
      const mixed = crypto.createHash('md5');
      mixed.update(password + rootKey);
      str = mixed.digest('hex');
      const gen = crypto.createHash('md5');
      gen.update(str);
      str = gen.digest('hex');
      return str;
    }

    validatePassword(password, compared) {
      compared = compared || this.password;
      password = password || '';
      password = password.length >= 32 ? password : this.makeSecurePassword(password);
      if (password !== compared) {
        return false;
      }
      return true;
    }

    changePassword(password = '') {
      password = this.makeSecurePassword(password);
      return this.save({
        password,
      });
    }

    makeGeneralAccessToken(userid, password) {
      userid = userid || this.id;
      password = password || this.password;
      userid = isNaN(userid) ? 0 : userid;
      if (userid <= 0) {
        return '';
      }
      return jwt.sign({
        id: userid,
        password,
        create_time: app.ctx.helper.datetime.time(),
      }, PublicTokenSecrectKey);
    }

    generateOpenid(client = {}, userid = this.id = 0) {
      const hash = `${client.appid}/${userid}`;
      return app.ctx.helper.encrypt.authcode(hash, 'ENCODE', OpenidTokenSecrectKey);
    }

    generateOauthAccessToken(client = {}, user = {}, scope = '') {
      const provider = client.appid;
      const payload = {
        provider,
        scope,
      };
      if (scope === 'temporary') {
        payload.temporary = true;
      }
      payload.unionid = this.generateOpenid(client, user.id);
      if (client.application) {
        payload.app = client.application.appid;
        payload.openid = this.generateOpenid(client.application, user.id);
      }
      return app.ctx.helper.jwt.sign(payload, OpenidTokenSecrectKey, {
        expiresIn: (scope === 'temporary' ? 1 : 7) + 'd',
      });
    }

    getUserByOauthAccessToken(accessToken) {
      return new Promise(resolve => {
        jwt.verify(accessToken, OpenidTokenSecrectKey, (err, decoded) => {
          const unvalidate = this.create();
          if (err) {
            resolve(unvalidate);
          } else {
            const unionid = decoded.unionid || '';
            const union = app.ctx.helper.encrypt.authcode(unionid, 'DECODE', OpenidTokenSecrectKey) || '';
            const userid = union.split('/')[1];
            const query = this.fetch(userid);
            query.then(user => {
              if (user.not('exists')) {
                return resolve(user);
              }
              user.unionid = unionid;
              user.openid = decoded.openid;
              return resolve(user);
            });
          }
        });
      });
    }

    getUserByGeneralAccessToken(accessToken) {
      return new Promise(resolve => {
        jwt.verify(accessToken, PublicTokenSecrectKey, (err, decoded) => {
          const unvalidate = this.create();
          if (err) {
            resolve(unvalidate);
          } else {
            const userid = decoded.id;
            const query = this.fetch(userid);
            const password = decoded.password || '';
            query.then(user => {
              if (user.not('exists')) {
                return resolve(user);
              }
              if (password) {
                if (!user.validatePassword(password)) {
                  return resolve(unvalidate);
                }
              }
              return resolve(user);
            });
          }
        });
      });
    }

    register(data = {}) {
      data.password = this.makeSecurePassword(data.password);
      return this.create().save(data);
    }

    logLogin() {
    }

    relation() {
      return {};
    }

    Master() {
      return app.db;
    }

  }
  const model = new Model();
  model.fields({
    name: new Field('name').label('昵称'),
    mobile: new Field('mobile').label('手机号').mobile()
      .required(),
    password: new Field('password').label('密码').string(128)
      .required(),
    update_time: new Field('update_time').label('更新时间').time(),
    create_time: new Field('create_time').label('创建时间').time(),
  });
  model.rules([
    new Rule(model.Fields.mobile),
    new Rule(model.Fields.password),
  ]);
  if (app.rule.Time) {
    model.mount(app.rule.Time);
  }
  return model;
};
