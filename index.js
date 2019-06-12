const timer = require('./lib/timer.js');
const req = require('./lib/req.js');
const ele = require('./lib/ele.js');

const obj = Object.assign({}, timer, req, ele);

module.exports = Object.freeze(obj);

//{ el, $, getType, tick, clearTick, ajax, getCookies, examineUser, TWEEN }

