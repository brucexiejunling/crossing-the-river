Quintus.Scenes = function(Q) {

  Q.scenes = {};
  Q.stages = [];

  Q.Scene = Class.extend({
    init: function(sceneFunc,opts) {
      this.opts = opts || {};
      this.sceneFunc = sceneFunc;
    }
  });

  // Set up or return a new scene
  Q.scene = function(name,sceneObj) {
    if(!sceneObj) {
      return Q.scenes[name];
    } else {
      Q.scenes[name] = sceneObj;
      return sceneObj;
    }
  };

  Q.Stage = Q.GameObject.extend({
    // Should know whether or not the stage is paused
    defaults: {
      sort: true
    },

    init: function(scene) {
      this.scene = scene;
      this.items = [];
      this.index = {};
      this.removeList = [];
      if(scene)  { 
        this.options = _(this.defaults).clone();
        _(this.options).extend(scene.opts);
        scene.sceneFunc(this);
      }
      if(this.options.sort && !_.isFunction(this.options.sort)) {
          this.options.sort = function(a,b) { return a.p.z - b.p.z; };
      }
    },

    each: function(callback) {
      for(var i=0,len=this.items.length;i<len;i++) {
        callback.call(this.items[i],arguments[1],arguments[2]);
      }
    },

    eachInvoke: function(funcName) {
      for(var i=0,len=this.items.length;i<len;i++) {              
        this.items[i][funcName].call(
          this.items[i],arguments[1],arguments[2]
        );
      }
    },

    insert: function(itm) {
      this.items.push(itm);
      itm.parent = this;
      if(itm.p) {
        this.index[itm.p.id] = itm;
      }
      this.trigger('inserted',itm);
      itm.trigger('inserted',this);
      return itm;
    },

    remove: function(itm) {
      this.removeList.push(itm);
    },

    forceRemove: function(itm) {
      var idx = _(this.items).indexOf(itm);
      if(idx != -1) { 
        this.items.splice(idx,1);
        if(itm.destroy) itm.destroy();
        if(itm.p.id) {
          delete this.index[itm.p.id];
        }
        this.trigger('removed',itm);
      }
    },

    pause: function() {
      this.paused = true;
    },

    unpause: function() {
      this.paused = false;
    },

    step: function(dt) {
      if(this.paused) { return false; }

      this.trigger("prestep",dt);
      this.eachInvoke("step",dt);
      this.trigger("step",dt);

      if(this.removeList.length > 0) {
        for(var i=0,len=this.removeList.length;i<len;i++) {
          this.forceRemove(this.removeList[i]);
        }
        this.removeList.length = 0;
      }
    },

    draw: function(ctx) {
      if(this.options.sort) {
        this.items.sort(this.options.sort);
      }
      this.trigger("predraw",ctx);
      this.eachInvoke("draw",ctx);
      this.trigger("draw",ctx);
    }
  });

  Q.activeStage = 0;

  Q.stage = function(num) {
    // Use activeStage if num is undefined
    num = (num === void 0) ? Q.activeStage : num;
    return Q.stages[num];
  };

  Q.stageScene = function(scene,num,stageClass) {
    stageClass = stageClass || Q.Stage;
    if(_(scene).isString()) {
      scene = Q.scene(scene);
    }

    num = num || 0;

    if(Q.stages[num]) {
      Q.stages[num].destroy();
    }

    Q.stages[num] = new stageClass(scene);

    if(!Q.loop) {
      Q.gameLoop(Q.stageGameLoop);
    }
  };

  Q.stageGameLoop = function(dt) {
    if(Q.ctx) { 
      Q.clear(); 
    }

    // draw background
    var bg = Q.backgrounds[Q.bgIndex]
    Q.ctx.drawImage(Q.asset('background.jpg'), bg.x, bg.y, bg.w, bg.h, 0, 0, Q.width, Q.height)       

    for(var i =0,len=Q.stages.length;i<len;i++) {
      Q.activeStage = i;
      var stage = Q.stage();
      if(stage) {
        stage.step(dt);
        stage.draw(Q.ctx);
      }
    }
    Q.activeStage = 0;
  };


};

