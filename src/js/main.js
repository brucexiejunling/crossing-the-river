$(function() {
	function setupInputs() {
    Q.el.on('touchstart mousedown', function(e) {
      var event = e.originalEvent
      var trigger = true
      var hasTouch = !!('ontouchstart' in window)
      if(hasTouch) {
        var touches = event.touches
        for(i=0,len=touches.length;i<len;i++) {
          var tch = touches[i];
          var pos = touchLocation(tch)
          if(pos.x >= Q.width / 2 - 25 && pos.x <= Q.width / 2 + 25
            && pos.y >= Q.height - 50 && pos.y <= Q.height && Q.bananas >= Q.bananaLevel) {
            trigger = false
            break;
          }
        }
      }
      if(trigger && !Q.useBanana) {
        Q.stage().trigger('press-down')
      }
      event.preventDefault()
    })
	  Q.el.on('touchend touchcancel mouseup', function(event) {
      touchDispatch(event.originalEvent)
      event.preventDefault()
      if(!Q.useBanana) {
        Q.stage().trigger('press-up')
      } 
      if(Q.man) {
        Q.man.trigger('press-up')
      }
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
        if(pos.x >= Q.width / 2 - 25 && pos.x <= Q.width / 2 + 25
          && pos.y >= Q.height - 50 && pos.y <= Q.height) {
          if(!Q.useBanana && Q.bananas >= Q.bananaLevel
            && !Q.bridgeScale && !Q.manMove && !Q.bankMove) {
            Q.useBanana = true
            Q.bananas -= Q.bananaLevel
            if(Q.bananaLevel < 5) {
              Q.bananaLevel++
            }
            Q.skillTips = true
            Q.stage().trigger('use-banana')
            $('#big-banana').css('display', 'block').addClass('fadeInAndOut')
            setTimeout(function() {
              $('#big-banana').css('display', 'none').removeClass('fadeInAndOut')
            }, 600)
            playAudio('banana1') 
            break;
          }
        }
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

  $('#confirm').on('touchend mouseup', function(event) {
    event.preventDefault()
    event.stopPropagation()
    $('#instruction').fadeOut(200)
  });

  function showBonus() {
    $('#bonus').css('display', 'block').addClass('fadeInAndOut')
    Q.points++
    setTimeout(function() {
      $('#bonus').css('display', 'none').removeClass('fadeInAndOut')
    }, 600)
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
    event.preventDefault()
    $('#mask').css('display', 'none').off('mouseup touchend', hideShareMask)
  }

  function playAudio(name) {
    if(Q.assets[name] && Q.assets[name].play) {
      Q.assets[name].currentTime = 0
      Q.assets[name].volume = 1
      Q.assets[name].play()
    }
  }

  function stopAudio(name) {
    if(Q.assets[name] && Q.assets[name].pause) {
      Q.assets[name].pause()
      Q.assets[name].currentTime = 0
    }
  }

  function gameOver() {
    playAudio('banana3')
    Q.manMove = false
    Q.bankMove = false
    Q.useBanana = false
    Q.skillTips = false
    Q.bananaLevel = 2
    Q.el.addClass('bounce')
    setTimeout(function() {
      Q.el.removeClass('bounce')
      Q.stageScene('over')
    }, 1200)
  }

  var BRIDGE_WIDTH = 3, BANK_HEIGHT = 180, MIN_BANK_OFFSET = 60,
      MIN_BANK_WIDTH = 10, MAX_BANK_WIDTH = 90, MIN_GAP = 15, MOVE_SPEED = 500;
	var Q = window.Q = Quintus().
                    include('Sprites, Scenes, Screen').
                    setup('', {maximize: true});

  var bankWidths = {
    's': [15, 20, 25],
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
  Q.bananas = 0;
  Q.delay = 0.3;
  Q.bananaLevel = 2

  Q.Bridge = Q.Rectangle.extend({
    init: function(props) {
      Q.bridgeScale = false
      this._super(_.extend({
        w: BRIDGE_WIDTH,
        y: Q.height - BANK_HEIGHT,
        z: 3,
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
      if(p.type !== 'banana-bridge')  {
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
          if(p.w + p.x > p.bonusPoint.p.x 
            && p.w + p.x < p.bonusPoint.p.x + p.bonusPoint.p.w) {
            playAudio('bonus')
            showBonus()
            p.bonusPoint.destroy()
          }
          if(p.w + p.x > p.rBank.p.x 
            && p.w + p.x < p.rBank.p.w + p.rBank.p.x) {
            Q.moveToX = p.rBank.p.w + p.rBank.p.x
            Q.pass = true
          } else if(p.w + p.x <= p.rBank.p.x
            || p.w + p.x >= p.rBank.p.w + p.rBank.p.x) {
            Q.moveToX = p.lBank.p.w + p.lBank.p.x + p.w + 20
            Q.pass = false
          }
        }

      }

      if(Q.bankMove && (p.rotated || p.type === 'banana-bridge') 
        && p.x + p.w > 0) {
        p.x -= MOVE_SPEED * dt
      } else if(Q.bankMove && (p.rotated || p.type === 'banana-bridge')) {
        this.destroy()
      }

      // 解决桥的移动慢于桥墩而引起的短缺
      if(Q.pass && (p.moved || p.type === 'banana-bridge') 
        && !Q.manMove && p.x + p.w < p.rBank.p.x) {
        p.x = p.rBank.p.x - p.w + 5
      }

    },

    draw: function(ctx) {
      if(!ctx) {
        ctx = Q.ctx
      }
      var p = this.p
      if(p.type !== 'banana-bridge') {
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
        z: 1,
        w: MIN_BANK_WIDTH,
        h: BANK_HEIGHT,
        type: ''
      }, props || {}));
    },

    step: function(dt) {
      var p = this.p
      if(Q.bankMove) {
        if(p.type === 'right') {
          if(p.x + p.w > MIN_BANK_OFFSET) {
            p.x -= MOVE_SPEED * dt
          } else {
            Q.bankMove = false
            Q.stage().trigger('bank-move-stop')
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

  Q.Banana = Q.Sprite.extend({
    init: function(props) {
      this._super(_.extend({
        sheet: 'banana1', y: Q.height - BANK_HEIGHT + 3, z: 1,
        w: 20, h: 15, r: 1, k: 1
      }, props))
    },

    step: function(dt) {
      if(this.p.sheet === 'banana1') {
        if(Q.bankMove) {
          this.p.x -= MOVE_SPEED * dt
        }
        if(this.p.x + this.p.w < 0) {
          this.destroy()
        }
      } else if(Q.bananas >= Q.bananaLevel) {
        this.p.r += 0.005 * this.p.k
        if(this.p.r >= 1.1) {
          this.p.k = -1
        }
        if(this.p.r <= 1) {
          this.p.k = 1
        }
      }
    },

    draw: function(ctx) {
      if(!ctx) {
        ctx = Q.ctx
      }
      if(this.p.sheet === 'banana1') {
        this._super(ctx)
      } else if(Q.bananas >= Q.bananaLevel) {
        ctx.save()
        if(!Q.skillTips) {
          ctx.fillStyle = "#000"
          ctx.textAlign = 'center'
          ctx.font = "normal 18px '微软雅黑' Arial"
          ctx.fillText('点击闪动的香蕉有惊喜噢', Q.width/2, Q.height/2 - Q.height/8)
        }
        ctx.drawImage(Q.asset('sprites.png'),
                    5, 240, 60, 45,
                    this.p.x, this.p.y,
                    this.p.w * this.p.r, this.p.h * this.p.r);
        ctx.restore()
      } else {
        this._super(ctx)
      }
    }
  })

  Q.BonusPoint = Q.Rectangle.extend({
    init: function(props) {
      this._super(_.extend({
        y: Q.height - BANK_HEIGHT,
        z: 2,
        w: 8,
        h: 5,
        color: '#D21414'
      }, props || {}));
    }, 

    step: function(dt) {
      var p = this.p
      if(Q.bankMove) {
        p.x -= MOVE_SPEED * dt
      }
      if(p.x < p.bank.p.x) {
        p.x = p.bank.p.x + 1
      }
      if(p.x + p.w > p.bank.p.x + p.bank.p.w) {
        p.x = p.bank.p.x + p.bank.p.w - p.w
      }
      if(p.x + p.w <= 0) {
        this.destroy()
      }
    }
  });

  Q.Man = Q.Sprite.extend({
    init: function(props) {
      this._super(_(props).extend({
       sheet: 'man', speed: 180, frameCount: 0, z: 4, 
       headStand: false, waitTime: 0, fall: false
      }));

      var p = this.p
      this.bind('press-up', function() {
        if(Q.manMove && p.waitTime > Q.delay) {
          if((p.x > Q.leftBank.p.x && p.x + p.w / 2 < Q.rightBank.p.x ||
          p.x > Q.rightBank.p.x + Q.rightBank.p.w) && !p.fall) {
            Q.headStandTips = true
            p.headStand = !p.headStand
          }
        }
      })
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
        if(p.x + 20 > MIN_BANK_OFFSET) {
          p.x -= MOVE_SPEED * dt
        } 
      }      

      if(Q.manMove) {
        if(p.waitTime >= Q.delay) {
          p.frameCount = (p.frameCount + 1) % 21
          p.frame = 4 + Math.floor(p.frameCount / 4)

          // 与banana的碰撞检测
          if(p.headStand && Q.banana 
            && !(p.x + p.w / 2 <= Q.banana.p.x || p.x > Q.banana.p.x + Q.banana.p.w)) {
            Q.bananas++
            Q.banana.destroy()
            Q.banana = null
          }

          if(p.x + 20 < Q.moveToX && p.x < Q.width) {
            if(p.headStand) {
              if(!((p.x > Q.leftBank.p.x && p.x + p.w / 2 < Q.rightBank.p.x) ||
               p.x > Q.rightBank.p.x)) {
                if(p.y > 0) {
                  p.fall = true
                  p.y -= 800 * dt
                } else {
                  gameOver()
                }
              } else {
                p.x += p.speed * dt
              }
            } else {
              p.x += p.speed * dt
            }
          } else if(!Q.pass){
            if(p.headStand) {
              if(p.y > 0) {
                p.fall = true
                p.y -= 800 * dt
              } else {
                gameOver()
              }
            } else {
              if(p.y < Q.height) {
                p.fall = true
                p.y += 800 * dt
              } else {
                gameOver()
              }
            }
          } else if(!p.headStand) {
            playAudio('pass')
            p.waitTime = 0
            Q.manMove = false
            Q.bankMove = true
            Q.useBanana = false
            Q.points += 1
            Q.stage().trigger('build-bank')
          }         
        } else {
          p.waitTime += dt
        }
      }
    },

    draw: function(ctx) {
      if(!ctx) {
        ctx = Q.ctx
      }
      var p = this.p
      if(p.headStand) {
        ctx.save()
        ctx.translate(p.x, Q.height - BANK_HEIGHT)
        ctx.rotate(Math.PI)
        ctx.scale(-1, 1)
        ctx.translate(-p.x, BANK_HEIGHT - Q.height)
        this._super(ctx)
        ctx.restore()
      } else {
        this._super(ctx)
      }
    }
  });

  Q.GamePoints = Q.GameObject.extend({
    init: function(props) {
      Q.points = 0
      Q.bananas = 0
      this.p = _({ 
        x1: Q.width / 2,
        y1: 50,
        x2: Q.width / 2 + 30,
        y2: Q.height - 10,
        z: 2
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
      ctx.fillText(Q.points + '', this.p.x1, this.p.y1)
      ctx.restore()

      ctx.save()
      ctx.fillStyle = "#fff"
      ctx.textAlign = "center"
      ctx.font = "bold 20px '微软雅黑' Arial"
      ctx.fillText(Q.bananas + '', this.p.x2, this.p.y2)
      ctx.restore()

    }
  })

  Q.assets['sprites.json'] = {
    "man": {
      "sx": 0,"sy":0,"cols":10,"sw":40,"sh":55, "dw": 20, "dh": 27.5, "frames":10
    },
    "banana1": {
      "sx": 5, "sy": 240, "clos": 1, "sw": 60, "sh": 45, "dw": 20, "dh": 15, "frames": 1
    },
    "banana2": {
      "sx": 5, "sy": 240, "clos": 1, "sw": 60, "sh": 45, "dw": 40, "dh": 30, "frames": 1
    }    
  }

  function loadCallback() {
    var flag = false, $body = $('body')

    Q.backgrounds = [
      {x: 0, y: 0, w: 400, h: 535, style: '#FFF1F1'},
      {x: 405, y: 0, w: 400, h: 535, style: '#3D89FD'},
      {x: 810, y: 0, w: 400, h: 535, style: '#C7F0FF'},
    ]
    Q.bgIndex = 2

    Q.compileSheets('sprites.png', 'sprites.json')

    Q.scene('game', new Q.Scene(function(stage) {
      Q.currentScene = 'game'
      // 设置游戏背景
      if(flag) {
        Q.bgIndex = (Q.bgIndex + 1) % 3
        $body.css('background', Q.backgrounds[Q.bgIndex].style)
      } else {
        flag = true
      }

      // banana counter
      Q.bananas = 0

      var instruction = new Q.Screen({
        titles: [
          {
            text: '按住屏幕使棍子变长, 搭中红点+1分', 
            type: 'instruction',
            style: '#000',
            font: 'normal 18px "微软雅黑" Arial',
            x: Q.width / 2, y: Q.height / 2 - Q.height / 4
          }
        ]
      })

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

      Q.leftBank = leftBank
      Q.rightBank = rightBank

      var bonusPoint = new Q.BonusPoint({
        x: Math.random() * (rightBank.p.w - 8) + rightBank.p.x,
        bank: rightBank
      })

      var bridge = new Q.Bridge({
        x: leftBank.p.w + leftBank.p.x - BRIDGE_WIDTH, 
        lBank: leftBank,
        rBank: rightBank,
        bonusPoint: bonusPoint
      });

      if(Q.gap > 25) {
        var banana = new Q.Banana({
          x: leftBank.p.x + leftBank.p.w + Math.random() * (Q.gap - 25)
        })
        Q.banana = banana
        stage.insert(banana)
      }

      stage.insert(instruction)
      stage.insert(leftBank)
      stage.insert(rightBank)
      stage.insert(bonusPoint)
      stage.insert(bridge)
      stage.insert(new Q.Banana({
        x: Q.width / 2 - 20, 
        y: Q.height - 40,
        z: 2, w: 40, h: 30,
        sheet: 'banana2'
      }))

      Q.man = new Q.Man({
        x: leftBank.p.w + leftBank.p.x - 20, 
        y: Q.height - BANK_HEIGHT - 27, 
        frame: 0
      })
      stage.insert(Q.man);
      
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

        Q.leftBank = Q.rightBank
        Q.rightBank = tempBank
      })

      stage.bind('bank-move-stop', function() {
        leftBank = rightBank
        leftBank.setType('left')
        rightBank = tempBank

        bonusPoint = new Q.BonusPoint({
          x: Math.random() * (rightBank.p.w - 8) + rightBank.p.x,
          bank:rightBank 
        });

        var gap = rightBank.p.x - leftBank.p.x - leftBank.p.w
        if(gap > 25 && Math.random() <= 0.6) {
          var banana = new Q.Banana({
            x: leftBank.p.x + leftBank.p.w + Math.random() * (gap - 25)
          })
          Q.banana = banana
          stage.insert(banana)
        }

        bridge = new Q.Bridge({
          x: leftBank.p.w + leftBank.p.x - BRIDGE_WIDTH,
          lBank: leftBank,
          rBank: rightBank,
          bonusPoint: bonusPoint
        });

        stage.insert(bridge)
        stage.insert(bonusPoint)
      })

      stage.bind('press-down', function() {
        Q.down = true
        Q.up = false
      })

      stage.bind('press-up', function() {
        Q.down = false
        Q.up = true
      })

      stage.bind('use-banana', function() {
        if(bridge && bridge.destroy) {
          bridge.destroy()
        }
        bridge = new Q.Bridge({
          x: leftBank.p.w + leftBank.p.x,
          z: 0,
          w: rightBank.p.x - leftBank.p.x - leftBank.p.w,
          h: 3,
          type: 'banana-bridge',
          color: '#E9FF22',
          lBank: leftBank,
          rBank: rightBank
        });
        this.insert(bridge)
        Q.moveToX = rightBank.p.w + rightBank.p.x
        Q.pass = true
        Q.manMove = true
      });
    }));

    Q.scene('start', new Q.Scene(function(stage) {
      Q.currentScene = 'start'
      var screen = new Q.Screen({
        titles: [
          {
            text: 'Author: bruceTse. Inspired by [Stick Hero]',
            style: '#444',
            font: 'normal 14px "微软雅黑" Arial',
            x: Q.width / 2,
            y: Q.height - 10
          }
        ],
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
            name: 'start-instruction',
            sx: 236, sy: 242, sw: 188, sh: 40,
            dx: Q.width / 2 - 94, dy: 225,
            dw: 188, dh:  41
          },
          {
            asset: Q.asset('sprites.png'),
            name: 'start',
            sx: 236, sy: 60, sw: 188, sh: 41,
            dx: Q.width / 2 - 94, dy: 275,
            dw: 188, dh:  41
          },
          {
            asset: Q.asset('sprites.png'),
            name: 'share',
            sx: 236, sy: 108, sw: 188, sh: 40,
            dx: Q.width / 2 - 94, dy: 335,
            dw: 188, dh:  40
          } 
        ]
      });

      stage.insert(screen)

      stage.bind('start-instruction', function() {
        var $ins = $('#instruction')
        $ins.css({top: Q.height / 2 - $ins.height() / 2}).fadeIn()
      })

      stage.bind('share', function() {
        WeiXin.shareTitle = "[Banana版小黄人过河]重磅来袭! 更有趣更刺激! 原谅我不羁放纵爱自虐~"
        showShareMask()
      })

      stage.bind('start', function() {
        Q.stageScene('game')
      })
    }));

    Q.scene('over', new Q.Scene(function(stage) {
      Q.currentScene = 'over'
      var screen = new Q.Screen({
        titles: [
          {
            text: 'no zuo no die',
            style: '#000',
            font: 'bold 40px "微软雅黑" Arial',
            x: Q.width / 2,
            y: 100
          },

          {
            text: '分数: ' + Q.points,
            style: '#000',
            font: 'bold 40px "微软雅黑" Arial',
            x: Q.width / 2,
            y: 150
          },

          {
            text: 'Author: bruceTse. Inspired by [Stick Hero]',
            style: '#444',
            font: 'normal 14px "微软雅黑" Arial',
            x: Q.width / 2,
            y: Q.height - 10
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
          },
          {
            asset: Q.asset('sprites.png'),
            name: 'over-instruction',
            sx: 236, sy: 242, sw: 188, sh: 40,
            dx: Q.width / 2 - 94, dy: 340,
            dw: 188, dh:  41
          }
        ]
      });

      stage.insert(screen)

      stage.bind('replay', function() {
        Q.stageScene('game')
      })
      stage.bind('show', function() {
        WeiXin.shareTitle = '我在[Banana版小黄人过河]游戏中怒砍' + Q.points + '分! 6到没朋友! 不服来战!'
        showShareMask()
      })
      stage.bind('over-instruction', function() {
        var $ins = $('#instruction')
        $ins.css({top: Q.height / 2 - $ins.height() / 2}).fadeIn()
      })
    }));

    Q.stageScene('start')
  }

  var assets = [
    'sprites.png', 'background.jpg',
    'banana1.wav', 'banana1.mp3',
    'banana3.wav', 'banana3.mp3',
    'pass.wav', 'pass.mp3', 'bonus.wav', 'bonus.mp3'
  ]
  Q.load(assets, loadCallback, {
    progressCallback: function(loaded, total) {
      if(loaded <= total) {
        Q.clear()
        var ctx = Q.ctx
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.font = 'normal 25px "微软雅黑" Arial'
        ctx.fillText('拼命加载中...', Q.width / 2, Q.height / 2)
        ctx.fillStyle = "#666"
        ctx.font = 'normal 18px "微软雅黑" Arial'
        ctx.fillText('新版本新玩法, 记得看游戏说明噢~', Q.width / 2, Q.height / 2 + 60)
        ctx.fillText('虐己不如虐人, 叫上小伙伴们一起玩吧!', Q.width / 2, Q.height / 2 + 90)
      }
    }
  })
})