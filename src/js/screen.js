Quintus.Screen = function(Q) {
  Q.buttons = []

	Q.Screen = Q.GameObject.extend({
    init: function(props) {
      this.p = _.extend({
        images: [],
      	titles: [],
      	buttons: []
      }, props || {});
      _.each(this.p.buttons, function(btn, index) {
        Q.buttons.push({
          name: btn.name,
          width: btn.dy, height: btn.dh,
          x: btn.dx, y: btn.dy
        })
      })
    },

    step: function(dt) {

    },

    draw: function(ctx) {
      if(!ctx) {
        ctx = Q.ctx
      }

      // statement
      var statement = "Author: bruceTse. Inspired by [Stick Hero]"
      ctx.fillStyle = "#444"
      ctx.textAlign = "center"
      ctx.font = "normal 14px '微软雅黑' Arial"
      ctx.fillText(statement, Q.width / 2, Q.height - 10)

      var p = this.p
      _.each(p.images, function(img, i) {
        ctx.drawImage(img.asset, img.sx, img.sy, img.sw, img.sh,
                      img.dx, img.dy, img.dw, img.dh);
      });

      ctx.fillStyle = '#000'
      ctx.font = "bold 40px '微软雅黑' Arial"
      ctx.textAlign = "center"
      _.each(p.titles, function(title, i) {
        ctx.fillText(title.text, title.x, title.y);
      });

    	_.each(p.buttons, function(btn, i) {
    		ctx.drawImage(btn.asset, btn.sx, btn.sy, btn.sw, btn.sh,
    									btn.dx, btn.dy, btn.dw, btn.dh);
    	});
    }
  });

  return Q
}