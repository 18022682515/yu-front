module.exports = obj=>{
    let { el,scroll,scrollStop } = obj;
    el.addEventListener('scroll',function(e){
        scroll && scroll.call(this,e);
        let top = this.scrollTop;
        setTimeout(()=>{
            if(top===this.scrollTop){
                scrollStop && scrollStop.call(this,e);
            }
        },60);

    });
}