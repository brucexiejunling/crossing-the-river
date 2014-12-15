!function(){var a=!1,b=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){},Class.extend=function(c){function d(){!a&&this.init&&this.init.apply(this,arguments)}var e=this.prototype;a=!0;var f=new this;a=!1;for(var g in c)f[g]="function"==typeof c[g]&&"function"==typeof e[g]&&b.test(c[g])?function(a,b){return function(){var c=this._super;this._super=e[a];var d=b.apply(this,arguments);return this._super=c,d}}(g,c[g]):c[g];return d.prototype=f,d.prototype.constructor=d,d.extend=arguments.callee,d}}(),function(){for(var a=0,b=["ms","moz","webkit","o"],c=0;c<b.length&&!window.requestAnimationFrame;++c)window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(b){var c=(new Date).getTime(),d=Math.max(0,16-(c-a)),e=window.setTimeout(function(){b(c+d)},d);return a=c+d,e}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)})}();var Quintus=function(a){var b={};return b.options={imagePath:"images/",audioPath:"audio/",dataPath:"data/",audioSupported:["mp3","ogg"],sound:!0},a&&_(b.options).extend(a),b._normalizeArg=function(a){return _.isString(a)&&(a=a.replace(/\s+/g,"").split(",")),_.isArray(a)||(a=[a]),a},b.extend=function(a){return _(b).extend(a),b},b.include=function(a){return _.each(b._normalizeArg(a),function(a){(a=Quintus[a]||a)(b)}),b},b.gameLoop=function(a){b.lastGameLoopFrame=(new Date).getTime(),b.gameLoopCallbackWrapper=function(c){b.loop=requestAnimationFrame(b.gameLoopCallbackWrapper);var d=c-b.lastGameLoopFrame;Math.abs(d)>100&&(d=100),a.call(b,d/1e3),b.lastGameLoopFrame=c},requestAnimationFrame(b.gameLoopCallbackWrapper)},b.pauseGame=function(){b.loop&&cancelAnimationFrame(b.loop),b.loop=null},b.unpauseGame=function(){b.loop||(b.lastGameLoopFrame=(new Date).getTime(),b.loop=requestAnimationFrame(b.gameLoopCallbackWrapper))},b.Evented=Class.extend({bind:function(a,b,c){c||(c=b,b=null),_.isString(c)&&(c=b[c]),this.listeners=this.listeners||{},this.listeners[a]=this.listeners[a]||[],this.listeners[a].push([b||this,c]),b&&(b.binds||(b.binds=[]),b.binds.push([this,a,c]))},trigger:function(a,b){if(this.listeners&&this.listeners[a])for(var c=0,d=this.listeners[a].length;d>c;c++){var e=this.listeners[a][c];e[1].call(e[0],b)}},unbind:function(a,b,c){if(b){var d=this.listeners&&this.listeners[a];if(d)for(var e=d.length-1;e>=0;e--)d[e][0]==b&&(c&&c!=d[e][1]||this.listeners[a].splice(e,1))}else this.listeners[a]&&delete this.listeners[a]},debind:function(){if(this.binds)for(var a=0,b=this.binds.length;b>a;a++){var c=this.binds[a],d=c[0],e=c[1];d.unbind(e,this)}}}),b.components={},b.register=function(a,c){c.name=a,b.components[a]=b.Component.extend(c)},b.Component=b.Evented.extend({init:function(a){this.entity=a,this.extend&&_.extend(a,this.extend),a[this.name]=this,a.activeComponents.push(this.name),this.added&&this.added()},destroy:function(){if(this.extend)for(var a=_.keys(this.extend),b=0,c=a.length;c>b;b++)delete this.entity[a[b]];delete this.entity[this.name];var d=this.entity.activeComponents.indexOf(this.name);-1!=d&&this.entity.activeComponents.splice(d,1),this.debind(),this.destroyed&&this.destroyed()}}),b.GameObject=b.Evented.extend({has:function(a){return this[a]?!0:!1},add:function(a){a=b._normalizeArg(a),this.activeComponents||(this.activeComponents=[]);for(var c=0,d=a.length;d>c;c++){var e=a[c],f=b.components[e];if(!this.has(e)&&f){var g=new f(this);this.trigger("addComponent",g)}}return this},del:function(a){a=b._normalizeArg(a);for(var c=0,d=a.length;d>c;c++){var e=a[c];e&&this.has(e)&&(this.trigger("delComponent",this[e]),this[e].destroy())}return this},destroy:function(){this.destroyed||(this.debind(),this.parent&&this.parent.remove&&this.parent.remove(this),this.trigger("removed"),this.destroyed=!0)}}),b.setup=function(a,c){var d="ontouchstart"in document;c=c||{},a=a||"quintus",b.el=$(_.isString(a)?"#"+a:a),0===b.el.length&&(b.el=$("<canvas width='320' height='420'></canvas>").attr("id",a).appendTo("body"));var e=c.maxWidth||5e3,f=c.maxHeight||5e3,g=c.resampleWidth,h=c.resampleHeight;if(c.maximize){$("html, body").css({padding:0,margin:0});var i=Math.min(window.innerWidth,e),j=Math.min(window.innerHeight-5,f);d&&(b.el.css({height:2*j}),window.scrollTo(0,1),i=Math.min(window.innerWidth,e),j=Math.min(window.innerHeight-5,f)),b.el.css({width:i,height:j}).attr((g&&i>g||h&&j>h)&&d?{width:i/2,height:j/2}:{width:i,height:j})}return c.fullScreen&&d&&b.setFullScreen(document.documentElement),b.wrapper=b.el.wrap("<div id='"+a+"_container'/>").parent().css({width:b.el.width(),margin:"0 auto"}),b.el.css("position","relative"),b.ctx=b.el[0].getContext&&b.el[0].getContext("2d"),d&&window.scrollTo(0,1),b.width=parseInt(b.el.attr("width"),10),b.height=parseInt(b.el.attr("height"),10),$(window).bind("orientationchange",function(){setTimeout(function(){window.scrollTo(0,1)},0)}),b},b.setFullScreen=function(a){a.requestFullscreen?a.requestFullscreen():a.mozRequestFullScreen?a.mozRequestFullScreen():a.webkitRequestFullscreen?a.webkitRequestFullscreen():a.msRequestFullscreen&&a.msRequestFullscreen()},b.clear=function(){b.ctx.clearRect(0,0,b.el[0].width,b.el[0].height)},b.assetTypes={png:"Image",jpg:"Image",gif:"Image",jpeg:"Image",ogg:"Audio",wav:"Audio",m4a:"Audio",mp3:"Audio"},b.assetType=function(a){var c=_(a.split(".")).last().toLowerCase();return b.assetTypes[c]||"Other"},b.loadAssetImage=function(a,c,d,e){var f=new Image;$(f).on("load",function(){d(a,f)}),$(f).on("error",e),f.src=b.options.imagePath+c},b.audioMimeTypes={mp3:"audio/mpeg",ogg:'audio/ogg; codecs="vorbis"',m4a:"audio/m4a",wav:"audio/wav"},b.loadAssetAudio=function(a,c,d,e){if(!document.createElement("audio").play||!b.options.sound)return void d(a,null);var f=new Audio,g=b._removeExtension(c),h=null;return(h=_(b.options.audioSupported).detect(function(a){return f.canPlayType(b.audioMimeTypes[a])?a:null}))?($(f).on("error",e),$(f).on("canplaythrough",function(){d(a,f)}),f.src=b.options.audioPath+g+"."+h,f.load(),f):void d(a,null)},b.loadAssetOther=function(a,c,d,e){$.get(b.options.dataPath+c,function(b){d(a,b)}).fail(e)},b._removeExtension=function(a){return a.replace(/\.(\w{3,4})$/,"")},b.assets={},b.asset=function(a){return b.assets[a]},b.load=function(a,c,d){var e={};d||(d={});var f=d.progressCallback,g=!1,h=function(a){g=!0,(d.errorCallback||function(a){alert("Error Loading: "+a)})(a)};_.isArray(a)?_.each(a,function(a){_.isObject(a)?_.extend(e,a):e[a]=a}):_.isString(a)?e[a]=a:e=a;var i=_(e).keys().length,j=i,k=function(a,d){g||(b.assets[a]=d,j--,f&&f(i-j,i),0===j&&c&&c.apply(b))};_.each(e,function(a,c){var d=b.assetType(a);b.assets[c]?k(c,b.assets[c]):b["loadAsset"+d](c,a,k,function(){h(a)})})},b.preloads=[],b.preload=function(a,c){_(a).isFunction()?(b.load(_(b.preloads).uniq(),a,c),b.preloads=[]):b.preloads=b.preloads.concat(a)},b};
Quintus.Sprites=function(a){return a.SpriteSheet=Class.extend({init:function(b,c,d){_.extend(this,{name:b,asset:c,w:a.asset(c).width,h:a.asset(c).height,tilew:64,tileh:64,sx:0,sy:0},d),this.cols=this.cols||Math.floor(this.w/this.tilew)},fx:function(a){return a%this.cols*this.tilew+this.sx},fy:function(a){return Math.floor(a/this.cols)*this.tileh+this.sy},draw:function(b,c,d,e){b||(b=a.ctx),b.drawImage(a.asset(this.asset),this.fx(e),this.fy(e),this.tilew,this.tileh,Math.floor(c),Math.floor(d),.7*this.tilew,.7*this.tileh)}}),a.sheets={},a.sheet=function(b,c,d){return c?void(a.sheets[b]=new a.SpriteSheet(b,c,d)):a.sheets[b]},a.compileSheets=function(b,c){var d=a.asset(c);_(d).each(function(c,d){a.sheet(d,b,c)})},a.Sprite=a.GameObject.extend({init:function(a){this.p=_({x:0,y:0,z:0,frame:0,type:0}).extend(a||{}),this.p.w&&this.p.h||(this.asset()?(this.p.w=this.p.w||this.asset().width,this.p.h=this.p.h||this.asset().height):this.sheet()&&(this.p.w=this.p.w||this.sheet().tilew,this.p.h=this.p.h||this.sheet().tileh)),this.p.id=this.p.id||_.uniqueId()},asset:function(){return a.asset(this.p.asset)},sheet:function(){return a.sheet(this.p.sheet)},draw:function(b){b||(b=a.ctx);var c=this.p;c.sheet?this.sheet().draw(b,c.x,c.y,c.frame):c.asset&&b.drawImage(a.asset(c.asset),Math.floor(c.x),Math.floor(c.y)),this.trigger("draw",b)},step:function(a){this.trigger("step",a)}}),a.Rectangle=a.GameObject.extend({init:function(a){this.p=_({x:0,y:0,w:0,h:0,color:"#000"}).extend(a||{}),this.p.id=this.p.id||_.uniqueId()},draw:function(b){b||(b=a.ctx);var c=this.p;b.fillStyle=c.color,b.fillRect(c.x,c.y,c.w,c.h),this.trigger("draw",b)},step:function(a){this.trigger("step",a)}}),a};
Quintus.Scenes=function(a){a.scenes={},a.stages=[],a.Scene=Class.extend({init:function(a,b){this.opts=b||{},this.sceneFunc=a}}),a.scene=function(b,c){return c?(a.scenes[b]=c,c):a.scenes[b]},a.Stage=a.GameObject.extend({defaults:{sort:!0},init:function(a){this.scene=a,this.items=[],this.index={},this.removeList=[],a&&(this.options=_(this.defaults).clone(),_(this.options).extend(a.opts),a.sceneFunc(this)),this.options.sort&&!_.isFunction(this.options.sort)&&(this.options.sort=function(a,b){return a.p.z-b.p.z})},each:function(a){for(var b=0,c=this.items.length;c>b;b++)a.call(this.items[b],arguments[1],arguments[2])},eachInvoke:function(a){for(var b=0,c=this.items.length;c>b;b++)this.items[b][a].call(this.items[b],arguments[1],arguments[2])},insert:function(a){return this.items.push(a),a.parent=this,a.p&&(this.index[a.p.id]=a),this.trigger("inserted",a),a.trigger("inserted",this),a},remove:function(a){this.removeList.push(a)},forceRemove:function(a){var b=_(this.items).indexOf(a);-1!=b&&(this.items.splice(b,1),a.destroy&&a.destroy(),a.p.id&&delete this.index[a.p.id],this.trigger("removed",a))},pause:function(){this.paused=!0},unpause:function(){this.paused=!1},step:function(a){if(this.paused)return!1;if(this.trigger("prestep",a),this.eachInvoke("step",a),this.trigger("step",a),this.removeList.length>0){for(var b=0,c=this.removeList.length;c>b;b++)this.forceRemove(this.removeList[b]);this.removeList.length=0}},draw:function(a){this.options.sort&&this.items.sort(this.options.sort),this.trigger("predraw",a),this.eachInvoke("draw",a),this.trigger("draw",a)}}),a.activeStage=0,a.stage=function(b){return b=void 0===b?a.activeStage:b,a.stages[b]},a.stageScene=function(b,c,d){d=d||a.Stage,_(b).isString()&&(b=a.scene(b)),c=c||0,a.stages[c]&&a.stages[c].destroy(),a.stages[c]=new d(b),a.loop||a.gameLoop(a.stageGameLoop)},a.stageGameLoop=function(b){a.ctx&&a.clear(),a.ctx.drawImage(a.asset("background.jpg"),0,0,a.asset("background.jpg").width,a.asset("background.jpg").height,0,0,a.width,a.height);for(var c=0,d=a.stages.length;d>c;c++){a.activeStage=c;var e=a.stage();e&&(e.step(b),e.draw(a.ctx))}a.activeStage=0}};
Quintus.Screen=function(a){return a.buttons=[],a.Screen=a.GameObject.extend({init:function(b){this.p=_.extend({images:[],titles:[],buttons:[]},b||{}),_.each(this.p.buttons,function(b){a.buttons.push({name:b.name,width:b.dy,height:b.dh,x:b.dx,y:b.dy})})},step:function(){},draw:function(b){b||(b=a.ctx);var c=this.p;_.each(c.images,function(a){b.drawImage(a.asset,a.sx,a.sy,a.sw,a.sh,a.dx,a.dy,a.dw,a.dh)}),b.fillStyle="#fff",b.textAlign="center",b.font="bold 32px '微软雅黑' Arial",_.each(c.titles,function(a){b.fillText(a.text,a.x,a.y)}),_.each(c.buttons,function(a){b.drawImage(a.asset,a.sx,a.sy,a.sw,a.sh,a.dx,a.dy,a.dw,a.dh)})}}),a};
$(function(){function a(){n.el.on("touchend mouseup",c),n.el.on("touchstart mousedown",function(){n.stage().trigger("press-down")}),n.el.on("touchend mouseup",function(){n.stage().trigger("press-up")})}function b(a){var b=n.el,c=a.pageX,d=a.pageY,e=b.offset(),f=(b.attr("width")||n.width)*(c-e.left)/b.width(),g=(b.attr("height")||n.height)*(d-e.top)/b.height();return{x:f,y:g}}function c(a){var c=!!("ontouch"in window);if(c)for(i=0,len=a.touches.length;i<len;i++){var d=a.touches[i],e=b(d),f=!1;if(_.each(n.buttons,function(a){e.x>=a.x&&e.x<=a.x+a.width&&e.y>a.y&&e.y<=a.y+a.height&&(f=!0,n.stage().trigger(a.name))}),f)break}else{var e=b(a);_.each(n.buttons,function(a){e.x>=a.x&&e.x<=a.x+a.width&&e.y>a.y&&e.y<=a.y+a.height&&(f=!0,n.stage().trigger(a.name))})}}function d(){$("#mask").css({display:"block",width:window.innerWidth,height:window.innerHeight}).on("mouseup touchend",e)}function e(a){document.title="小黄人过河",a.preventDefault(),$("#mask").css("display","none").off("mouseup touchend",e)}var f=3,g=150,h=80,j=20,k=120,l=15,m=300,n=window.Q=Quintus().include("Sprites, Scenes, Screen").setup("",{maximize:!0,fullScreen:!0});a(),n.Bridge=n.Rectangle.extend({init:function(a){this._super(_.extend({w:f,y:n.height-g,speed:150,ang:0,scaled:!1,roated:!1,moved:!1},a||{}))},step:function(a){var b=this.p;n.down&&!b.roated?(n.bridgeScale=!0,b.scaled=!0,b.h+=b.speed*a,b.y-=b.speed*a):n.up&&90==b.ang&&!b.moved&&(n.manMove=!0,b.moved=!0,b.h>n.gap&&b.h<n.gap+b.rbw?(n.moveToX=b.rbw+b.rbx,n.pass=!0):(b.h<=n.gap||b.h>=n.gap+b.rbw)&&(n.moveToX=b.lbw+b.lbx+b.h+28,n.pass=!1)),n.bankMove&&90===b.ang&&b.h+b.x+n.height-g-b.y>0?b.y+=m*a:n.bankMove&&90===b.ang&&this.destroy()},draw:function(a){a||(a=n.ctx);var b=this.p;n.up&&b.scaled&&b.ang<90?(b.roated=!0,b.ang+=5,a.save(),a.translate(b.x+f,n.height-g),a.rotate(b.ang*Math.PI/180),a.translate(-b.x-f,g-n.height),a.fillStyle=b.color,a.fillRect(b.x,b.y,b.w,b.h),a.restore()):n.down&&!b.roated?this._super(a):90==b.ang&&(a.save(),a.translate(b.x+f-f/3,n.height-g+f/3),a.rotate(Math.PI/2),a.translate(-b.x-f+f/3,g-n.height-f/3),a.fillStyle=b.color,a.fillRect(b.x,b.y,b.w,b.h),a.restore())}}),n.Bank=n.Rectangle.extend({init:function(a){this._super(_.extend({x:0,y:n.height-g,w:j,h:g,type:""},a||{}))},step:function(a){var b=this.p;n.bankMove&&("right"==b.type?b.x+b.w>h?b.x-=m*a:(n.bankMove=!1,n.stage().trigger("build-bridge")):n.bankMove&&(b.x-=m*a),b.x+b.w<=0&&this.destroy())},setType:function(a){this.p.type=a}});var o={man:{sx:10,sy:10,cols:10,tilew:45,tileh:58,frames:10}};n.Man=n.Sprite.extend({init:function(a){this._super(_(a).extend({sheet:"man",speed:200,frameCount:0,z:10}))},step:function(a){var b=this.p;n.down||n.manMove?n.manMove?(b.frameCount=(b.frameCount+1)%21,b.frame=5+Math.floor(b.frameCount/4)):(b.frameCount=(b.frameCount+1)%13,b.frame=Math.floor(b.frameCount/4)):b.frame=0,n.bankMove&&!n.manMove&&b.x+28>h&&(b.x-=m*a),n.manMove&&(b.x+28<n.moveToX?b.x+=b.speed*a:n.pass?(n.manMove=!1,n.bankMove=!0,n.points+=1,n.stage().trigger("build-bank")):b.y<n.height?b.y+=800*a:(n.manMove=!1,n.bankMove=!1,n.stageScene("over")))}}),n.assets["man.json"]=o,n.load(["sprites5.png","background.jpg"],function(){n.compileSheets("sprites5.png","man.json"),n.scene("game",new n.Scene(function(a){var b=new n.Bank({type:"left",x:0,w:80});n.gap=Math.max(l,Math.floor(Math.random()*(n.width-b.p.w-b.p.x-j)));var c=new n.Bank({x:b.p.x+b.p.w+n.gap,w:Math.min(k,Math.floor(Math.max(j,Math.random()*(n.width-b.p.w-n.gap)))),type:"right"}),d=new n.Bridge({x:b.p.w+b.p.x-f,lbw:b.p.w,lbx:b.p.x,rbw:c.p.w,rbx:c.p.x});a.insert(b),a.insert(c),a.insert(d),a.insert(new n.Man({x:b.p.w+b.p.x-28,y:n.height-g-38.5,frame:0})),a.insert(new n.GamePoints);var e;a.bind("build-bank",function(){n.gap=Math.max(l,Math.floor(Math.random()*(n.width-c.p.w-c.p.x-j))),e=new n.Bank({x:c.p.x+c.p.w+n.gap,w:Math.min(k,Math.max(j,Math.floor(Math.random()*(n.width-h-n.gap)))),type:"right"}),a.insert(e)}),a.bind("build-bridge",function(){b=c,b.setType("left"),c=e,d=new n.Bridge({x:b.p.w+b.p.x-f,lbw:b.p.w,lbx:b.p.x,rbw:c.p.w,rbx:c.p.x}),a.insert(d)}),a.bind("press-down",function(){n.down=!0,n.up=!1}),a.bind("press-up",function(){n.down=!1,n.up=!0})})),n.scene("start",new n.Scene(function(a){var b=new n.Screen({images:[{asset:n.asset("sprites5.png"),sx:16,sy:80,sw:216,sh:176,dx:n.width/2-108,dy:20,dw:216,dh:176}],buttons:[{asset:n.asset("sprites5.png"),name:"start",sx:236,sy:80,sw:188,sh:40,dx:n.width/2-94,dy:225,dw:188,dh:40},{asset:n.asset("sprites5.png"),name:"share",sx:236,sy:124,sw:188,sh:40,dx:n.width/2-94,dy:285,dw:188,dh:40}]});a.insert(b),a.bind("share",function(){document.title="[小黄人过河]游戏, 想自虐吗, 来挑战吧! 66666",d()}),a.bind("start",function(){n.stageScene("game")})})),n.scene("over",new n.Scene(function(a){var b=new n.Screen({titles:[{text:"no zuo no die",x:n.width/2,y:100},{text:"分数: "+n.points,x:n.width/2,y:g}],buttons:[{asset:n.asset("sprites5.png"),name:"replay",sx:236,sy:172,sw:188,sh:40,dx:n.width/2-94,dy:200,dw:188,dh:40},{asset:n.asset("sprites5.png"),name:"show",sx:236,sy:216,sw:188,sh:40,dx:n.width/2-94,dy:260,dw:188,dh:40}]});a.insert(b),a.bind("replay",function(){n.stageScene("game")}),a.bind("show",function(){document.title="我在[小黄人过河]游戏中怒砍"+n.points+"分, 6到没朋友! you can? you up!",d()})})),n.stageScene("start")}),n.GamePoints=n.GameObject.extend({init:function(a){n.points=0,this.p=_({x:n.width/2,y:50,z:0}).extend(a||{})},step:function(){},draw:function(a){a||(a=n.ctx),a.save(),a.fillStyle="#fff",a.textAlign="center",a.font="bold 40px Arial",a.fillText(n.points+"",this.p.x,this.p.y),a.restore()}})});