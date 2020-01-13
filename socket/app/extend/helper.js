'use strict';

module.exports = {
  chatResponse(event, meta = {}, result = {}, origin = {}) {
    const datetime = this.ctx.helper.datetime;
    const metaWithTime = Object.assign({}, {
      formatTime: datetime.date('Y-m-d H:i:s', datetime.time()),
      timestamp: datetime.time(),
    }, meta);

    return {
      event,
      origin,
      meta: metaWithTime,
      result,
    };
  },
};
