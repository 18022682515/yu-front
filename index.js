import { tick,clearTick } from './lib/timer.js';
import { ajax, getCookies, examineUser } from './lib/req.js';
import { el, $ } from './lib/ele.js';
import { animate } from './lib/animate.js';
import { shape } from './lib/shape.js';
import { getSite } from './lib/getSite.js';

const front = { getSite,tick,clearTick,ajax, getCookies, examineUser,el, $,animate,shape };
export { getSite,tick,clearTick,ajax, getCookies, examineUser,el, $,animate,shape };
export default front;

// { el, $, ajax, getCookies, tick, clearTick, examineUser, svgPathAni }

