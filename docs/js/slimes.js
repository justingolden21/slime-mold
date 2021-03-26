const SLIME_SIZE = 2, SLIME_SPEED = 3;

class Slime {
	constructor(x, y, angle) {
		this.x = x;
		this.y = y;
		this.angle = angle;
	}
}

function getSlime() {
	let x = Math.random()*WIDTH;
	let y = Math.random()*HEIGHT;
	let angle = Math.random()*2*Math.PI;
	return new Slime(x, y, angle);
}

function drawSlime(slime) {
	ctx.beginPath();
	ctx.rect(slime.x, slime.y, SLIME_SIZE, SLIME_SIZE);
	ctx.fillStyle = 'limegreen';
	ctx.fill();
}