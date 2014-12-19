window.WeiXin = {
	imgUrl: 'http://brucexiejunling.github.io/crossing-the-river/favicon.ico',
	lineLink: location.href,
	shareTitle: "[小黄人过河游戏], 想知道你有多6吗? 想自虐吗? 来挑战吧!",
	appid: ''
}

function shareFriend() {
  WeixinJSBridge.invoke('sendAppMessage',{
    "appid": WeiXin.appid,
    "img_url": WeiXin.imgUrl,
    "img_width": "64",
    "img_height": "64",
    "link": WeiXin.lineLink,
    "desc": WeiXin.shareTitle,
    "title": '小黄人过河'

  }, function(res) {

  })
}

function shareTimeline() {
  WeixinJSBridge.invoke('shareTimeline',{
    "img_url": WeiXin.imgUrl,
    "img_width": "64",
    "img_height": "64",
    "link": WeiXin.lineLink,
    "desc": '',
    "title": WeiXin.shareTitle
  }, function(res) {

  });
}

function shareWeibo() {
  WeixinJSBridge.invoke('shareWeibo',{
    "content": WeiXin.descContent,
    "url": WeiXin.lineLink,
  }, function(res) {

  });
}

function onBridgeReady() {
  // 发送给好友
  WeixinJSBridge.on('menu:share:appmessage', shareFriend)
    // 分享到朋友圈
  WeixinJSBridge.on('menu:share:timeline', shareTimeline)
    // 分享到微博
  WeixinJSBridge.on('menu:share:weibo', shareWeibo)

}

if(document.addEventListener) {
  document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
} else if(document.attachEvent) {
  document.addEventListener('WeixinJSBridgeReady', onBridgeReady);
  document.addEventListener('onWeixinJSBridgeReady', onBridgeReady);
}