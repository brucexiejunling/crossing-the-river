function shareFriend(){WeiXin.shareTitle="over"===Q.currentScene?"我在[Banana版小黄人过河]游戏中怒砍"+Q.points+"分! 6到没朋友! 不服来战!":"[Banana版小黄人过河]重磅来袭! 更有趣更刺激! 原谅我不羁放纵爱自虐~",WeixinJSBridge.invoke("sendAppMessage",{appid:WeiXin.appid,img_url:WeiXin.imgUrl,img_width:"64",img_height:"64",link:WeiXin.lineLink,desc:WeiXin.shareTitle,title:"Banana版小黄人过河"},function(){})}function shareTimeline(){WeiXin.shareTitle="over"===Q.currentScene?"我在[Banana版小黄人过河]游戏中怒砍"+Q.points+"分! 6到没朋友! 不服来战!":"[Banana版小黄人过河]重磅来袭! 更有趣更刺激! 原谅我不羁放纵爱自虐~",WeixinJSBridge.invoke("shareTimeline",{img_url:WeiXin.imgUrl,img_width:"64",img_height:"64",link:WeiXin.lineLink,desc:"",title:WeiXin.shareTitle},function(){})}function shareWeibo(){WeiXin.shareTitle="over"===Q.currentScene?"我在[Banana版小黄人过河]游戏中怒砍"+Q.points+"分! 6到没朋友! 不服来战!":"[Banana版小黄人过河]重磅来袭! 更有趣更刺激! 原谅我不羁放纵爱自虐~",WeixinJSBridge.invoke("shareWeibo",{content:WeiXin.shareTitle,url:WeiXin.lineLink},function(){})}function onBridgeReady(){WeixinJSBridge.on("menu:share:appmessage",shareFriend),WeixinJSBridge.on("menu:share:timeline",shareTimeline),WeixinJSBridge.on("menu:share:weibo",shareWeibo)}window.WeiXin={imgUrl:"http://1.brucetse.sinaapp.com/favicon.ico",lineLink:location.href,shareTitle:"[Banana版小黄人过河]重磅来袭! 更有趣更刺激! 原谅我不羁放纵爱自虐~",appid:""},document.addEventListener?document.addEventListener("WeixinJSBridgeReady",onBridgeReady,!1):document.attachEvent&&(document.addEventListener("WeixinJSBridgeReady",onBridgeReady),document.addEventListener("onWeixinJSBridgeReady",onBridgeReady));
!function(){var a=!1,b=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){},Class.extend=function(c){function d(){!a&&this.init&&this.init.apply(this,arguments)}var e=this.prototype;a=!0;var f=new this;a=!1;for(var g in c)f[g]="function"==typeof c[g]&&"function"==typeof e[g]&&b.test(c[g])?function(a,b){return function(){var c=this._super;this._super=e[a];var d=b.apply(this,arguments);return this._super=c,d}}(g,c[g]):c[g];return d.prototype=f,d.prototype.constructor=d,d.extend=arguments.callee,d}}(),function(){for(var a=0,b=["ms","moz","webkit","o"],c=0;c<b.length&&!window.requestAnimationFrame;++c)window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(b){var c=(new Date).getTime(),d=Math.max(0,16-(c-a)),e=window.setTimeout(function(){b(c+d)},d);return a=c+d,e}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)})}();var Quintus=function(a){var b={};return b.options={imagePath:"images/",audioPath:"audios/",dataPath:"data/",audioSupported:["mp3","ogg"],sound:!0},a&&_(b.options).extend(a),b._normalizeArg=function(a){return _.isString(a)&&(a=a.replace(/\s+/g,"").split(",")),_.isArray(a)||(a=[a]),a},b.extend=function(a){return _(b).extend(a),b},b.include=function(a){return _.each(b._normalizeArg(a),function(a){(a=Quintus[a]||a)(b)}),b},b.gameLoop=function(a){b.lastGameLoopFrame=(new Date).getTime(),b.gameLoopCallbackWrapper=function(c){b.loop=requestAnimationFrame(b.gameLoopCallbackWrapper);var d=c-b.lastGameLoopFrame,e=16.7;if(d>16.7)for(;d>16.7;)d-=e,a.call(b,e/1e3);else a.call(b,d/1e3);b.lastGameLoopFrame=c},requestAnimationFrame(b.gameLoopCallbackWrapper)},b.pauseGame=function(){b.loop&&cancelAnimationFrame(b.loop),b.loop=null},b.unpauseGame=function(){b.loop||(b.lastGameLoopFrame=(new Date).getTime(),b.loop=requestAnimationFrame(b.gameLoopCallbackWrapper))},b.Evented=Class.extend({bind:function(a,b,c){c||(c=b,b=null),_.isString(c)&&(c=b[c]),this.listeners=this.listeners||{},this.listeners[a]=this.listeners[a]||[],this.listeners[a].push([b||this,c]),b&&(b.binds||(b.binds=[]),b.binds.push([this,a,c]))},trigger:function(a,b){if(this.listeners&&this.listeners[a])for(var c=0,d=this.listeners[a].length;d>c;c++){var e=this.listeners[a][c];e[1].call(e[0],b)}},unbind:function(a,b,c){if(b){var d=this.listeners&&this.listeners[a];if(d)for(var e=d.length-1;e>=0;e--)d[e][0]==b&&(c&&c!=d[e][1]||this.listeners[a].splice(e,1))}else this.listeners[a]&&delete this.listeners[a]},debind:function(){if(this.binds)for(var a=0,b=this.binds.length;b>a;a++){var c=this.binds[a],d=c[0],e=c[1];d.unbind(e,this)}}}),b.components={},b.register=function(a,c){c.name=a,b.components[a]=b.Component.extend(c)},b.Component=b.Evented.extend({init:function(a){this.entity=a,this.extend&&_.extend(a,this.extend),a[this.name]=this,a.activeComponents.push(this.name),this.added&&this.added()},destroy:function(){if(this.extend)for(var a=_.keys(this.extend),b=0,c=a.length;c>b;b++)delete this.entity[a[b]];delete this.entity[this.name];var d=this.entity.activeComponents.indexOf(this.name);-1!=d&&this.entity.activeComponents.splice(d,1),this.debind(),this.destroyed&&this.destroyed()}}),b.GameObject=b.Evented.extend({has:function(a){return this[a]?!0:!1},add:function(a){a=b._normalizeArg(a),this.activeComponents||(this.activeComponents=[]);for(var c=0,d=a.length;d>c;c++){var e=a[c],f=b.components[e];if(!this.has(e)&&f){var g=new f(this);this.trigger("addComponent",g)}}return this},del:function(a){a=b._normalizeArg(a);for(var c=0,d=a.length;d>c;c++){var e=a[c];e&&this.has(e)&&(this.trigger("delComponent",this[e]),this[e].destroy())}return this},destroy:function(){this.destroyed||(this.debind(),this.parent&&this.parent.remove&&this.parent.remove(this),this.trigger("removed"),this.destroyed=!0)}}),b.setup=function(a,c){var d="ontouchstart"in document;c=c||{},a=a||"quintus",b.el=$(_.isString(a)?"#"+a:a),0===b.el.length&&(b.el=$("<canvas width='320' height='420'></canvas>").attr("id",a).appendTo("body"));var e=c.maxWidth||5e3,f=c.maxHeight||5e3,g=c.resampleWidth,h=c.resampleHeight;if(c.maximize){$("html, body").css({padding:0,margin:0});var i=Math.min(window.innerWidth,e),j=Math.min(window.innerHeight-5,f);d&&(b.el.css({height:2*j}),window.scrollTo(0,1),i=Math.min(window.innerWidth,e),j=Math.min(window.innerHeight-5,f)),b.el.css({width:i,height:j}).attr((g&&i>g||h&&j>h)&&d?{width:i/2,height:j/2}:{width:i,height:j})}return b.wrapper=b.el.wrap("<div id='"+a+"_container'/>").parent().css({width:b.el.width(),margin:"0 auto"}),b.el.css("position","relative"),b.ctx=b.el[0].getContext&&b.el[0].getContext("2d"),d&&window.scrollTo(0,1),b.width=parseInt(b.el.attr("width"),10),b.height=parseInt(b.el.attr("height"),10),$(window).bind("orientationchange",function(){setTimeout(function(){window.scrollTo(0,1)},0)}),b},b.clear=function(){b.ctx.clearRect(0,0,b.el[0].width,b.el[0].height)},b.assetTypes={png:"Image",jpg:"Image",gif:"Image",jpeg:"Image",ogg:"Audio",wav:"Audio",m4a:"Audio",mp3:"Audio"},b.assetType=function(a){var c=_(a.split(".")).last().toLowerCase();return b.assetTypes[c]||"Other"},b.loadAssetImage=function(a,c,d,e){var f=new Image;$(f).on("load",function(){d(a,f)}),$(f).on("error",e),f.src=b.options.imagePath+c},b.audioMimeTypes={mp3:"audio/mpeg",ogg:'audio/ogg; codecs="vorbis"',m4a:"audio/m4a",wav:"audio/wav"},b.loadAssetAudio=function(a,c,d,e){var f=b._removeExtension(c);if(!document.createElement("audio").play||!b.options.sound)return void d(f,null);if(b.assets[f])return void d(f,b.assets[f]);b.assets[f]={};var g=new Audio,h=null;return(h=_(b.options.audioSupported).detect(function(a){return g.canPlayType(b.audioMimeTypes[a])?a:null}))?($(g).on("error",e),$(g).on("canplaythrough",function(){d(f,g)}),g.src=b.options.audioPath+f+"."+h,g.load(),g):void d(f,null)},b.loadAssetOther=function(a,c,d,e){$.get(b.options.dataPath+c,function(b){d(a,b)}).fail(e)},b._removeExtension=function(a){return a.replace(/\.(\w{3,4})$/,"")},b.assets={},b.asset=function(a){return b.assets[a]},b.load=function(a,c,d){var e={};d||(d={});var f=d.progressCallback,g=!1,h=function(a){g=!0,(d.errorCallback||function(a){alert("Error Loading: "+a)})(a)};_.isArray(a)?_.each(a,function(a){_.isObject(a)?_.extend(e,a):e[a]=a}):_.isString(a)?e[a]=a:e=a;var i=_(e).keys().length,j=i;f&&f(j,i);var k=function(a,d){g||(b.assets[a]=d,j--,f&&f(i-j,i),0===j&&c&&c.apply(b))};_.each(e,function(a,c){var d=b.assetType(a);b.assets[c]?k(c,b.assets[c]):b["loadAsset"+d](c,a,k,function(){h(a)})})},b.preloads=[],b.preload=function(a,c){_(a).isFunction()?(b.load(_(b.preloads).uniq(),a,c),b.preloads=[]):b.preloads=b.preloads.concat(a)},b};
Quintus.Sprites=function(a){return a.SpriteSheet=Class.extend({init:function(b,c,d){_.extend(this,{name:b,asset:c,w:a.asset(c).width,h:a.asset(c).height,sw:40,sh:55,sx:0,sy:0},d),this.cols=this.cols||Math.floor(this.w/this.sw)},fx:function(a){return a%this.cols*this.sw+this.sx},fy:function(a){return Math.floor(a/this.cols)*this.sh+this.sy},draw:function(b,c,d,e){b||(b=a.ctx),b.drawImage(a.asset(this.asset),this.fx(e),this.fy(e),this.sw,this.sh,Math.floor(c),Math.floor(d),this.dw,this.dh)}}),a.sheets={},a.sheet=function(b,c,d){return c?void(a.sheets[b]=new a.SpriteSheet(b,c,d)):a.sheets[b]},a.compileSheets=function(b,c){var d=a.asset(c);_(d).each(function(c,d){a.sheet(d,b,c)})},a.Sprite=a.GameObject.extend({init:function(a){this.p=_({x:0,y:0,z:0,frame:0,type:0}).extend(a||{}),this.p.w&&this.p.h||(this.asset()?(this.p.w=this.p.w||this.asset().width,this.p.h=this.p.h||this.asset().height):this.sheet()&&(this.p.w=this.p.w||this.sheet().dw,this.p.h=this.p.h||this.sheet().dh)),this.p.id=this.p.id||_.uniqueId()},asset:function(){return a.asset(this.p.asset)},sheet:function(){return a.sheet(this.p.sheet)},draw:function(b){b||(b=a.ctx);var c=this.p;c.sheet?this.sheet().draw(b,c.x,c.y,c.frame):c.asset&&b.drawImage(a.asset(c.asset),Math.floor(c.x),Math.floor(c.y)),this.trigger("draw",b)},step:function(a){this.trigger("step",a)}}),a.Rectangle=a.GameObject.extend({init:function(a){this.p=_({x:0,y:0,w:0,h:0,color:"#000"}).extend(a||{}),this.p.id=this.p.id||_.uniqueId()},draw:function(b){b||(b=a.ctx);var c=this.p;b.fillStyle=c.color,b.fillRect(c.x,c.y,c.w,c.h),this.trigger("draw",b)},step:function(a){this.trigger("step",a)}}),a};
Quintus.Scenes=function(a){a.scenes={},a.stages=[],a.Scene=Class.extend({init:function(a,b){this.opts=b||{},this.sceneFunc=a}}),a.scene=function(b,c){return c?(a.scenes[b]=c,c):a.scenes[b]},a.Stage=a.GameObject.extend({defaults:{sort:!0},init:function(a){this.scene=a,this.items=[],this.index={},this.removeList=[],a&&(this.options=_(this.defaults).clone(),_(this.options).extend(a.opts),a.sceneFunc(this)),this.options.sort&&!_.isFunction(this.options.sort)&&(this.options.sort=function(a,b){return a.p.z-b.p.z})},each:function(a){for(var b=0,c=this.items.length;c>b;b++)a.call(this.items[b],arguments[1],arguments[2])},eachInvoke:function(a){for(var b=0,c=this.items.length;c>b;b++)this.items[b][a].call(this.items[b],arguments[1],arguments[2])},insert:function(a){return this.items.push(a),a.parent=this,a.p&&(this.index[a.p.id]=a),this.trigger("inserted",a),a.trigger("inserted",this),a},remove:function(a){this.removeList.push(a)},forceRemove:function(a){var b=_(this.items).indexOf(a);-1!=b&&(this.items.splice(b,1),a.destroy&&a.destroy(),a.p.id&&delete this.index[a.p.id],this.trigger("removed",a))},pause:function(){this.paused=!0},unpause:function(){this.paused=!1},step:function(a){if(this.paused)return!1;if(this.trigger("prestep",a),this.eachInvoke("step",a),this.trigger("step",a),this.removeList.length>0){for(var b=0,c=this.removeList.length;c>b;b++)this.forceRemove(this.removeList[b]);this.removeList.length=0}},draw:function(a){this.options.sort&&this.items.sort(this.options.sort),this.trigger("predraw",a),this.eachInvoke("draw",a),this.trigger("draw",a)}}),a.activeStage=0,a.stage=function(b){return b=void 0===b?a.activeStage:b,a.stages[b]},a.stageScene=function(b,c,d){d=d||a.Stage,_(b).isString()&&(b=a.scene(b)),c=c||0,a.stages[c]&&a.stages[c].destroy(),a.stages[c]=new d(b),a.loop||a.gameLoop(a.stageGameLoop)},a.stageGameLoop=function(b){a.ctx&&a.clear();var c,d,e=a.backgrounds[a.bgIndex];e.w*a.height/a.width<=e.h?(c=e.w,d=e.w*a.height/a.width):(d=e.h,c=d*a.width/a.height),a.ctx.drawImage(a.asset("background.jpg"),e.x+e.w-c,e.y+e.h-d,c,d,0,0,a.width,a.height);for(var f=0,g=a.stages.length;g>f;f++){a.activeStage=f;var h=a.stage();h&&(h.step(b),h.draw(a.ctx))}a.activeStage=0}};
Quintus.Screen=function(a){return a.buttons=[],a.Screen=a.GameObject.extend({init:function(b){this.p=_.extend({images:[],titles:[],buttons:[]},b||{}),_.each(this.p.buttons,function(b){a.buttons.push({name:b.name,width:b.dy,height:b.dh,x:b.dx,y:b.dy})})},step:function(){},draw:function(b){b||(b=a.ctx);var c=this.p;_.each(c.images,function(a){b.drawImage(a.asset,a.sx,a.sy,a.sw,a.sh,a.dx,a.dy,a.dw,a.dh)}),b.textAlign="center",_.each(c.titles,function(c){b.fillStyle=c.style,b.font=c.font,"instruction"===c.type?0===a.points&&b.fillText(c.text,c.x,c.y):b.fillText(c.text,c.x,c.y)}),_.each(c.buttons,function(a){b.drawImage(a.asset,a.sx,a.sy,a.sw,a.sh,a.dx,a.dy,a.dw,a.dh)})}}),a};
$(function(){function a(){u.el.on("touchstart mousedown",function(a){var c=a.originalEvent,d=!0,e=!!("ontouchstart"in window);if(e){var f=c.touches;for(i=0,len=f.length;i<len;i++){var g=f[i],h=b(g);if(h.x>=u.width/2-25&&h.x<=u.width/2+25&&h.y>=u.height-50&&h.y<=u.height&&u.bananas>=u.bananaLevel){d=!1;break}}}d&&!u.useBanana&&u.stage().trigger("press-down"),c.preventDefault()}),u.el.on("touchend touchcancel mouseup",function(a){c(a.originalEvent),a.preventDefault(),u.useBanana||u.stage().trigger("press-up"),u.man&&u.man.trigger("press-up")})}function b(a){var b=u.el,c=a.pageX,d=a.pageY,e=b.offset(),f=(b.attr("width")||u.width)*(c-e.left)/b.width(),g=(b.attr("height")||u.height)*(d-e.top)/b.height();return{x:f,y:g}}function c(a){var c=!!("ontouchstart"in window);if(c)for(touches=a.changedTouches,i=0,len=touches.length;i<len;i++){var d=touches[i],e=b(d),f=!1;if(e.x>=u.width/2-25&&e.x<=u.width/2+25&&e.y>=u.height-50&&e.y<=u.height&&!u.useBanana&&u.bananas>=u.bananaLevel&&!u.bridgeScale&&!u.manMove&&!u.bankMove){u.useBanana=!0,u.bananas-=u.bananaLevel,u.bananaLevel<5&&u.bananaLevel++,u.skillTips=!0,u.stage().trigger("use-banana"),$("#big-banana").css("display","block").addClass("fadeInAndOut"),setTimeout(function(){$("#big-banana").css("display","none").removeClass("fadeInAndOut")},600),g("banana1");break}if(_.each(u.buttons,function(a){e.x>=a.x&&e.x<=a.x+a.width&&e.y>a.y&&e.y<=a.y+a.height&&(f=!0,u.stage().trigger(a.name))}),f)break}else{var e=b(a);_.each(u.buttons,function(a){e.x>=a.x&&e.x<=a.x+a.width&&e.y>a.y&&e.y<=a.y+a.height&&(f=!0,u.stage().trigger(a.name))})}}function d(){$("#bonus").css("display","block").addClass("fadeInAndOut"),u.points++,setTimeout(function(){$("#bonus").css("display","none").removeClass("fadeInAndOut")},600)}function e(){$("#share-text").text('" '+WeiXin.shareTitle+' "'),$("#mask").css({display:"block",width:window.innerWidth,height:window.innerHeight}),$("#return").on("mouseup touchend",f)}function f(a){a.preventDefault(),$("#mask").css("display","none").off("mouseup touchend",f)}function g(a){u.assets[a]&&u.assets[a].play&&(u.assets[a].currentTime=0,u.assets[a].volume=1,u.assets[a].play())}function h(){g("banana3"),u.manMove=!1,u.bankMove=!1,u.useBanana=!1,u.skillTips=!1,u.bananaLevel=2,u.el.addClass("bounce"),setTimeout(function(){u.el.removeClass("bounce"),u.stageScene("over")},1200)}function j(){var a=.25+.02*Math.sqrt(u.points);return a>.4&&(a=.4),a}function k(){return Math.abs(.3*Math.sin(.2*u.points+Math.PI/2))+.2}function l(){return 1-j()-k()}function m(){var a=[{type:"s",p:j()},{type:"m",p:k()},{type:"l",p:l()}];a.sort(function(a,b){return a.p>b.p});var b,c=Math.random();return b=c<a[0].p?v[a[0].type]:c>=a[0].p&&c<a[0].p+a[1].p?v[a[1].type]:v[a[2].type],b[Math.floor(Math.random()*b.length)]}function n(){var a=!1,b=$("body");u.backgrounds=[{x:0,y:0,w:400,h:535,style:"#FFF1F1"},{x:405,y:0,w:400,h:535,style:"#3D89FD"},{x:810,y:0,w:400,h:535,style:"#C7F0FF"}],u.bgIndex=2,u.compileSheets("sprites.png","sprites.json"),u.scene("game",new u.Scene(function(c){u.currentScene="game",a?(u.bgIndex=(u.bgIndex+1)%3,b.css("background",u.backgrounds[u.bgIndex].style)):a=!0,u.bananas=0;var d=new u.Screen({titles:[{text:"按住屏幕使棍子变长, 搭中红点+1分",type:"instruction",style:"#000",font:'normal 18px "微软雅黑" Arial',x:u.width/2,y:u.height/2-u.height/4}]}),e=new u.Bank({type:"left",x:0,w:60}),f=Math.max(50,Math.floor(90*Math.random()));u.gap=Math.max(s,Math.floor(Math.random()*(u.width-e.p.w-e.p.x-f)));var g=new u.Bank({x:e.p.x+e.p.w+u.gap,w:f,type:"right"});u.leftBank=e,u.rightBank=g;var h=new u.BonusPoint({x:Math.random()*(g.p.w-8)+g.p.x,bank:g}),i=new u.Bridge({x:e.p.w+e.p.x-o,lBank:e,rBank:g,bonusPoint:h});if(u.gap>25){var j=new u.Banana({x:e.p.x+e.p.w+Math.random()*(u.gap-25)});u.banana=j,c.insert(j)}c.insert(d),c.insert(e),c.insert(g),c.insert(h),c.insert(i),c.insert(new u.Banana({x:u.width/2-20,y:u.height-40,z:2,w:40,h:30,sheet:"banana2"})),u.man=new u.Man({x:e.p.w+e.p.x-20,y:u.height-p-27,frame:0}),c.insert(u.man),c.insert(new u.GamePoints);var k;c.bind("build-bank",function(){var a=m();a>=60?(u.gap=Math.max(s,Math.floor(Math.random()*(u.width-e.p.w-e.p.x))),u.gap=Math.min(u.gap,u.width-e.p.w-e.p.x-a)):u.gap=Math.max(s,Math.floor(Math.random()*(u.width-e.p.w-e.p.x-a))),k=new u.Bank({x:g.p.x+g.p.w+u.gap,w:a,type:"right"}),c.insert(k),u.leftBank=u.rightBank,u.rightBank=k}),c.bind("bank-move-stop",function(){e=g,e.setType("left"),g=k,h=new u.BonusPoint({x:Math.random()*(g.p.w-8)+g.p.x,bank:g});var a=g.p.x-e.p.x-e.p.w;if(a>25&&Math.random()<=.6){var b=new u.Banana({x:e.p.x+e.p.w+Math.random()*(a-25)});u.banana=b,c.insert(b)}i=new u.Bridge({x:e.p.w+e.p.x-o,lBank:e,rBank:g,bonusPoint:h}),c.insert(i),c.insert(h)}),c.bind("press-down",function(){u.down=!0,u.up=!1}),c.bind("press-up",function(){u.down=!1,u.up=!0}),c.bind("use-banana",function(){i&&i.destroy&&i.destroy(),i=new u.Bridge({x:e.p.w+e.p.x,z:0,w:g.p.x-e.p.x-e.p.w,h:3,type:"banana-bridge",color:"#E9FF22",lBank:e,rBank:g}),this.insert(i),u.moveToX=g.p.w+g.p.x,u.pass=!0,u.manMove=!0})})),u.scene("start",new u.Scene(function(a){u.currentScene="start";var b=new u.Screen({titles:[{text:"Author: bruceTse. Inspired by [Stick Hero]",style:"#444",font:'normal 14px "微软雅黑" Arial',x:u.width/2,y:u.height-10}],images:[{asset:u.asset("sprites.png"),sx:10,sy:60,sw:225,sh:175,dx:u.width/2-108,dy:20,dw:225,dh:175}],buttons:[{asset:u.asset("sprites.png"),name:"start-instruction",sx:236,sy:242,sw:188,sh:40,dx:u.width/2-94,dy:225,dw:188,dh:41},{asset:u.asset("sprites.png"),name:"start",sx:236,sy:60,sw:188,sh:41,dx:u.width/2-94,dy:275,dw:188,dh:41},{asset:u.asset("sprites.png"),name:"share",sx:236,sy:108,sw:188,sh:40,dx:u.width/2-94,dy:335,dw:188,dh:40}]});a.insert(b),a.bind("start-instruction",function(){var a=$("#instruction");a.css({top:u.height/2-a.height()/2}).fadeIn()}),a.bind("share",function(){WeiXin.shareTitle="[Banana版小黄人过河]重磅来袭! 更有趣更刺激! 原谅我不羁放纵爱自虐~",e()}),a.bind("start",function(){u.stageScene("game")})})),u.scene("over",new u.Scene(function(a){u.currentScene="over";var b=new u.Screen({titles:[{text:"no zuo no die",style:"#000",font:'bold 40px "微软雅黑" Arial',x:u.width/2,y:100},{text:"分数: "+u.points,style:"#000",font:'bold 40px "微软雅黑" Arial',x:u.width/2,y:150},{text:"Author: bruceTse. Inspired by [Stick Hero]",style:"#444",font:'normal 14px "微软雅黑" Arial',x:u.width/2,y:u.height-10}],buttons:[{asset:u.asset("sprites.png"),name:"replay",sx:236,sy:152,sw:188,sh:40,dx:u.width/2-94,dy:200,dw:188,dh:40},{asset:u.asset("sprites.png"),name:"show",sx:236,sy:198,sw:188,sh:40,dx:u.width/2-94,dy:270,dw:188,dh:40},{asset:u.asset("sprites.png"),name:"over-instruction",sx:236,sy:242,sw:188,sh:40,dx:u.width/2-94,dy:340,dw:188,dh:41}]});a.insert(b),a.bind("replay",function(){u.stageScene("game")}),a.bind("show",function(){WeiXin.shareTitle="我在[Banana版小黄人过河]游戏中怒砍"+u.points+"分! 6到没朋友! 不服来战!",e()}),a.bind("over-instruction",function(){var a=$("#instruction");a.css({top:u.height/2-a.height()/2}).fadeIn()})})),u.stageScene("start")}$("#confirm").on("touchend mouseup",function(a){a.preventDefault(),a.stopPropagation(),$("#instruction").fadeOut(200)});var o=3,p=180,q=60,r=10,s=15,t=500,u=window.Q=Quintus().include("Sprites, Scenes, Screen").setup("",{maximize:!0}),v={s:[15,20,25],m:[30,35,40,45,50,55],l:[60,70,80,90]};a(),u.points=0,u.bananas=0,u.delay=.3,u.bananaLevel=2,u.Bridge=u.Rectangle.extend({init:function(a){u.bridgeScale=!1,this._super(_.extend({w:o,y:u.height-p,z:3,speed:320,ang:0,waitTime:0,scaling:!1,scaled:!1,rotating:!1,rotated:!1,moved:!1},a||{}))},step:function(a){var b=this.p;"banana-bridge"!==b.type&&(u.bankMove||u.manMove||!u.down||b.scaled||b.rotated||(u.bridgeScale=!0,b.scaling=!0,b.h+=b.speed*a,b.y-=b.speed*a),u.up&&b.scaling&&(b.scaling=!1,b.scaled=!0),u.up&&b.scaled&&b.waitTime<u.delay&&(b.waitTime+=a),u.up&&b.rotated&&!b.moved&&(u.manMove=!0,b.moved=!0,u.pass=!1,b.w+b.x>b.bonusPoint.p.x&&b.w+b.x<b.bonusPoint.p.x+b.bonusPoint.p.w&&(g("bonus"),d(),b.bonusPoint.destroy()),b.w+b.x>b.rBank.p.x&&b.w+b.x<b.rBank.p.w+b.rBank.p.x?(u.moveToX=b.rBank.p.w+b.rBank.p.x,u.pass=!0):(b.w+b.x<=b.rBank.p.x||b.w+b.x>=b.rBank.p.w+b.rBank.p.x)&&(u.moveToX=b.lBank.p.w+b.lBank.p.x+b.w+20,u.pass=!1))),u.bankMove&&(b.rotated||"banana-bridge"===b.type)&&b.x+b.w>0?b.x-=t*a:u.bankMove&&(b.rotated||"banana-bridge"===b.type)&&this.destroy(),u.pass&&(b.moved||"banana-bridge"===b.type)&&!u.manMove&&b.x+b.w<b.rBank.p.x&&(b.x=b.rBank.p.x-b.w+5)},draw:function(a){a||(a=u.ctx);var b=this.p;if("banana-bridge"!==b.type)if(b.waitTime>=u.delay)if(u.up&&b.scaled&&!b.rotated&&(b.rotating=!0,b.ang+=5,a.save(),a.translate(b.x+o,u.height-p),a.rotate(b.ang*Math.PI/180),a.translate(-b.x-o,p-u.height),a.fillStyle=b.color,a.fillRect(b.x,b.y,b.w,b.h),a.restore()),90!==b.ang||b.rotated)b.rotated&&this._super(a);else{b.rotated=!0,b.rotating=!1;var c=b.h;b.x=b.lBank.p.x+b.lBank.p.w,b.h=b.w,b.w=c,b.y=u.height-p-b.h/3,this._super(a)}else this._super(a);else this._super(a)}}),u.Bank=u.Rectangle.extend({init:function(a){this._super(_.extend({x:0,y:u.height-p,z:1,w:r,h:p,type:""},a||{}))},step:function(a){var b=this.p;u.bankMove&&("right"===b.type?b.x+b.w>q?b.x-=t*a:(u.bankMove=!1,u.stage().trigger("bank-move-stop")):u.bankMove&&(b.x-=t*a),b.x+b.w<=0&&this.destroy())},setType:function(a){this.p.type=a}}),u.Banana=u.Sprite.extend({init:function(a){this._super(_.extend({sheet:"banana1",y:u.height-p+3,z:1,w:20,h:15,r:1,k:1},a))},step:function(a){"banana1"===this.p.sheet?(u.bankMove&&(this.p.x-=t*a),this.p.x+this.p.w<0&&this.destroy()):u.bananas>=u.bananaLevel&&(this.p.r+=.005*this.p.k,this.p.r>=1.1&&(this.p.k=-1),this.p.r<=1&&(this.p.k=1))},draw:function(a){a||(a=u.ctx),"banana1"===this.p.sheet?this._super(a):u.bananas>=u.bananaLevel?(a.save(),u.skillTips||(a.fillStyle="#000",a.textAlign="center",a.font="normal 18px '微软雅黑' Arial",a.fillText("点击闪动的香蕉有惊喜噢",u.width/2,u.height/2-u.height/8)),a.drawImage(u.asset("sprites.png"),5,240,60,45,this.p.x,this.p.y,this.p.w*this.p.r,this.p.h*this.p.r),a.restore()):this._super(a)}}),u.BonusPoint=u.Rectangle.extend({init:function(a){this._super(_.extend({y:u.height-p,z:2,w:8,h:5,color:"#D21414"},a||{}))},step:function(a){var b=this.p;u.bankMove&&(b.x-=t*a),b.x<b.bank.p.x&&(b.x=b.bank.p.x+1),b.x+b.w>b.bank.p.x+b.bank.p.w&&(b.x=b.bank.p.x+b.bank.p.w-b.w),b.x+b.w<=0&&this.destroy()}}),u.Man=u.Sprite.extend({init:function(a){this._super(_(a).extend({sheet:"man",speed:180,frameCount:0,z:4,headStand:!1,waitTime:0,fall:!1}));var b=this.p;this.bind("press-up",function(){u.manMove&&b.waitTime>u.delay&&(b.x>u.leftBank.p.x&&b.x+b.w/2<u.rightBank.p.x||b.x>u.rightBank.p.x+u.rightBank.p.w)&&!b.fall&&(u.headStandTips=!0,b.headStand=!b.headStand)})},step:function(a){var b=this.p;u.down||u.manMove?u.manMove||(b.frameCount=(b.frameCount+1)%13,b.frame=Math.floor(b.frameCount/4)):b.frame=0,u.bankMove&&!u.manMove&&b.x+20>q&&(b.x-=t*a),u.manMove&&(b.waitTime>=u.delay?(b.frameCount=(b.frameCount+1)%21,b.frame=4+Math.floor(b.frameCount/4),b.headStand&&u.banana&&!(b.x+b.w/2<=u.banana.p.x||b.x>u.banana.p.x+u.banana.p.w)&&(u.bananas++,u.banana.destroy(),u.banana=null),b.x+20<u.moveToX&&b.x<u.width?b.headStand?b.x>u.leftBank.p.x&&b.x+b.w/2<u.rightBank.p.x||b.x>u.rightBank.p.x?b.x+=b.speed*a:b.y>0?(b.fall=!0,b.y-=800*a):h():b.x+=b.speed*a:u.pass?b.headStand||(g("pass"),b.waitTime=0,u.manMove=!1,u.bankMove=!0,u.useBanana=!1,u.points+=1,u.stage().trigger("build-bank")):b.headStand?b.y>0?(b.fall=!0,b.y-=800*a):h():b.y<u.height?(b.fall=!0,b.y+=800*a):h()):b.waitTime+=a)},draw:function(a){a||(a=u.ctx);var b=this.p;b.headStand?(a.save(),a.translate(b.x,u.height-p),a.rotate(Math.PI),a.scale(-1,1),a.translate(-b.x,p-u.height),this._super(a),a.restore()):this._super(a)}}),u.GamePoints=u.GameObject.extend({init:function(a){u.points=0,u.bananas=0,this.p=_({x1:u.width/2,y1:50,x2:u.width/2+30,y2:u.height-10,z:2}).extend(a||{})},step:function(){},draw:function(a){a||(a=u.ctx),a.save(),a.fillStyle="#fff",a.textAlign="center",a.font="bold 40px '微软雅黑' Arial",a.fillText(u.points+"",this.p.x1,this.p.y1),a.restore(),a.save(),a.fillStyle="#fff",a.textAlign="center",a.font="bold 20px '微软雅黑' Arial",a.fillText(u.bananas+"",this.p.x2,this.p.y2),a.restore()}}),u.assets["sprites.json"]={man:{sx:0,sy:0,cols:10,sw:40,sh:55,dw:20,dh:27.5,frames:10},banana1:{sx:5,sy:240,clos:1,sw:60,sh:45,dw:20,dh:15,frames:1},banana2:{sx:5,sy:240,clos:1,sw:60,sh:45,dw:40,dh:30,frames:1}};var w=["sprites.png","background.jpg","banana1.wav","banana1.mp3","banana3.wav","banana3.mp3","pass.wav","pass.mp3","bonus.wav","bonus.mp3"];u.load(w,n,{progressCallback:function(a,b){if(b>=a){u.clear();var c=u.ctx;c.fillStyle="#fff",c.textAlign="center",c.font='normal 25px "微软雅黑" Arial',c.fillText("拼命加载中...",u.width/2,u.height/2),c.fillStyle="#666",c.font='normal 18px "微软雅黑" Arial',c.fillText("新版本新玩法, 记得看游戏说明噢~",u.width/2,u.height/2+60),c.fillText("虐己不如虐人, 叫上小伙伴们一起玩吧!",u.width/2,u.height/2+90)}}})});