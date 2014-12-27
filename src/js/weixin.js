// http://brucexiejunling.github.io/crossing-the-river/favicon.ico
// http://1.brucetse.sinaapp.com/favicon.ico
window.WeiXin = {
	imgUrl: 'http://1.brucetse.sinaapp.com/favicon.ico',
	lineLink: location.href,
	shareTitle: "[Banana版小黄人过河]重磅来袭! 更有趣更刺激! 原谅我不羁放纵爱自虐~",
	appid: ''
}

function shareFriend() {
  if(Q.currentScene === 'over') {
    WeiXin.shareTitle = '我在[Banana版小黄人过河]游戏中怒砍' + Q.points + '分! 6到没朋友! 不服来战!'
  } else {
    WeiXin.shareTitle = "[Banana版小黄人过河]重磅来袭! 更有趣更刺激! 原谅我不羁放纵爱自虐~"
  }
  WeixinJSBridge.invoke('sendAppMessage',{
    "appid": WeiXin.appid,
    "img_url": WeiXin.imgUrl,
    "img_width": "64",
    "img_height": "64",
    "link": WeiXin.lineLink,
    "desc": WeiXin.shareTitle,
    "title": 'Banana版小黄人过河'

  }, function(res) {

  })
}

function shareTimeline() {
  if(Q.currentScene === 'over') {
    WeiXin.shareTitle = '我在[Banana版小黄人过河]游戏中怒砍' + Q.points + '分! 6到没朋友! 不服来战!'
  } else {
    WeiXin.shareTitle = "[Banana版小黄人过河]重磅来袭! 更有趣更刺激! 原谅我不羁放纵爱自虐~"
  }

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
  if(Q.currentScene === 'over') {
    WeiXin.shareTitle = '我在[Banana版小黄人过河]游戏中怒砍' + Q.points + '分! 6到没朋友! 不服来战!'
  } else {
    WeiXin.shareTitle = "[Banana版小黄人过河]重磅来袭! 更有趣更刺激! 原谅我不羁放纵爱自虐~"
  }
  WeixinJSBridge.invoke('shareWeibo',{
    "content": WeiXin.shareTitle,
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