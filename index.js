const { el,$ } = require('./lib/ele.js');
const { getSite } = require('./lib/getSite.js');
const { animate } = require('./lib/animate.js');
const { shape } = require('./lib/shape.js');
const { ajax, getCookies, examineUser } = require('./lib/req.js');
const { tick,clearTick } = require('./lib/timer.js');
const { getMatrix } = require('./lib/transform.js');
const { inertia } = require('./lib/inertia.js');
const { ease } = require('./lib/ease.js');
const { rate } = require('./lib/rate.js');

module.exports = { 
    el, 
    $,
    getSite,
    animate,
    shape,
    ajax, 
    getCookies, 
    examineUser,
    tick,
    clearTick,
    getMatrix,
    inertia,
    ease,
    rate
};

