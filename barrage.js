//视频的类为video
    //弹幕的类为barrage
    //检测冲突为noconflict()
    //重新画为refresh()
    //弹幕进入画面为work()
    //出画面为clear()
    //commentsrun数组用来记录当前在屏幕中的所有弹幕
var fps=10;     //弹幕刷新率
var maxcomments=100;    //同屏幕中允许出现的可计算的不重叠的弹幕数
var maxrandomtimes=30;  //不重叠度的运算次数
var commentsrun=new Array();
var pausetag=0;
var mms=false;
var commentsrundata=function(){
    this.min;
    this.max;
    this.speed;
    this.isfree;
}
function barrage(videodiv,content,starttime,speed,fontsize,color,subtitle){
		this.videodiv=videodiv;	//记录video的div
        this.id;    //记录当前弹幕在commentsrun数组中的位置
        c = document.getElementById("comments");  
        cxt = c.getContext("2d");  
        if(speed)
            this.speed=parseInt(speed);   //移动速度
        else
            this.speed=10*$("#comments").width()/320*Math.pow(cxt.measureText(content).width,1/2);
        this.lastposition=this.initposition=$("#comments").width();    //开始位置
        if(fontsize)
            this.fontsize=fontsize;
        else
            this.fontsize=24;
        if(color)
            this.color=color;
        else
            this.color="white";
        this.content=content;
        this.starttime=starttime;
        if(subtitle==0)
            this.margintop;
        this.initposition;
        this.inited;
        this.posdecided;
        this.lastposition;
    }
    


barrage.prototype={
    constructor: barrage,
    init:function(){
        this.inited=0;
        this.posdecided=0;
        this.id=maxcomments;
    },
    resize:function(width){
        this.initposition=width;
        this.redecidepos();
        c = document.getElementById("comments");  
        cxt = c.getContext("2d");  
        this.speed=10*width/320*Math.pow(cxt.measureText(this.content).width,1/2);
    },
    redecidepos:function(){
        if(!mms)
            var postemp=this.initposition-this.speed*(this.videodiv.getPosition()-this.starttime);
        else
            var postemp=this.initposition-this.speed*(timeclick-this.starttime);
        if(postemp>=0&&postemp<this.initposition)
            this.lastposition=postemp;
        if(postemp>=this.initposition)
            this.lastposition=this.initposition;
        if(postemp<(-cxt.measureText(this.content).width)){
            this.lastposition=(-cxt.measureText(this.content).width);
        }
    },
    work:function(inited){
        var i=0;
        if(inited==0)
            this.margintop=this.noconflict();
        while(i<maxcomments&&commentsrun[i].isfree==0){
            i++;
        }
        if(i==maxcomments){
            ;
        }
        else{
            commentsrun[i].isfree=0;
            commentsrun[i].max=parseInt(this.margintop)+parseInt(this.fontsize);
            commentsrun[i].min=this.margintop;
            commentsrun[i].speed=this.speed;
            commentsrun[i].starttime=this.starttime;
            commentsrun[i].content=this.content;
            this.id=i;  //记录id
        }
    },
    free:function(){
        if(this.id!=maxcomments)
        {
            commentsrun[this.id].isfree=1;
        }
    },
    refresh:function(a){
        var margintop=this.margintop;
        var lasttime=0;
        var currenttime;
        var speed=this.speed;
        if(a==1)
        {
            if(!mms)
                var starttime=this.videodiv.getPosition();
            else
                var starttime=timeclick;
        }
        else
            var starttime=this.starttime;
        var content=this.content;
        var color=this.color;
        var fontsize=this.fontsize;
        var initposition=this.initposition;
    
        var video=this.videodiv;
        c = document.getElementById("comments");  
        cxt = c.getContext("2d");  
        cxt.fillStyle = color;  
        cxt.font = this.fontsize+"px 黑体";  
        cxt.textBaseline = "top"; 
        if(!mms)
            var currenttime=video.getPosition();
        else  
            var currenttime=timeclick;

        if((currenttime>=starttime)&&this.lastposition>=(-cxt.measureText(content).width))
        {
            if(this.inited==0){
                this.work(this.posdecided);
                this.inited=1;
                this.posdecided=1;
            }
            txt=content;
            var met = cxt.measureText(txt);
            //cxt.clearRect(speed*(lasttime-starttime)+initposition-1,margintop,met.width+2,parseInt(fontsize)*1.3);
            cxt.fillText(txt, -speed*fps/1000+this.lastposition, this.margintop); 
            if(pausetag!=1)
                this.lastposition=-speed*fps/1000+this.lastposition;
            //console.log(this.margintop);
            
        }

        else{
            if(this.inited==1){
                this.free();    //把当前弹幕是否在播放中置为空
                this.inited=0;
            }
        }
        lasttime=currenttime; 

        


    },
    noconflict:function(){
        var success=0;
        var randomtimes=0;
        var temp=0;
        while(success==0&&temp<($("#comments").height()-28)){
            
            for(i=0;i<maxcomments;i++){
                if(commentsrun[i].isfree==0){
                    if((temp>commentsrun[i].max+3)||(temp+parseInt(this.fontsize)+3<commentsrun[i].min)){
                        //不冲突
                    }
                    else
                    {
                        var width=$("#comments").width()+10;
                        
                        c = document.getElementById("comments");  
                        cxt = c.getContext("2d"); 
                        if(!mms)
                            var now=this.videodiv.getPosition();
                        else
                            var now=timeclick;
                        if(commentsrun[i].speed*(now-commentsrun[i].starttime)<cxt.measureText(commentsrun[i].content).width)    //已经重叠
                         {   
                            break;
                        }
                        if(!mms)
                            var now=this.videodiv.getPosition();
                        else
                            var now=timeclick;
                        var speed=parseInt(this.speed);
                        //console.log((width+cxt.measureText(commentsrun[i].content).width-(now-commentsrun[i].starttime)*commentsrun[i].speed));
                        if((this.speed>commentsrun[i].speed)&&((width/this.speed)<(width+cxt.measureText(commentsrun[i].content).width-(now-commentsrun[i].starttime)*commentsrun[i].speed)/commentsrun[i].speed))   //将会追上
                        {
                            break;
                        }

                    }
                }
            }
            if(i==maxcomments)
                success=1;
            temp=temp+this.fontsize-20;

        }
        if(temp>=($("#comments").height()-28)){
            temp=randomback(this.fontsize);
        }
        function randomback(fontsize){
            fontsize=parseInt(fontsize);
            min=0;
            max=$("#comments").height()-fontsize-5;
            return Math.floor(min+Math.random()*(max-min));
        }
        return temp;
    },
    createsubtitle:function(){
        var margintop;

         var lasttime=0;
         var currenttime;
         var speed=this.speed=0;
         var starttime=this.starttime;
         var content=this.content;
         var color=this.color;
         var fontsize=this.fontsize=14;
         var initposition=this.initposition;
         this.videodiv.on("timeupdate",function(){
            var video=this.videodiv;
            c = document.getElementById("comments");  
            cxt = c.getContext("2d");  
            cxt.fillStyle = color;  

            cxt.font = "normal "+fontsize+"px 微软雅黑";  
            cxt.textBaseline = "top"; 
            if(!mms)
                var currenttime=video.getPosition();
            else
                var currenttime=timeclick;
           var margintop=$("#comments").height()-28;
             if(Math.abs(currenttime-starttime)<0.1)
             {
                 txt=content;
                 var met = cxt.measureText(txt);
                 cxt.clearRect(0,margintop+1,$("#comments").width(),29);
                 cxt.fillText(txt,($("#comments").width()-met.width)/2, margintop); 
             }
            lasttime=currenttime; 
            

         }
        );
    
    }
}