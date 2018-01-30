
(function() {

	const UNIT = 20; // px
	const FREE = 0;
	const PANNING = 1;
	const HIGHLIGHT = 2;
	const MOVING = 3;

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

				this.renderer.clear();

				this.drawGrid();
			},		
			drawGrid: function() {

				let ctx = this.renderer.context;
				let viewport = this.renderer.viewport;

				ctx.strokeStyle = '#eee';
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