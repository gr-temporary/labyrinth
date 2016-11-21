
function generateId() {
	var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var id = "";
	for(var i=0; i<16; i++) {
		id += chars.charAt(Math.random() * chars.length | 0);
	}
	return id;
}

function Room(params) {
	this.id = params.id || generateId();
	this.points = params.points || [];
	this.contents = params.contents || [];
	this.doors = params.doors || [];
}

function Door(params) {
	this.
}

function DoorPosition(params) {
	this.room = params.room;
	this.side = params.side;
	this.begin = params.begin;
	this.end = params.end;
}

DoorPosition.prototype.update = function() {
	var d = math.subtract(this.room.points[i + 1], this.room.points[i]);
	var l = math.norm(d);
	this.length = Math.abs(l * this.end - l * this.begin);	
}