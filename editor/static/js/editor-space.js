
(function() {

	const UNIT = 20; // px

	const Transform = function() {
		this.x = 0;
		this.y = 0;
		this.scale = 1;
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

	const Renderer = function(context, viewport, camera) {
		this.context = context;
		this.viewport = viewport;
		this.camera = camera;
		this.update();
	}

	Renderer.prototype.update = function () {
		this.width = this.context.canvas.width;
		this.height = this.context.canvas.height;
		this.scaleX = this.width / this.viewport.width;
		this.scaleY = this.height / this.viewport.height;
	}

	Renderer.prototype.getX = function (x) {
		return this.scaleX * x - this.camera.x + this.width / 2;
	}

	Renderer.prototype.getY = function (y) {
		return this.scaleY * y - this.camera.y + this.height / 2;
	}

	Renderer.prototype.clear = function (color) {
		let ctx = this.context;
		ctx.fillStyle = color || "#aaa";
		ctx.fillRect(0, 0, this.width, this.height);
	}

	Renderer.prototype.beginPath = function () {
		this.context.beginPath();
	}

	Renderer.prototype.moveTo = function (x, y) {
		x = this.getX(x);
		y = this.getY(y);
		this.context.moveTo(x, y);
	}

	Renderer.prototype.lineTo = function (x, y) {
		x = this.getX(x);
		y = this.getY(y);
		this.context.lineTo(x, y);
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
				zoom: 10,
				camera: new Transform(),
				viewport: new Rect(),
				renderer: null
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
				this.renderer.update();

				this.renderer.clear();
				
				this.drawGrid();
			},		
			drawGrid: function() {

				let ctx = this.context;

				ctx.strokeStyle = '#eee';
				ctx.lineWidth = 1;

				let start = this.viewport.left / UNIT | 0;
				let end = this.viewport.right / UNIT | 0;

				ctx.beginPath();
				for(let i=start; i<=end; i++) {
					let x = i * UNIT;
					this.renderer.moveTo(x, this.viewport.top);
					this.renderer.lineTo(x, this.viewport.bottom);
				}

				start = this.viewport.top / UNIT | 0;
				end = this.viewport.bottom / UNIT | 0;
				for(let i=start; i<=end; i++) {
					let y = i * UNIT;
					this.renderer.moveTo(this.viewport.left, y);
					this.renderer.lineTo(this.viewport.right, y);
				}

				ctx.stroke();
			},
			addZoom: function(step) {
				this.zoom += step;
				this.camera.scale = this.zoom * this.zoom / 100;
				this.draw();
			},
			setLevelData: function(data) {
				console.log("Data set!");
			}
		},
		mounted: function() {
			this.context = this.$refs.canvas.getContext("2d");
			this.renderer = new Renderer(this.context, this.viewport, this.camera);
			this.updateSize();
			this.draw();
		}
	});

})();