'use strict';

const Service = require('egg-moe/component').Service;
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;
const path = require('path');
const fs = require('fs');

class MoeService extends Service {

  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.File;
  }

  async excel() {
    return await this.upload('excel');
  }

  async photo() {
    return await this.upload('photo');
  }

  async avatar() {
    return await this.upload('avatar');
  }

  async file() {
    return await this.upload('file');
  }

  async upload(type) {
    const upload = await this.uploadFileLocal(type);
    if (upload.hasError) {
      return upload;
    }
    return upload;
  }

  async uploadFileLocal(type = 'normal') {
    const config = this.config;
    let hasError = false;
    let stream,
      filename,
      target,
      savePath,
      writeStream;
    try {
      stream = await this.ctx.getFileStream();
      filename = (stream.filename);
      const ext = path.extname(filename).toLowerCase();
      const [ y, m, d ] = this.ctx.helper.datetime.date('Y-m-d').split('-');
      const uuid = this.ctx.helper.uuid.v4();
      const name = [ uuid, ext ].join('');
      savePath = [ 'files', type, y, m, d, name ];
      target = path.join(config.uploadPath, ...savePath);
      await this.mkdir(target);
      writeStream = fs.createWriteStream(target);
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      console.log('文件上传失败');
      console.log(err);
      if (stream) {
        await sendToWormhole(stream);
      }
      hasError = true;
    }
    if (hasError) {
      return this.error('文件上传失败');
    }
    // const md5 = stream.fields.md5;
    // const file = this.model.create();
    // file.md5 = md5;
    // file.platform = 'app';
    // file.createor = this.ctx.User.name;
    // file.createorid = this.ctx.User.id;
    // file.name = filename;
    // file.path = '';
    // file.size = stream.fields.size || 0;
    // await file.save();

    return {
      filename,
      savePath,
      target,
    };
  }

  async isUpload({
    md5 = '',
  } = this.gp) {
    if (!md5) {
      return this.error('md5不存在');
    }
    const file = await this.model.fetch(md5, 'md5');
    if (!file || file.not('exists')) {
      return this.error('文件不存在');
    }
    return {
      file,
    };
  }

  mkdir(dirpath, mode = 0o777, callback) {
    const pathinfo = path.parse(dirpath);
    if (!fs.existsSync(pathinfo.dir)) {
      this.mkdir(pathinfo.dir, mode, () => {
        fs.mkdirSync(pathinfo.dir);
      });
    }
    callback && callback();
  }

}

module.exports = MoeService;
