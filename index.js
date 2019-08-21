const { animate } = require('./lib/animate.js');
const { el,$ } = require('./lib/ele.js');
const { ajax, getCookies, examineUser } = require('./lib/req.js');
const { tick,clearTick } = require('./lib/timer.js');
const { shape } = require('./lib/shape.js');
const { getSite } = require('./lib/getSite.js');
const scrollEvent = require('./lib/scrollEvent.js');
const getMatrix = require('./lib/transform.js');
const Tween = require('./lib/tween.js');

module.exports = { 
    animate, 
    el, 
    $, 
    ajax, 
    getCookies, 
    tick, 
    clearTick, 
    examineUser,
    shape, 
    getSite,
    scrollEvent,
    getMatrix,
    Tween
};

