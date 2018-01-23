
(function() {

	const UNIT = 20; // px

	const Transform = function() {
		this.x = 0;
		this.y = 0;
		this.scale = 1;
		this.rotation = 0;
	}

	Transform.prototype.applyContenxt = function (ctx) {
		ctx.resetTransform();
		ctx.scate(this.scale, -this.scale);
		ctx.rotate(this.rotation);
		ctx.translate(this.x, this.y);
	}

	const Rect = function() {
		this.left = 0;
		this.right = 0;
		this.top = 0;
		this.bottom = 0;
		this.width = 0;
		this.height = 0;
	}

	Rect.prototype.update = function (w, h, x, y, scale) {
		let w2 = w / (2 * scale);
		let h2 = h / (2 * scale);
		this.left = x - w2;
		this.right = x + w2;
		this.top = y - h2;
		this.bottom = y + h2;
		this.width = 2 * w2;
		this.height = 2 * h2;
	}

	Vue.component('level-editor', {
		template: '#level-editor',
		data: function() {
			return {
				context: null,
				screenWidth: 0,
				screenHeight: 0,
				camera: new Transform(),
				viewport: new Rect()
			};
		},
		methods: {
			updateSize: function() {
				this.screenWidth = this.$refs.screen.offsetWidth;
				this.screenHeight = this.$refs.screen.offsetHeight;
				this.$refs.canvas.width = this.screenWidth
				this.$refs.canvas.height = this.screenHeight;
			},
			draw: function() {
				if(!this.context) {
					return;
				}

				let ctx = this.context;
				ctx.fillStyle = '#aaa';
				ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

				this.drawGrid();
			},		
			drawGrid: function() {
				let unit = UNIT * this.camera.scale;
				let count = this.viewport.width / UNIT;
				let offset = this.camera.x % UNIT;

				let ctx = this.context;

				ctx.strokeStyle = '#eee';
				ctx.lineWidth = 1;

				ctx.beginPath();
				for(let i=0; i<count; i++) {
					let x = offset + i * this.screenWidth / count;
					ctx.moveTo(x, 0);
					ctx.lineTo(x, this.screenHeight);
				}

				count = this.viewport.height / UNIT;
				offset = this.camera.y % UNIT;
				for(let i=0; i<count; i++) {
					let y = offset + i * this.screenHeight / count;
					ctx.moveTo(0, y);
					ctx.lineTo(this.screenWidth, y);
				}

				ctx.stroke();
			}
		},
		mounted: function() {
			this.context = this.$refs.canvas.getContext("2d");
			this.updateSize();
			this.camera.x = -this.screenWidth / 2;
			this.camera.y = -this.screenHeight / 2;
			this.viewport.update(this.screenWidth, this.screenHeight, this.camera.x, this.camera.y, this.camera.scale);
			this.draw();
		}
	});

})();