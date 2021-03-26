const SLIME_SIZE = 2, SLIME_SPEED = 2, SENSOR_SIZE = 5;

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

function sense(slime, offsetAngle, imgData) {
	let senseAngle = slime.angle + offsetAngle;
	let sensoryX = slime.x + Math.cos(senseAngle);
	let sensoryY = slime.y + Math.sin(senseAngle);

	let sum = 0;
	for(let offsetX = -SENSOR_SIZE; offsetX <= SENSOR_SIZE; offsetX++) {
		for(let offsetY = -SENSOR_SIZE; offsetY <= SENSOR_SIZE; offsetY++) {
			let posX = sensoryX + offsetX;
			let posY = sensoryY + offsetY;
			if(posX >= 0 && posX < WIDTH && posY >= 0 && posY < HEIGHT) {
				sum += getPixelAt(posX, posY, imgData);
			}
		}
	}
	return sum;
}