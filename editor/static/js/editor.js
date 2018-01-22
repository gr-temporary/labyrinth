

Vue.component('menu-column', {
	template: "#menu-column",
	data: function () {
		return { 
			levels: [],
			activeLevel: {
				name: ''
			}
		}
	},
	methods: {
		init: function() {
			console.log("Init menu");
			this.$http.post("/api", { action: 'list' }).then(response => {
				let list = response.body.list;
				this.levels = list.map(x => { name: x });
				if(this.levels.length) {
					this.loadLevel();
				}
			});
		},
		saveLevel: function() {
			let name = this.activeLevel.name;
			this.$http.post('/api', { action: 'save', name: name, data: { title: name } }).then(response => {
				this.activeLevel = {
					name: name
				};
				alert("Saved!");
			});
		},
		resetLevel: function() {
			this.loadLevel(this.activeLevel.name);
		},
		deleteLevel: function() {
			let name = this.activeLevel.name;
			this.$http.post('/api', { action: 'delete', name: name }).then(response => {

				alert("Deleted!");
			});
		},
		loadLevel: function(name) {
			if(!name && this.levels.length) {
				name = this.levels[0].name;
			}
			this.$http.post('/api', { action: 'get', name: name }).then(response => {
				let data = response.body;
				this.activeLevel = {
					name: name
				};

			});
		},
		createLevel: function() {

		}
	},
	created: function() {
		this.init();
	}
});

var app = new Vue({
	el: ".main-deck",
	data: {
		levelData: {}
	},
	methods: {

	}
});
