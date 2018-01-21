
function generateId() {
	var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var id = "";
	for(var i=0; i<16; i++) {
		id += chars.charAt(Math.random() * chars.length | 0);
	}
	return id;
}

function Map() {
	this.rooms = {};
	this.doors = [];
}

Map.prototype.load = function(json) {
	
};

Map.prototype.build = function(startRoomId) {
	
}

function Room(params) {
	this.id = params.id || generateId();
	this.points = params.points || [];
	this.contents = params.contents || [];
	this.doors = params.doors || [];
}

Room.prototype.getAdjacent = function roomGetAdjacent() {
	var result = [];
	for(var door of this.doors) {
		result.push(door.getOpposite(this.id));
	}
	return result;
}

function Door(params) {
	this.rooms = params.rooms || [];
	this.positions = params.positions || [];
	this.closed = params.closed || false;

	// first is 1 -> 2, second is 2 -> 1
	this.transformations = [mat2d.create(), mat2d.create()];

	this.updateTransformations();
}

Door.prototype.updateTransformations = function doorUpdateTransformations() {
	var from = this.positions[0];
	var to = this.positions[1];

	var dx = from.beginPoint[0] - from.endPoint[0];
	var dy = from.beginPoint[1] - from.endPoint[1];
	var dx1 = to.beginPoint[0] - to.endPoint[0];
	var dy1 = to.beginPoint[1] - to.endPoint[1];

	/*
		A -B tx
		B  A ty
		0  0  1

		A(x1 - x1) - B(y1 - y2) = X1 - X2
		B(x1 - x2) + A(y1 - y2) = Y1 - Y2
		tx = X1 - A * x1 + B * y1
		ty = Y1 - B * x1 - A * y1
	*/
	var eqs = mat2.create();
	mat2.set(eqs, dx, -dy, dy, dx);
	mat2.invert(eqs, eqs);

	var b = vec2.create();
	vec2.set(b, dx1, dy1);

	/*
		b = [A, B]
	 */
	vec2.transformMat2(b, b, eqs);

	var tx = to.beginPoint[0] - b[0] * from.beginPoint[0] + b[1] * from.beginPoint[1];
	var ty = to.beginPoint[1] - b[0] * from.beginPoint[1] - b[1] * from.beginPoint[0];

	mat2d.set(this.transformations[0], b[0], b[1], -b[1], b[0], tx, ty);
	mat2d.invert(this.transformations[1], transformations[0]);
}

Door.prototype.getOpposite = function doorGetOpposite(roomId) {
	if(this.doors[0].id === roomId) {
		return this.doors[1];
	}
	if(this.doors[1].id === roomId) {
		return this.doors[0];
	}
	return null;
}

function DoorPosition(params) {
	this.room = params.room;
	this.side = params.side;
	this.begin = params.begin || 0.0;
	this.end = params.end || 1.0;

	this.length = 0;
	this.beginPoint = vec2.create();
	this.endPoint = vec2.create();

	this.update();
}

DoorPosition.prototype.update = function doorPositionUpdate() {
	var wallEnd = this.room.points[ (i + 1) % this.room.points.length ];
	var wallStart = this.room.points[i];
	var d = vec2.create();
	vec2.sub(d, wallEnd, wallStart);
	var l = vec2.len(d);
	this.length = Math.abs(l * this.end - l * this.begin);

	this.beginPoint = vec2.create();
	vec2.lerp(this.beginPoint, wallStart, wallEnd, this.begin);
	vec2.lerp(this.endPoint, wallStart, wallEnd, this.end);
}