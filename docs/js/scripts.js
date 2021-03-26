const WIDTH = 500,
HEIGHT = 500,
NUM_SLIME = 1000,
TICK_SPEED = 25,
BLUR_FACTOR = 0.98,
SENSOR_ANGLE = Math.PI/4
RANDOM_STEER_STRENGTH = 0.25,
TURN_SPEED = Math.PI/25
BLUR_AVERAGE = false;

let tick_interval;
let slimes = [];
let canvas, ctx;
let paused = false;

window.onload = ()=> {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for(let i=0; i<NUM_SLIME; i++) {
		slimes.push(getSlime());
	}

	tick_interval = setInterval(tick, TICK_SPEED);

	// UI stuff
	u('#copy-btn').first().onclick = ()=> {
		// https://stackoverflow.com/a/57546936/4907950
		canvas.toBlob(blob=> {
			const item = new ClipboardItem({'image/png': blob});
			navigator.clipboard.write([item]); 
		});
	};
	u('#download-btn').first().onclick = ()=> {
		// https://stackoverflow.com/a/50300880/4907950
		let link = document.createElement('a');
		link.download = 'slime_canvas.png';
		link.href = document.getElementById('canvas').toDataURL();
		link.click();
		link.remove();
	};

	// https://heroicons.dev/
	const pause = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
	const play = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
	u('#pause-btn').first().onclick = ()=> {

		paused = !paused;
		u('#pause-btn').html(paused ? play : pause);
		if(paused) {
			clearInterval(tick_interval);
		} else {
			tick_interval = setInterval(tick, TICK_SPEED);
		}
	};
	u('#pause-btn').html(pause);
};

function tick() {
	console.time('tick');
	ctx.globalAlpha = 0.75;

	for(let slime of slimes) {
		// move
		slime.x += Math.cos(slime.angle)*SLIME_SPEED;
		slime.y += Math.sin(slime.angle)*SLIME_SPEED;

		// check bounds
		if(slime.x > WIDTH) {
			slime.x = WIDTH;
			slime.angle = Math.random()*2*Math.PI;
		} else if(slime.x < 0) {
			slime.x = 0;
			slime.angle = Math.random()*2*Math.PI;
		}

		if(slime.y > HEIGHT) {
			slime.y = HEIGHT;
			slime.angle = Math.random()*2*Math.PI;
		} else if(slime.y < 0) {
			slime.y = 0;
			slime.angle = Math.random()*2*Math.PI;
		}

		drawSlime(slime); // draw
	}

	// pixel manipulation
	// https://stackoverflow.com/a/17717174/4907950
	let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	// https://stackoverflow.com/a/15238036/4907950
	let newImgData = new Uint8ClampedArray(imgData.data);
	for(let i=0; i<imgData.data.length; i+=4) {
		// multiply each pixel's alpha by the blur factor
		newImgData[i+3] *= BLUR_FACTOR;

		// average alpha values with the alpha values of adjacent pixels
		if(BLUR_AVERAGE) {
			if(i > WIDTH*4 + 4 && i < WIDTH*HEIGHT*4 - WIDTH*4 - 4) {
				// +- 4 for left and right pixels
				let avg = imgData.data[i+3] +
				imgData.data[i+3 + 4] +
				imgData.data[i+3 - 4] +
				imgData.data[i+3 + WIDTH*4] +
				imgData.data[i+3 - WIDTH*4];
				avg /= 5;

				newImgData[i+3] = avg;
			}
		}
	}

	imgData.data.set(newImgData);
	ctx.putImageData(imgData, 0, 0);

	console.timeLog('tick');

	// turn slimes towards trails based on sensory data
	for(let slime of slimes) {
		let weightForward = sense(slime, 0, imgData);
		let weightLeft = sense(slime, SENSOR_ANGLE, imgData);
		let weightRight = sense(slime, -SENSOR_ANGLE, imgData);
		let steer_strength = Math.random()*RANDOM_STEER_STRENGTH + RANDOM_STEER_STRENGTH;

		// RANDOM_STEER_STRENGTH
		if(weightForward > weightLeft && weightForward > weightRight) {
			continue; // continue same direction
		}
		else if (weightForward < weightLeft && weightForward < weightRight) {
			slime.angle += (steer_strength - 3/2*RANDOM_STEER_STRENGTH) * TURN_SPEED // turn randomly
		}
		else if(weightRight > weightLeft) {
			slime.angle -= steer_strength * TURN_SPEED; // turn right
		}
		else if(weightLeft > weightRight) {
			slime.angle += steer_strength * TURN_SPEED; // turn left
		}
	}

	console.timeEnd('tick');
}

// return alpha of pixel at x, y
function getPixelAt(x, y, imgData) {
	x = Math.floor(x);
	y = Math.floor(y);
	return imgData.data[x*4 + y*WIDTH*4 + 3];
}