
Vue.component('progress-status', {
	template: '#progress-status',
	props: [
		'message'
	]
});

Vue.component('new-level-form', {
	template: '#new-level-form',
	data: function() {
		return {
			name: ''
		};
	},
	methods: {
		commit: function() {
			this.$emit('commit', this.name);
			this.name = '';
		}
	}
});

var app = new Vue({
	el: ".main-deck",
	data: {
		levels: [],
		activeLevel: { name: '' },
		status: ''
	},
	methods: {
		init: function() {
			console.log("Init menu");
			this.status = "Loading levels...";
			this.$http.post("/api", { action: 'list' }).then(response => {
				this.status = '';
				let list = response.body.list;
				this.levels = list.map(x => { return { name: x }; });
				this.loadLevel();
			});
		},
		saveLevel: function() {
			this.status = 'Saving level...';
			let name = this.activeLevel.name;
			this.$http.post('/api', { action: 'save', name: name, data: { title: name } }).then(response => {
				this.activeLevel.name = name;
				this.status = '';
			});
		},
		resetLevel: function() {
			this.loadLevel(this.activeLevel.name);
		},
		deleteLevel: function() {
			this.status = 'Deleting level...';
			let name = this.activeLevel.name;
			this.$http.post('/api', { action: 'delete', name: name }).then(response => {
				this.levels = this.levels.filter(x => x.name != name);
				this.loadLevel();
				this.status = '';
			});
		},
		loadLevel: function(name) {
			if(!this.levels.length || this.activeLevel.name == name) {
				this.status = '';
				return;
			}
			if(!name && this.levels.length) {
				name = this.levels[0].name;
			}
			this.status = 'Loading level...';
			this.$http.post('/api', { action: 'get', name: name }).then(response => {
				let data = response.body.level;
				this.activeLevel.name = data.name;
				// pass data to editor
				this.$refs.editor.setLevelData(data.level);
				this.status = '';
			});
		},
		createLevel: function(name) {
			this.status = 'Creating level...';
			this.$http.post('/api', { name: name, action: 'create' }).then(response => {
				this.levels.push({
					name: name
				});
				this.status = '';
				this.loadLevel(name);
			});
		}
	},
	created: function() {
		this.init();
	}
});
