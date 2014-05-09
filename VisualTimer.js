"use strict";

function VisualTimer(opts) {
	this.type = 'down';
	if (opts.type) {
		this.type = opts.type;
	}
	this.totalTime = opts.seconds || 30;
	this.onFinish = opts.onFinish;
	var key = 'timer';
	if (opts.key) {
		key = opts.key;
	}
	this.context = this;
	if (opts.context) {
		this.context = opts.context;
	}
	opts.game.add.sprite(opts.x, opts.y, key, 1);
	this.sprite = opts.game.add.sprite(opts.x, opts.y, key, 0);
	this.reset();
	this.fullWidth = this.sprite.width;
}

VisualTimer.prototype = {
	reset: function() {
		// the remaining time of the current counter
		this.gameTime = (this.type == 'down') ? this.totalTime : 0;
		clearInterval(this.gameTick);
		this.sprite.crop(null);
	},

	start: function() {
		var rect = new Phaser.Rectangle(0, 0, this.sprite.width, this.sprite.height)
			,self = this
			;
		this.gameTick = setInterval(function() {
			if (self.type == 'down') {
				self.gameTime--;
			} else {
				self.gameTime++;
			}
			if ((self.gameTime >= 0 && self.type == 'down') || (self.gameTime <= self.totalTime && self.type == 'up')) {
				rect.width = Math.floor((self.gameTime / self.totalTime) * self.fullWidth);
				self.sprite.crop(rect);
			}
			if ((self.gameTime <= 0 && self.type == 'down') || (self.gameTime >= self.totalTime && self.type == 'up')) {
				clearInterval(self.gameTick);
				if (self.onFinish) {
					self.onFinish.call(self.context);
				}
			}
		}, 1000);
	},

	stop: function() {
		this.reset();
	},

	pause: function() {
		clearInterval(this.gameTick);
	},

	resume: function() {
		this.start();
	},

	remainingTime: function() {
		return this.gameTime;
	}
};

module.exports = VisualTimer;