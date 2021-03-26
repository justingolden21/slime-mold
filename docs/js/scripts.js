const WIDTH = 500, HEIGHT = 500, NUM_SLIME = 100;

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
}