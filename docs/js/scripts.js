const WIDTH = 500, HEIGHT = 500, NUM_SLIME = 100, BLUR_FACTOR = 0.98;

let tick_interval;
let slimes = [];
let canvas, ctx;

window.onload = ()=> {

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	for(let i=0; i<NUM_SLIME; i++) {
		slimes.push(getSlime());
	}

	tick_interval = setInterval(tick, 50);
};

function tick() {
	ctx.globalAlpha = 0.75;

	for(let slime of slimes) {
		// move
		slime.x += Math.cos(slime.angle)*SLIME_SPEED;
		slime.y += Math.sin(slime.angle)*SLIME_SPEED;

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


	// blur
	let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	for(let i=0; i<imgData.data.length; i+=4) {
		// https://stackoverflow.com/a/17717174/4907950
		imgData.data[i+3] *= BLUR_FACTOR; // alpha
	}
	ctx.putImageData(imgData, 0, 0);

}