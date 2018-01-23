
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

	let leveldata = {
		rooms: {},
		doors: {}
	};

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
				this.viewport.update(this.screenWidth, this.screenHeight, this.camera.x, this.camera.y, this.camera.scale);

				let ctx = this.context;
				ctx.fillStyle = '#aaa';
				ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

				this.drawGrid();
			},		
			drawGrid: function() {
				let unit = UNIT * this.camera.scale;

				let ctx = this.context;

				ctx.strokeStyle = '#eee';
				ctx.lineWidth = 1;

				let start = this.viewport.left / UNIT | 0;
				let end = this.viewport.right / UNIT | 0;
				let count = end - start;

				ctx.beginPath();
				for(let i=start; i<=end; i++) {
					let x = (i * UNIT / count - this.camera.x) * this.camera.scale;
					ctx.moveTo(x, 0);
					ctx.lineTo(x, this.screenHeight);
				}

				start = this.viewport.top / UNIT | 0;
				end = this.viewport.bottom / UNIT | 0;
				count = end - start;
				for(let i=start; i<=end; i++) {
					let y = (i * UNIT / count - this.camera.y) * this.camera.scale;
					ctx.moveTo(0, y);
					ctx.lineTo(this.screenWidth, y);
				}

				ctx.stroke();

				/*ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo()*/
			},
			addZoom: function(step) {
				this.camera.scale += step;
				this.draw();
			},
			setLevelData: function(data) {
				console.log("Data set!");
			}
		},
		mounted: function() {
			this.context = this.$refs.canvas.getContext("2d");
			this.updateSize();
			this.camera.x = -this.screenWidth / 2;
			this.camera.y = -this.screenHeight / 2;
			this.draw();
		}
	});

})();