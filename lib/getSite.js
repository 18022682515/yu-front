exports.getSite = function(ele){
    let top = ele.offsetTop;
    let left = ele.offsetLeft;
    (function fn(ele){
        let parent = ele.parentNode;
        let position = getComputedStyle(parent).position;
        if(!/static/.test(position)){
            top += parent.offsetTop;
            left += parent.offsetLeft;

            let topBorder = parseFloat(getComputedStyle(parent).borderTopWidth);
            let leftBorder = parseFloat(getComputedStyle(parent).borderLeftWidth);
            top += topBorder;
            left += leftBorder;
        }
        if(parent===document.body) return;
        fn(parent);
    })(ele);
    return {top,left};
}