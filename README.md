barrage
=======

html5弹幕
视频的类为video
弹幕的类为barrage
检测冲突为noconflict()
重新画为refresh()
弹幕进入画面为work()
出画面为clear()
commentsrun数组用来记录当前在屏幕中的所有弹幕
fps 为屏幕刷新率
maxcomments同屏幕中允许出现的可计算的不重叠的弹幕数
maxrandomtimes不重叠度的运算次数,超过此次数则随机摆放


barrage.js为弹幕类
main.js为调用类（此处为socket实时添加弹幕的调用示例)
