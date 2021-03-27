const SLIME_SIZE = 2, SLIME_SPEED = 2, SENSOR_SIZE = 5;

class Slime {
	constructor(x, y, angle, color) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.color = color;
	}
}

function getSlime() {
	let x = Math.random()*WIDTH;
	let y = Math.random()*HEIGHT;
	let angle = angleTo(x, y, WIDTH/2, HEIGHT/2);
	// Math.floor(Math.random()*16777215) // all colors
	// Math.floor(Math.random()*16777215/2) // blues
	// Math.floor(Math.random()*16777215/2+16777215/2) /// reds
	let color = Math.floor(Math.random()*16777215/2).toString(16); // https://css-tricks.com/snippets/javascript/random-hex-color/
	return new Slime(x, y, angle, color);
}

// https://math.stackexchange.com/q/707673/527418
function angleTo(x1, y1, x2, y2) {
	return Math.atan2(y2-y1,x2-x1);
}

function drawSlime(slime) {
	ctx.beginPath();
	ctx.rect(slime.x, slime.y, SLIME_SIZE, SLIME_SIZE);
	ctx.fillStyle = '#' + slime.color;
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