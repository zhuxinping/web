class MyScroll{
    constructor(selector, options={}){
        this.eventQueue=[];

        function defaultValues(options, defaults){
            for(let name in defaults){
                if(typeof options[name]=='undefined'){
                    options[name]=defaults[name];
                }
            }
        }

        //处理默认参数
        defaultValues(options, {
            bounce: true,
            bounceTime: 600,
            scrollX: false,
            scrollY: true,
            freeScroll: false,
            startX: 0,
            startY: 0,
            directionLockThreshold: 5
        });

        //选出父级
        let aParent=Array.from(document.querySelectorAll(selector));

        aParent.forEach(parent=>{
            let child=parent.children[0];

            if(!child)return;

            //加事件
            child.addEventListener('touchstart', start, false);
            child.addEventListener('touchmove', move, false);
            child.addEventListener('touchend', end, false);

            let startX=0,startY=0;
            let disX=0,disY=0;
            let translateX=options.startX,translateY=options.startY;
            let dir='';
            let _this=this;
            let firstMove;

            child.style.transform=`translateX(${translateX}px) translateY(${translateY}px)`;

            function start(ev){
                startX=ev.targetTouches[0].clientX;
                startY=ev.targetTouches[0].clientY;

                disX=startX-translateX;
                disY=startY-translateY;

                dir='';

                //有没有用户监听
                _this.eventQueue.forEach(json=>{
                    if(json.type=='beforeScrollStart'){
                        json.fn();
                    }
                });

                firstMove=true;
            }

            function move(ev){
                if(firstMove){
                    firstMove=false;

                    _this.eventQueue.forEach(json=>{
                        if(json.type=='scrollStart'){
                            json.fn();
                        }
                    });
                }

                if(dir==''){
                    if(Math.abs(ev.targetTouches[0].clientX-startX)>=options.directionLockThreshold){
                        dir='x';
                    }

                    if(Math.abs(ev.targetTouches[0].clientY-startY)>=options.directionLockThreshold){
                        dir='y';
                    }
                }else{
                    if(options.freeScroll || dir=='x'){
                        translateX=ev.targetTouches[0].clientX-disX;
                    }

                    if(options.freeScroll || dir=='y'){
                        translateY=ev.targetTouches[0].clientY-disY;
                    }

                    if(options.bounce==false){
                        if(translateX>0){
                            translateX=0;
                        }
                        if(translateX<parent.offsetWidth-child.offsetWidth){
                            translateX=parent.offsetWidth-child.offsetWidth;
                        }

                        if(translateY>0){
                            translateY=0;
                        }
                        if(translateY<parent.offsetHeight-child.offsetHeight){
                            translateY=parent.offsetHeight-child.offsetHeight;
                        }
                    }

                    _this.x=translateX;
                    _this.y=translateY;

                    _this.eventQueue.forEach(json=>{
                        if(json.type=='scroll'){
                            json.fn();
                        }
                    });

                    child.style.transform=`translateX(${translateX}px) translateY(${translateY}px)`;
                }
            }

            function end(){
                if(translateX>0){
                    translateX=0;
                }
                if(translateX<parent.offsetWidth-child.offsetWidth){
                    translateX=parent.offsetWidth-child.offsetWidth;
                }

                if(translateY>0){
                    translateY=0;
                }
                if(translateY<parent.offsetHeight-child.offsetHeight){
                    translateY=parent.offsetHeight-child.offsetHeight;
                }

                child.style.transition=`${options.bounceTime}ms all ease`;
                child.style.transform=`translateX(${translateX}px) translateY(${translateY}px)`;

                child.addEventListener('transitionend', tend, false);
                function tend(){
                    child.style.transition='';
                    child.removeEventListener('transitionend', tend, false);

                    _this.eventQueue.forEach(json=>{
                        if(json.type=='scrollEnd'){
                            json.fn();
                        }
                    });
                }
            }
        });
    }

    on(name, fn){
        this.eventQueue.push({type: name, fn});
    }


    beforeScrollStart(fn){
        this.eventQueue.push({type: 'beforeScrollStart', fn});
    }
}
