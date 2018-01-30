const Rect = function(x, y, w, h) {
	x = x || 0;
	y = y || 0;
	w = w || 0;
	h = h || 0;
	this.left = x - w / 2;
	this.right = x + w / 2;
	this.top = y - h / 2;
	this.bottom = y + h / 2;
	this.width = w;
	this.height = h;
}

Rect.prototype.update = function (size, position, scale) {
	let w2 = size.width / (2 * scale.x);
	let h2 = size.height / (2 * scale.y);
	this.left = position.x - w2;
	this.right = position.x + w2;
	this.top = position.y - h2;
	this.bottom = position.y + h2;
	this.width = 2 * w2;
	this.height = 2 * h2;
}

Rect.prototype.contains = function (x, y) {
	return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
}

Vue.component('editor-viewport', {
	template: '#editor-viewport',
	data: function() {
		return {
			context: null,
			position: { // units
				x: 0,
				y: 0
			},
			zoom: 10,
			maxZoom: 20,
			minZoom: 1,
			zoomScale: {
				x: 1,
				y: 1
			},
			scale: {
				x: 1,
				y: 1
			},
			viewport: new Rect(), // units
			size: { // pixels
				width: 0,
				height: 0
			},
			cursorPosition: { // pixels
				x: 0,
				y: 0
			},
			prevCursorPosition: { // pixels
				x: 0,
				y: 0
			},
			cursorDelta: { // pixels
				x: 0,
				y: 0
			},
			mouseDown: false
		}
	},
	methods: {
		updateSize: function() {
			this.size.width = this.$refs.screen.offsetWidth;
			this.size.height = this.$refs.screen.offsetHeight;
			this.updateViewport();

			this.$refs.canvas.width = this.size.width
			this.$refs.canvas.height = this.size.height;

			this.needRedraw();
		},
		updateViewport: function() {
			this.viewport.update(this.size, this.position, this.zoomScale);
			this.scale.x = this.size.width / this.viewport.width;
			this.scale.y = this.size.height / this.viewport.height;
		},
		addZoom: function(step) {
			this.zoom += step;
			if(this.zoom > this.maxZoom) this.zoom = this.maxZoom;
			if(this.zoom < this.minZoom) this.zoom = this.minZoom;
			this.zoomScale.x = this.zoomScale.y = this.zoom * this.zoom / 100;
			this.updateViewport();
			this.needRedraw();
		},
		resetViewport: function() {
			this.position.x = 0;
			this.position.y = 0;
			this.zoom = (this.maxZoom + this.minZoom) / 2 | 0;
			this.zoomScale.x = this.zoomScale.y = this.zoom * this.zoom / 100;
			this.updateViewport();
			this.needRedraw();
		},
		contains: function(x, y) {
			return this.viewport.contains(x, y);
		},
		needRedraw: function() {
			this.$emit("render");
		},

		clear: function(color) {
			let ctx = this.context;
			ctx.fillStyle = color || "#aaa";
			ctx.fillRect(0, 0, this.size.width, this.size.height);
		},
		beginPath: function() {
			this.context.beginPath();
		},
		stroke: function() {
			this.context.stroke();
		},
		moveTo: function(x, y) {
			x = this.getX(x);
			y = this.getY(y);
			this.context.moveTo(x, y);
		},
		lineTo: function(x, y) {
			x = this.getX(x);
			y = this.getY(y);
			this.context.lineTo(x, y);
		},
		strokeRect: function(x, y, w, h, local) {
			x = this.getX(x);
			y = this.getY(y);
			if(local) {
				w = w / this.scale.x;
				h = h / this.scale.y;
			}
			this.context.strokeRect(x, y, w, h);
		},

		getX: function(x) {
			return this.scale.x * (x - this.position.x) + this.size.width / 2;
		},
		getY: function(y) {
			return this.scale.y * (y - this.position.y) + this.size.height / 2;
		},
		screenToWorldX: function (x) {
			return this.viewport.left + (x / this.size.width) * this.viewport.width;
		},
		screenToWorldY: function (y) {
			return this.viewport.top + (y / this.size.height) * this.viewport.height;
		},

		onMouseMove: function(event) {
			//console.log(event);
			let x = event.offsetX;
			let y = event.offsetY;

			this.prevCursorPosition.x = this.cursorPosition.x;
			this.prevCursorPosition.y = this.cursorPosition.y;

			this.cursorPosition.x = x;
			this.cursorPosition.y = y;

			this.cursorDelta.x = x - this.prevCursorPosition.x;
			this.cursorDelta.y = y - this.prevCursorPosition.y;

			if(this.mouseDown) {
				this.position.x -= this.cursorDelta.x / this.scale.x;
				this.position.y -= this.cursorDelta.y / this.scale.y;
				this.updateViewport();
				this.needRedraw();
			}
		},
		onMouseDown: function(event) {
			this.mouseDown = true;
			//console.log(event);
			let x = event.offsetX;
			let y = event.offsetY;
			this.cursorPosition.x = this.prevCursorPosition.x = x;
			this.cursorPosition.y = this.prevCursorPosition.y = y;
			this.$emit("mousedown", {
				screenX: x,
				screenY: y,
				x: this.screenToWorldX(x),
				y: this.screenToWorldY(y)
			});
		},
		onMouseUp: function(event) {
			this.mouseDown = false;
			console.log(event);
			this.$emit("mouseup", {
				screenX: event.offsetX,
				screenY: event.offsetY,
				x: this.screenToWorldX(event.offsetX),
				y: this.screenToWorldY(event.offsetY)
			});
		}
	},
	mounted: function() {
		this.context = this.$refs.canvas.getContext("2d");
		this.updateSize();

		this.clear("#aaa");

		console.log("Viewport mounted");
		
		window.addEventListener("resize", e => {
			this.updateSize();
		});

		this.$refs.canvas.addEventListener("mousemove", e => {
			this.onMouseMove(e);
		});
		this.$refs.canvas.addEventListener("mousedown", e => {
			this.onMouseDown(e);
		});
		this.$refs.canvas.addEventListener("mouseup", e => {
			this.onMouseUp(e);
		});
	}
});