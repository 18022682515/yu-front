import { getType } from 'yu-util';
import { tick } from './timer.js';

Element.prototype.speedAni = function(speed,max){
    if( !(getType(speed)==='Object' && getType(max)==='Object') ) return;

    Object.keys(max).forEach(key=>{
        if( !(getType(speed[key])==='String' || getType(speed[key])==='Number') ) return;

        if(getType(max[key])==='String'){
            if(max[key].includes('%')){
                let parent = this.parentNode;
                if(key==='x'){
                    let parentCss = parseFloat(getComputedStyle(parent)['width']);
                    let percent = parseFloat(max[key]);
                    max[key] = parentCss/100*percent;
                }else if(key==='y'){
                    let parentCss = parseFloat(getComputedStyle(parent)['height']);
                    let percent = parseFloat(max[key]);
                    max[key] = parentCss/100*percent;
                }
            }else{
                max[key] = parseFloat(max[key]);
            }
        } 
    });

    Object.keys(speed).forEach(key=>{
        if( !(getType(speed[key])==='String' || getType(speed[key])==='Number') ) return;

        if(getType(speed[key])==='String'){
            if(speed[key].includes('%')){
                let percent = parseFloat(speed[key]);
                speed[key] = max[key]/100*percent;
            }else{
                speed[key] = parseFloat(speed[key]);
            }
        }
    });

    
    let width = parseFloat(getComputedStyle(this).width);
    let height = parseFloat(getComputedStyle(this).height);
    max.x -= width;
    max.y -= height;
    let sum = { x:0, y:0 };
    let bool = false;
    let _this = this;
    let ani = {
        start(){
            _this.style.position = 'absolute';
            bool = false;
            run(sum);
        },
        pause(){
            speed._x = speed.x;
            speed._y = speed.y;
            speed.x = 0;
            speed.y = 0;
        },
        resume(){
            speed.x = speed._x;
            speed.y = speed._y;
        },
        stop(){
            _this.style.position = '';
            bool = true;
            Object.keys(max).forEach(key=>{
                sum[key] = max[key];
            });
        }
    };

    function run(sum){
        Object.keys(sum).forEach(key=>{
            sum[key] += speed[key];

            if(sum[key]>=max[key]){
                sum[key] = max[key];
                speed[key] = -speed[key];
            }else if(sum[key]<=0){
                sum[key] = 0;
                speed[key] = -speed[key];
            }
            let attr = key==='x' ? 'left' : 'top';
            _this.style[attr] = sum[key]+'px';
        });
        if(bool) return;
        tick(()=>{
            run(sum);
        });
    }
    
    return ani
}