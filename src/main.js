$(function() {
	function setupInputs() {
	  Q.el.on('touchend touchmove mouseup', touchDispatch)
	  Q.el.on('touchstart mousedown', function() {
      // event.preventDefault()
      Q.stage().trigger('press-down')
	  })
	  Q.el.on('touchend touchmove mouseup', function() {
      // event.preventDefault()
      Q.stage().trigger('press-up')
	  })
	}

	function touchLocation(touch) {
    var el = Q.el, 
        pageX = touch.pageX,
        pageY = touch.pageY,
        pos = el.offset(),
        touchX = (el.attr('width') || Q.width) * 
                 (pageX - pos.left) / el.width(),
        touchY = (el.attr('height')||Q.height) * 
                 (pageY - pos.top) / el.height();
    return { x: touchX, y: touchY };
  }

  function touchDispatch(event) {
    // event.preventDefault()
  	var hasTouch = !!('ontouch' in window)
  	if(hasTouch) {
	    for(i=0,len=event.touches.length;i<len;i++) {
	      var tch = event.touches[i];
	      var pos = touchLocation(tch)
	      var canBreak = false
	      _.each(Q.buttons, function(btn, index) {
	        if(pos.x >= btn.x && pos.x <= btn.x + btn.width &&
	          pos.y > btn.y && pos.y <= btn.y + btn.height) {
	          canBreak = true
	          Q.stage().trigger(btn.name)
	        }
	      });
	      if(canBreak) {
	        break
	      }
	    }
  	} else {
  		var pos = touchLocation(event)
			_.each(Q.buttons, function(btn, index) {
        if(pos.x >= btn.x && pos.x <= btn.x + btn.width &&
          pos.y > btn.y && pos.y <= btn.y + btn.height) {
          canBreak = true
          Q.stage().trigger(btn.name)
        }
      });  		
  	}
  }

  function showShareMask() {
    $('#share-text').text('" 我在[小黄人过河]游戏中怒砍' + Q.points + '分, 6到没朋友! you can? you up! "')
    $('#mask').css({
      display: 'block',
      width: window.innerWidth,
      height: window.innerHeight,
    })

    $('#return').on('mouseup touchend', hideShareMask)
  }

  function hideShareMask(event) {
    event.preventDefault()
    document.title = "小黄人过河"
    $('#mask').css('display', 'none').off('mouseup touchend', hideShareMask)
  }

  var BRIDGE_WIDTH = 3, BANK_HEIGHT = 150, MIN_BANK_OFFSET = 80,
      MIN_BANK_WIDTH = 10, MAX_BANK_WIDTH = 120, MIN_GAP = 15, MOVE_SPEED = 300;
	var Q = window.Q = Quintus().
                    include('Sprites, Scenes, Screen').
                    setup('', {maximize: true, fullScreen: true});
  setupInputs()

  Q.points = 0;

  Q.Bridge = Q.Rectangle.extend({
    init: function(props) {
      this._super(_.extend({
        w: BRIDGE_WIDTH,
        y: Q.height - BANK_HEIGHT,
        speed: 150,
        ang: 0,
        scaled: false,
        roated: false,
        moved: false,
      }, props || {}));
    }, 

    step: function(dt) {
      var p = this.p
      if(!Q.bankMove && !Q.manMove && Q.down && !p.roated) {
        Q.bridgeScale = true
        p.scaled = true
        p.h += p.speed * dt
        p.y -= p.speed * dt
      } else if(Q.up && p.ang == 90 && !p.moved) {
        Q.manMove = true
        p.moved = true
        console.log('p.h', p.h)
        console.log('Q.gap', Q.gap)
        console.log('p.rbw', p.rbw)
        if(p.h > Q.gap && p.h < Q.gap + p.rbw) {
          Q.moveToX = p.rbw + p.rbx
          Q.pass = true
        } else if(p.h <= Q.gap || p.h >= Q.gap + p.rbw) {
          Q.moveToX = p.lbw + p.lbx + p.h + 40 * 0.5
          Q.pass = false
        }
      }

      if(Q.bankMove && p.ang === 90 && p.h + p.x + Q.height - BANK_HEIGHT - p.y > 0) {
        p.y += MOVE_SPEED * dt
      } else if(Q.bankMove && p.ang === 90){
        this.destroy()
      }

    },

    draw: function(ctx) {
      if(!ctx) {
        ctx = Q.ctx
      }
      var p = this.p
      if(Q.up && p.scaled && p.ang < 90) {
        p.roated = true
        p.ang += 5
        ctx.save()
        ctx.translate(p.x + BRIDGE_WIDTH , Q.height - BANK_HEIGHT)
        ctx.rotate(p.ang*Math.PI/180)
        ctx.translate(-p.x - BRIDGE_WIDTH, BANK_HEIGHT - Q.height)
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, p.w, p.h)
        ctx.restore()
      }else if(Q.down && !p.roated){
        this._super(ctx)
      } else if(p.ang == 90) {
        ctx.save()
        ctx.translate(p.x + BRIDGE_WIDTH  - BRIDGE_WIDTH / 3, Q.height - BANK_HEIGHT + BRIDGE_WIDTH / 3)
        ctx.rotate(Math.PI / 2)
        ctx.translate(-p.x - BRIDGE_WIDTH + BRIDGE_WIDTH / 3, BANK_HEIGHT - Q.height - BRIDGE_WIDTH / 3)
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, p.w, p.h)
        ctx.restore()
      }
    }
  });

  Q.Bank = Q.Rectangle.extend({
    init: function(props) {
      this._super(_.extend({
        x: 0,
        y: Q.height - BANK_HEIGHT,
        w: MIN_BANK_WIDTH,
        h: BANK_HEIGHT,
        type: ''
      }, props || {}));
    },

    step: function(dt) {
      var p = this.p
      if(Q.bankMove) {
        if(p.type == 'right') {
          if(p.x + p.w > MIN_BANK_OFFSET) {
            p.x -= MOVE_SPEED * dt
          } else {
            Q.bankMove = false
            Q.stage().trigger('build-bridge')
          }
        } else if(Q.bankMove){
          p.x -= MOVE_SPEED * dt
        }
        if(p.x + p.w <= 0) {
          this.destroy()
        }
      }
    },

    setType: function(type) {
      this.p.type = type
    }
  });


  var manJson = {
    "man": {
      "sx": 0,"sy":0,"cols":10,"tilew":40,"tileh":55,"frames":10
    }
  }

  Q.Man = Q.Sprite.extend({
    init: function(props) {
      this._super(_(props).extend({
       sheet: 'man', speed: 200, frameCount: 0, z: 10
      }));
    },

    step: function(dt) {
      var p = this.p
      if(!Q.down && !Q.manMove) {
        p.frame = 0
      } else if(!Q.manMove) {
        p.frameCount = (p.frameCount + 1) % 13
        p.frame = Math.floor(p.frameCount / 4)
      } else {
        p.frameCount = (p.frameCount + 1) % 21
        p.frame = 5 + Math.floor(p.frameCount / 4)
      }

      if(Q.bankMove && !Q.manMove) {
        if(p.x + 40 * 0.5 > MIN_BANK_OFFSET) {
          p.x -= MOVE_SPEED * dt
        } 
      }      

      if(Q.manMove) {
        if(p.x + 40 * 0.5 < Q.moveToX && p.x < Q.width) {
          p.x += p.speed * dt
        } else if(Q.pass) {
          Q.manMove = false
          Q.bankMove = true
          Q.points += 1
          Q.stage().trigger('build-bank')
        } else {
          if(p.y < Q.height) {
            p.y += 800 * dt
          } else {
            Q.manMove = false
            Q.bankMove = false
            Q.stageScene('over')
          }
        }
      }
    }
  });

//
//   var rnd
//   rnd.today=new Date();
//   rnd.seed=rnd.today.getTime();
//   function rnd() {
//   　rnd.seed = (rnd.seed*9301+49297) % 233280;
// 　　return rnd.seed/(233280.0);
//   };
//   function rand() {
//   　return Math.ceil(rnd()*10) / 10;
//   };

//

  Q.assets['man.json'] = manJson

  Q.load(['sprites.png', 'background.jpg'], function() {
    Q.compileSheets('sprites.png', 'man.json')

    Q.scene('game', new Q.Scene(function(stage) {
      var leftBank = new Q.Bank({
        type: 'left',
        x: 0,
        w: 80
      });

      Q.gap = Math.max(MIN_GAP, Math.floor(Math.random() * (Q.width - leftBank.p.w - leftBank.p.x - MIN_BANK_WIDTH)))

      var rightBank = new Q.Bank({
        x: leftBank.p.x + leftBank.p.w + Q.gap, 
        w: Math.min(MAX_BANK_WIDTH, Math.floor(Math.max(MIN_BANK_WIDTH, Math.random()*(Q.width - leftBank.p.w - Q.gap)))),
        type: 'right'
      })

      var bridge = new Q.Bridge({
        x: leftBank.p.w + leftBank.p.x - BRIDGE_WIDTH, 
        lbw: leftBank.p.w, 
        lbx: leftBank.p.x, 
        rbw: rightBank.p.w,
        rbx: rightBank.p.x
      });

      stage.insert(leftBank)
      stage.insert(rightBank)
      stage.insert(bridge)

      stage.insert(new Q.Man({
        x: leftBank.p.w + leftBank.p.x - 40 * 0.5, 
        y: Q.height - BANK_HEIGHT - 54 * 0.5, 
        frame: 0
      }));
      
      stage.insert(new Q.GamePoints())

      var tempBank;
      stage.bind('build-bank', function() {
        Q.gap = Math.max(MIN_GAP, Math.floor(Math.random() * (Q.width - rightBank.p.w - rightBank.p.x - MIN_BANK_WIDTH)))
        tempBank = new Q.Bank({
          x: rightBank.p.x + rightBank.p.w + Q.gap,
          w: Math.min(MAX_BANK_WIDTH, 
            Math.max(MIN_BANK_WIDTH, Math.floor(Math.random()*(Q.width - MIN_BANK_OFFSET - Q.gap)))),
          type: 'right'
        });
        stage.insert(tempBank)
      })

      stage.bind('build-bridge', function() {
        leftBank = rightBank
        leftBank.setType('left')

        rightBank = tempBank
        
        bridge = new Q.Bridge({
          x: leftBank.p.w + leftBank.p.x - BRIDGE_WIDTH,
          lbw: leftBank.p.w,
          lbx: leftBank.p.x,
          rbw: rightBank.p.w,
          rbx: rightBank.p.x
        });

        stage.insert(bridge)
      })

      stage.bind('press-down', function() {
      	Q.down = true
      	Q.up = false
      })

      stage.bind('press-up', function() {
      	Q.down = false
      	Q.up = true
      })

    }));

    Q.scene('start', new Q.Scene(function(stage) {
      var screen = new Q.Screen({
        images: [
          {
            asset: Q.asset('sprites.png'),
            sx: 10, sy: 60, sw: 225, sh: 175,
            dx: Q.width / 2 - 216 / 2, dy: 20,
            dw: 225, dh: 175
          }
        ],
      
        buttons: [
          {
            asset: Q.asset('sprites.png'),
            name: 'start',
            sx: 236, sy: 60, sw: 188, sh: 41,
            dx: Q.width / 2 - 94, dy: 225,
            dw: 188, dh:  41
          },
          {
            asset: Q.asset('sprites.png'),
            name: 'share',
            sx: 236, sy: 108, sw: 188, sh: 40,
            dx: Q.width / 2 - 94, dy: 285,
            dw: 188, dh:  40
          } 
        ]
      });

      stage.insert(screen)

      stage.bind('share', function() {
        document.title = "[小黄人过河]游戏, 想自虐吗, 来挑战吧! 66666"
        showShareMask()
      })
      stage.bind('start', function() {
      	Q.stageScene('game')
      })
    }));

    Q.scene('over', new Q.Scene(function(stage) {
 			var screen = new Q.Screen({
 				titles: [
 					{
 						text: 'no zuo no die',
 						x: Q.width / 2,
 						y: 100
 					},

 					{
 						text: '分数: ' + Q.points,
 						x: Q.width / 2,
 						y: BANK_HEIGHT
 					}
 				],
        buttons: [
          {
            asset: Q.asset('sprites.png'),
            name: 'replay',
            sx: 236, sy: 152, sw: 188, sh: 40,
            dx: Q.width / 2 - 94, dy: 200,
            dw: 188, dh:  40
          },
          {
            asset: Q.asset('sprites.png'),
            name: 'show',
            sx: 236, sy: 198, sw: 188, sh: 40,
            dx: Q.width / 2 - 94, dy: 260,
            dw: 188, dh:  40
          } 
        ]
      });

      stage.insert(screen)

      stage.bind('replay', function() {
      	Q.stageScene('game')
      })
      stage.bind('show', function() {
        document.title = "我在[小黄人过河]游戏中怒砍" + Q.points + "分, 6到没朋友! you can? you up!"
        showShareMask()
      })
    }));

    Q.stageScene('start')

  });
  
  
  Q.GamePoints = Q.GameObject.extend({
    init: function(props) {
      Q.points = 0
      this.p = _({ 
        x: Q.width / 2,
        y: 50,
        z: 0
      }).extend(props||{});
    },

    step: function(dt) {
    },

    draw: function(ctx) {
      if(!ctx) {
        ctx = Q.ctx
      }
      ctx.save()
      ctx.fillStyle = "#fff"
      ctx.textAlign = "center"

      ctx.font = "bold 40px Arial"
        ctx.fillText(Q.points + '', this.p.x, this.p.y)
        ctx.restore()
      }
    })
})