var User = {
	tminkInput: 0.7,
	tmaxkInput: 0.06
}

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function hkwait(min,max) {
	var nmax = User.tmaxInput/4;
	var nmin = -nmax;
	var osc = min + Math.abs(Math.sin(Date.now())) * (max - min); // divide by 1000 to ensure output is within range
	var noi = nmin + Math.abs(Math.random()) * (nmax - nmin); // random noise
	var res = osc + noi;
	await sleep(res);
	return res;
}

User.mousemove = async function(startX, startY, destX, destY, G0 = 9, W0 = 3, M0 = 15, D0 = 12) { //windmouse lol
	// Get the current mouse position.
	var currentX = window.innerWidth / 2;
	var currentY = window.innerHeight / 2;
	// Create a new animation object.
	var animation = new TimelineMax();
	// Create a new mousemove event listener.
	window.addEventListener("mousemove", function(e) {
		// Get the current mouse position.
		var mouseX = e.clientX;
		var mouseY = e.clientY;
		// Calculate the distance between the current mouse position and the destination.
		var dist = Math.hypot(destX - mouseX, destY - mouseY);
		// If the distance is greater than 1, then continue.
		if (dist >= 1) {
		// Calculate the wind force magnitude.
		var W_mag = Math.min(W0, dist);
		// If the distance is greater than D0, then use random wind.
		if (dist >= D0) {
			W_x = W_x / Math.sqrt(3) + (2 * Math.random() - 1) * W_mag / Math.sqrt(5);
			W_y = W_y / Math.sqrt(3) + (2 * Math.random() - 1) * W_mag / Math.sqrt(5);
		} else {
			W_x /= Math.sqrt(3);
			W_y /= Math.sqrt(3);
			if (M_0 < 3) {
			M_0 = Math.random() * 3 + 3;
			} else {
			M_0 /= Math.sqrt(5);
			}
		}
		// Calculate the velocity.
		var v_x = W_x + G0 * (destX - mouseX) / dist;
		var v_y = W_y + G0 * (destY - mouseY) / dist;
		// Calculate the velocity magnitude.
		var v_mag = Math.hypot(v_x, v_y);
		// If the velocity magnitude is greater than M0, then clip the velocity.
		if (v_mag > M0) {
			var v_clip = M_0 / 2 + Math.random() * M_0 / 2;
			v_x = (v_x / v_mag) * v_clip;
			v_y = (v_y / v_mag) * v_clip;
		}
		// Update the mouse position.
		mouseX += v_x;
		mouseY += v_y;
		// Dispatch a mousemove event.
		window.dispatchEvent(new MouseEvent("mousemove", {
			view: window,
			bubbles: true,
			cancelable: false,
			clientX: mouseX,
			clientY: mouseY,
		}));
		}
	});
	// Start the animation.
	animation.play();
}

main()
