timeclick=0;
setInterval(function(){
    timeclick=timeclick+1;
},100);
var mms=true;
$(document).ready(function(){
    
    var srcj;
    var srch;
	$.ajax({
        url:"http://stu.fudan.edu.cn/rtmp/asp/findj.aspx",
        type:"post",
        async:false,
        success:function(data){
            console.log(data);
            srcj=data;
        }
    })
    $.ajax({
        url:"http://stu.fudan.edu.cn/rtmp/asp/findh.aspx",
        type:"post",
        async:false,
        success:function(data){
            console.log(data);
            srch=data;
        }
    })
    var bs={
        versions:function(){
           var u = navigator.userAgent, app = navigator.appVersion;
           return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
         }(),
         language:(navigator.browserLanguage || navigator.language).toLowerCase()
    } 
        if(bs.versions.android||bs.versions.iPhone||bs.versions.iPad||bs.versions.ios){
            if(!mms)
        	   $("#video-html5").attr("src",srch);
        }	
        else{
            if(!mms){
                var jwp1=jwplayer('myElement').setup({
                    //file: 'rtmp://test-distribute-1.mxzb.tv/multicast2/1c056891980a227ba6cdc013bbbb87f6.f4v',      //在此file:'rtmp://xxxxxxx', 
                    //file: 'rtmp://primary-distribute-2.mxzb.tv/multicast2/ff499592601490e0d6607b57b7079bba',
			 	file:srcj,
                    width: '512',
                    height: '384',
                    aspectratio: '4:3',
                    skin: "/live/content/css/skin.xml",                          
                    primary:'flash',
                    autostart:'true'
                });
            }
            else{
                $("#myElement").append($("#mmstemplate").html());
            }
            $("#video-html5").remove();
            var init=0;
            var lastpos=0;
            //alert($(".jwfullscreen button").length);
            resizecomments=function(decide){
                if(decide==1){
                    $("#comments")[0].width=$("#myElement").width();
                    $("#comments")[0].height=$("#myElement").height()-40;
                }
                else{
                    $("#comments")[0].width=initwidth;
                    $("#comments")[0].height=initheight-40;
                }
            }
            if(!mms){
                jwp1.onReady(function(){  //第一次onplay
                    if(init==0){
                        jwp1.onPause(function(){
                            pausetag=1;
                        })
                        jwp1.onPlay(function(){
                            pausetag=0;
                        })
                        jwp1.onTime(function(){
                            
                        })
                        $("#player").prepend("<canvas id='comments' style='position:absolute;z-index:1;cursor:pointer;'></canvas>");
                        
                        var bartimer=0;
                        var interval2=null;
                        initwidth=$("#myElement").width();
                        initheight=initwidth/4*3;
                        $("#comments")[0].width=initwidth;
                        $("#comments")[0].height=initheight-40;
    
                        socket=io.connect('http://10.73.4.41:9999');
			 		//socket=io.connect('http://stu.fudan.edu.cn/nodejs');
                       
                        $("#comments").click(function(){
                            if (jwp1.getState() != 'PLAYING') {  
                                jwp1.play(true); 
                            }
                            else
                                jwp1.play(false);
                        })
                        $("#comments").mousemove(function(){
                            $("#myElement_controlbar").css("opacity","1");
                            $("#myElement_controlbar").show();
                            bartimer=0;
                            if(interval2!=null){
                                clearInterval(interval2);
                            }
                            interval2=setInterval(function(){
                                if(bartimer==3){
                                    $("#myElement_controlbar").fadeOut();
                                    clearInterval(interval2);
                                }
                                bartimer=bartimer+1;
                            },1000);
                    
                        })
                        $(".jwfullscreen").click(function(){
    
                            $("#comments").css("left","0px");
                            $("#comments").css("top","0px");
                            for(var i=0;i<barrages.length;i++){
                                barrages[i].posdecided=0;
                            }
                            if(!$(this).hasClass("jwtoggle")){
                                resizecomments(0);
                                $("#comments").css("position","absolute");
                                $("#comments").css("z-index","1");
                                 for(var i=0;i<barrages.length;i++){
                                    barrages[i].resize(initwidth);
                                }
                                
                            }
                            else{
                                resizecomments(1);
                                $("#comments").css("position","fixed");
                                $("#comments").css("z-index","10000");
                                for(var i=0;i<barrages.length;i++){
                                    barrages[i].resize($("#myElement").width());
                                }
                            }
                        })
                        init=1;
                        var barrages=new Array();
                        var barragenum=0;
                        var interval1=null;
                        commentsrun=new Array();
                        for(var i=0;i<maxcomments;i++){
                            commentsrun[i]=new commentsrundata();
                            commentsrun[i].isfree=1;
                        }
                        socket.on('message', function (message) {  
                            if(!mms)
                                barrages[barragenum]=new barrage(jwp1,message,jwp1.getPosition(),null,null,null,0);
                            else
                                barrages[barragenum]=new barrage(jwp1,message,timeclick,null,null,null,0);
                            barrages[barragenum].init();
                            barragenum++;
                            if(interval1!=null)
                                clearInterval(interval1);
                            interval1=setInterval(function(){
                                c = document.getElementById("comments");  
                                cxt = c.getContext("2d");
                                cxt.clearRect(0,0,$("#comments").width(),$("#comments").height());
                                for(var i=0;i<barrages.length;i++){
                                    barrages[i].refresh();
                                }
                                if(!mms){
                                    $(".jwslider").onmouserup=function(){   //拖动滚动条重新定位
                                        for(var i=0;i<barrages.length;i++){
                                            barrages[i].redecidepos();
                                        }
                                    }
                                }
                                    //console.log(jwp1.getPosition());
                                if(!mms)
                                    lastpos=jwp1.getPosition();
                                else
                                    lastpos=timeclick;
                            },fps);
                       });
                    } 
                })
            }
            else{
                var barrages=new Array();
                 var barragenum=0;
                 var interval1=null;
                 commentsrun=new Array();
                 for(var i=0;i<maxcomments;i++){
                     commentsrun[i]=new commentsrundata();
                     commentsrun[i].isfree=1;
                 }
                 var iframeWin = document.createElement("iframe");
                 $("#player").prepend("<canvas id='comments' style='position:absolute;z-index:1;cursor:pointer;'></canvas>");
                initwidth=$("#myElement").width();
                 initheight=initwidth/4*3;
                 $("#comments")[0].width=initwidth;
                 $("#comments")[0].height=initheight-40;
                 socket=io.connect('http://10.73.4.41:9999');
                 socket.on('message', function (message) {  
                     if(!mms)
                         barrages[barragenum]=new barrage(jwp1,message,jwp1.getPosition(),null,null,null,0);
                     else
                         barrages[barragenum]=new barrage(jwp1,message,timeclick,null,null,null,0);
                     barrages[barragenum].init();
                     barragenum++;
                     if(interval1!=null)
                         clearInterval(interval1);
                     interval1=setInterval(function(){
                         c = document.getElementById("comments");  
                         cxt = c.getContext("2d");
                         cxt.clearRect(0,0,$("#comments").width(),$("#comments").height());
                         for(var i=0;i<barrages.length;i++){
                             barrages[i].refresh();
                         }
                         if(!mms){
                             $(".jwslider").onmouserup=function(){   //拖动滚动条重新定位
                                 for(var i=0;i<barrages.length;i++){
                                     barrages[i].redecidepos();
                                 }
                             }
                         }
                             //console.log(jwp1.getPosition());
                         if(!mms)
                             lastpos=jwp1.getPosition();
                         else
                             lastpos=timeclick;
                     },fps);
                });
            }

        }
    
    
    
    
    

    
	
    
    
    
    
    
    
    
    
    
    
    
    
    
	
})
    