$(function() {
	function setupInputs() {
    Q.el.on('touchstart mousedown', function() {
      Q.stage().trigger('press-down')
      event.preventDefault()
    })
	  Q.el.on('touchend touchcancel mouseup', function(event) {
      Q.stage().trigger('press-up')
      touchDispatch(event.originalEvent)
      event.preventDefault()
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
  	var hasTouch = !!('ontouchstart' in window)
  	if(hasTouch) {
      touches = event.changedTouches
	    for(i=0,len=touches.length;i<len;i++) {
	      var tch = touches[i];
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
    $('#share-text').text('" ' + WeiXin.shareTitle + ' "')
    $('#mask').css({
      display: 'block',
      width: window.innerWidth,
      height: window.innerHeight,
    })

    $('#return').on('mouseup touchend', hideShareMask)
  }

  function hideShareMask(event) {
    WeiXin.shareTitle = "小黄人过河"
    event.preventDefault()
    $('#mask').css('display', 'none').off('mouseup touchend', hideShareMask)
  }

  function gameOver() {
    Q.el.addClass('bounce')
    setTimeout(function() {
      Q.el.removeClass('bounce')
      Q.stageScene('over')
    }, 1200)
  }

  var BRIDGE_WIDTH = 3, BANK_HEIGHT = 150, MIN_BANK_OFFSET = 60,
      MIN_BANK_WIDTH = 10, MAX_BANK_WIDTH = 90, MIN_GAP = 15, MOVE_SPEED = 500;
	var Q = window.Q = Quintus().
                    include('Sprites, Scenes, Screen').
                    setup('', {maximize: true, fullScreen: true});

  var bankWidths = {
    's': [10, 15, 20, 25],
    'm': [30, 35, 40, 45, 50, 55],
    'l': [60, 70, 80, 90]
  }

  function getSBP() {
    var sbp = 0.25 + Math.sqrt(Q.points) * 0.02
    if(sbp > 0.4) {
      sbp = 0.4
    }
    return sbp
  }

  function getMBP() {
    return Math.abs(0.3 * Math.sin(0.2 * Q.points + Math.PI / 2)) + 0.2
  }

  function getLBP() {
    return 1 - getSBP() - getMBP()
  }

  function getRandomBankWidth() {
    var bps = [
      {type: 's', p: getSBP()}, 
      {type: 'm', p: getMBP()}, 
      {type: 'l', p: getLBP()}
    ]
    bps.sort(function(a, b) { return a.p > b.p });
    var rand = Math.random(), bankWidthArr
    if(rand < bps[0].p) {
      bankWidthArr = bankWidths[bps[0].type]
    } else if(rand >= bps[0].p && rand < bps[0].p + bps[1].p) {
      bankWidthArr = bankWidths[bps[1].type]
    } else {
      bankWidthArr = bankWidths[bps[2].type]
    }
    return bankWidthArr[Math.floor(Math.random() * bankWidthArr.length)]

  }

  setupInputs()

  Q.points = 0;
  Q.delay = 0.25;

  Q.Bridge = Q.Rectangle.extend({
    init: function(props) {
      this._super(_.extend({
        w: BRIDGE_WIDTH,
        y: Q.height - BANK_HEIGHT,
        z: 1,
        speed: 320,
        ang: 0,
        waitTime: 0,
        scaling: false,
        scaled: false,
        rotating: false,
        rotated: false,
        moved: false,
      }, props || {}));
    }, 

    step: function(dt) {
      var p = this.p
    
      if(!Q.bankMove && !Q.manMove && Q.down && !p.scaled && !p.rotated) {
        Q.bridgeScale = true
        p.scaling = true
        p.h += p.speed * dt
        p.y -= p.speed * dt
      } 

      if(Q.up && p.scaling) {
        p.scaling = false
        p.scaled = true
      }

      if(Q.up && p.scaled) {
        if(p.waitTime < Q.delay) {
          p.waitTime += dt
        }
      }
      
      if(Q.up && p.rotated && !p.moved) {
        Q.manMove = true
        p.moved = true
        Q.pass = false
        if(p.w + p.x > p.rBank.p.x && p.w + p.x < p.rBank.p.w + p.rBank.p.x) {
          Q.moveToX = p.rBank.p.w + p.rBank.p.x
          Q.pass = true
        } else if(p.w + p.x <= p.rBank.p.x || p.w + p.x >= p.rBank.p.w + p.rBank.p.x) {
          Q.moveToX = p.lBank.p.w + p.lBank.p.x + p.w + 40 * 0.5
          Q.pass = false
        }
      }

      if(Q.bankMove && p.rotated && p.x + p.w > 0) {
        p.x -= MOVE_SPEED * dt
      } else if(Q.bankMove && p.rotated){
        this.destroy()
      }

      // 解决桥的移动慢于桥墩而引起的短缺
      if(Q.pass && p.moved && !Q.manMove && p.x + p.w < p.rBank.p.x) {
        p.x = p.rBank.p.x - p.w + 5
      }

    },

    draw: function(ctx) {
      if(!ctx) {
        ctx = Q.ctx
      }
      var p = this.p
      if(p.waitTime >= Q.delay) {
        if(Q.up && p.scaled && !p.rotated) {
          p.rotating = true
          p.ang += 5
          ctx.save()
          ctx.translate(p.x + BRIDGE_WIDTH , Q.height - BANK_HEIGHT)
          ctx.rotate(p.ang*Math.PI/180)
          ctx.translate(-p.x - BRIDGE_WIDTH, BANK_HEIGHT - Q.height)
          ctx.fillStyle = p.color
          ctx.fillRect(p.x, p.y, p.w, p.h)
          ctx.restore()
        }

        if(p.ang === 90 && !p.rotated) {
          p.rotated = true
          p.rotating = false
          var temp = p.h
          p.x = p.lBank.p.x + p.lBank.p.w
          p.h = p.w
          p.w = temp
          p.y = Q.height - BANK_HEIGHT - p.h / 3
          this._super(ctx)
        } else if(p.rotated) {
          this._super(ctx)
        }
      } else {
        this._super(ctx)
      }
    }
  });

  Q.Bank = Q.Rectangle.extend({
    init: function(props) {
      this._super(_.extend({
        x: 0,
        y: Q.height - BANK_HEIGHT,
        z: 2,
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


  Q.Man = Q.Sprite.extend({
    init: function(props) {
      this._super(_(props).extend({
       sheet: 'man', speed: 180, frameCount: 0, z: 3,
       waitTime: 0
      }));
    },

    step: function(dt) {
      var p = this.p
      if(!Q.down && !Q.manMove) {
        p.frame = 0
      } else if(!Q.manMove) {
        p.frameCount = (p.frameCount + 1) % 13
        p.frame = Math.floor(p.frameCount / 4)
      }

      if(Q.bankMove && !Q.manMove) {
        if(p.x + 40 * 0.5 > MIN_BANK_OFFSET) {
          p.x -= MOVE_SPEED * dt
        } 
      }      

      if(Q.manMove) {
        if(p.waitTime >= Q.delay) {
          p.frameCount = (p.frameCount + 1) % 21
          p.frame = 4 + Math.floor(p.frameCount / 4)

          if(p.x + 40 * 0.5 < Q.moveToX && p.x < Q.width) {
            p.x += p.speed * dt
          } else if(Q.pass) {
            p.waitTime = 0
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
              gameOver()
            }
          }
        } else {
          p.waitTime += dt
        }
      }
    }
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

      ctx.font = "bold 40px '微软雅黑' Arial"
        ctx.fillText(Q.points + '', this.p.x, this.p.y)
        ctx.restore()
      }
    })

  Q.assets['man.json'] = {
    "man": {
      "sx": 0,"sy":0,"cols":10,"tilew":40,"tileh":55,"frames":10
    }
  }

  function loadCallback() {
    var flag = false, $body = $('body')
    Q.backgrounds = [
      {x: 0, y: 0, w: 400, h: 535, style: '#3D89FD'},
      {x: 405, y: 0, w: 400, h: 535, style: '#C7F0FF'},
    ]
    Q.bgIndex = 1 

    Q.compileSheets('sprites.png', 'man.json')

    Q.scene('game', new Q.Scene(function(stage) {
      // 设置游戏背景
      if(flag) {
        Q.bgIndex = (Q.bgIndex + 1) % 2
        $body.css('background', Q.backgrounds[Q.bgIndex].style)
      } else {
        flag = true
      }
      var leftBank = new Q.Bank({
        type: 'left',
        x: 0,
        w: 60
      });

      // var bw = getRandomBankWidth()
      // 第一个不要难
      var bw = Math.max(50, Math.floor(Math.random() * 90))

      Q.gap = Math.max(MIN_GAP, Math.floor(Math.random() * (Q.width - leftBank.p.w - leftBank.p.x - bw)))

      var rightBank = new Q.Bank({
        x: leftBank.p.x + leftBank.p.w + Q.gap, 
        w: bw,
        type: 'right'
      })

      var bridge = new Q.Bridge({
        x: leftBank.p.w + leftBank.p.x - BRIDGE_WIDTH, 
        lBank: leftBank,
        rBank: rightBank
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
        var bw = getRandomBankWidth()

        if(bw >= 60) {
          Q.gap = Math.max(MIN_GAP, Math.floor(Math.random() * (Q.width - leftBank.p.w - leftBank.p.x)))
          Q.gap = Math.min(Q.gap, Q.width - leftBank.p.w - leftBank.p.x - bw)
        } else {
          Q.gap = Math.max(MIN_GAP, Math.floor(Math.random() * (Q.width - leftBank.p.w - leftBank.p.x - bw)))
        }
        tempBank = new Q.Bank({
          x: rightBank.p.x + rightBank.p.w + Q.gap,
          w: bw, 
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
          lBank: leftBank,
          rBank: rightBank
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
            dx: Q.width / 2 - 94, dy: 295,
            dw: 188, dh:  40
          } 
        ]
      });

      stage.insert(screen)

      stage.bind('share', function() {
        WeiXin.shareTitle = "[小黄人过河]游戏, 想不想知道你有多6? 想自虐吗? 来挑战吧!"
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
            dx: Q.width / 2 - 94, dy: 270,
            dw: 188, dh:  40
          } 
        ]
      });

      stage.insert(screen)

      stage.bind('replay', function() {
        Q.stageScene('game')
      })
      stage.bind('show', function() {
        WeiXin.shareTitle = "我在[小黄人过河]游戏中怒砍" + Q.points + "分, 6到没朋友! you can? you up!"
        showShareMask()
      })
    }));

    Q.stageScene('start')
  }

  Q.load(['sprites.png', 'background.jpg'], loadCallback, {
    progressCallback: function(loaded, total) {
      if(loaded <= total) {
        var ctx = Q.ctx
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.font = 'normal 16px "微软雅黑" Arial'
        ctx.fillText('loading...', Q.width / 2, Q.height / 2)
      }
    }
  })
})