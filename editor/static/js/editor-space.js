
(function() {

	const UNIT = 20; // px
	const FREE = 0;
	const PANNING = 1;
	const HIGHLIGHT = 2;
	const MOVING = 3;

	const COLOR_SCHEME = {
		bg: "#094A5B",
		grid: "#86C2B4",
		text: "#F4E9C1",
		line: "#317174",
		fill: "#0F5672"
	};

	let leveldata = {
		rooms: {},
		doors: {}
	};

	Vue.component('level-editor', {
		template: '#level-editor',
		data: function() {
			return {
				renderer: null
			};
		},
		methods: {
			draw: function() {
				if(!this.renderer) {
					return;
				}

				this.renderer.clear(COLOR_SCHEME.bg);

				this.drawGrid();
			},
			drawGrid: function() {

				let ctx = this.renderer.context;
				let viewport = this.renderer.viewport;

				ctx.strokeStyle = COLOR_SCHEME.grid;
				ctx.lineWidth = 1;

				let start = viewport.left / UNIT | 0;
				let end = viewport.right / UNIT | 0;

				ctx.beginPath();
				for(let i=start; i<=end; i++) {
					let x = i * UNIT;
					this.renderer.moveTo(x, viewport.top);
					this.renderer.lineTo(x, viewport.bottom);
				}

				start = viewport.top / UNIT | 0;
				end = viewport.bottom / UNIT | 0;
				for(let i=start; i<=end; i++) {
					let y = i * UNIT;
					this.renderer.moveTo(viewport.left, y);
					this.renderer.lineTo(viewport.right, y);
				}

				ctx.stroke();

				// center lines
				ctx.lineWidth = 3;
				ctx.beginPath();
				this.renderer.moveTo(0, viewport.top);
				this.renderer.lineTo(0, viewport.bottom);
				this.renderer.moveTo(viewport.left, 0);
				this.renderer.lineTo(viewport.right, 0);
				ctx.stroke();
			},
			setLevelData: function(data) {
				console.log("Data set!");
			}
		},
		mounted: function() {
			this.renderer = this.$refs.viewport;

			console.log("Editor mounted");

			this.draw();
		}
	});

})();