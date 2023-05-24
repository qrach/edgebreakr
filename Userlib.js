var User = {
	mousePos: {
		X: 0,
		Y: 0
	},
	tminkInput: 0.7,
	tmaxkInput: 0.06
}

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function hkwait(min, max) {
	min = min*1000;
	max = max*1000;
	var nmax = max/4;
	var nmin = -nmax;
	var osc = min + Math.abs(Math.sin(Date.now())) * (max - min); // divide by 1000 to ensure output is within range
	var noi = nmin + Math.abs(Math.random()) * (nmax - nmin); // random noise
	var res = osc + noi;
	await sleep(res);
	return res;
}

User.mouseMove = async function(startX, startY, destX, destY, G0 = 9, W0 = 3, M0 = 15, D0 = 12) { // windmouse lol
	// Get the current mouse position.
	var currentX = window.innerWidth / 2;
	var currentY = window.innerHeight / 2;
	
	// Create a new requestAnimationFrame callback.
	function animate(e) {
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
		console.log(mouseX,mouseY)
		// Dispatch a mousemove event.
		window.dispatchEvent(new MouseEvent("mousemove", {
			view: window,
			bubbles: true,
			cancelable: false,
			clientX: mouseX,
			clientY: mouseY,
		}));
	
		// Request the next animation frame.
		requestAnimationFrame(animate);
		} else {
			return;
		}
	}
	// Request the first animation frame.
	var promise = new Promise(function(resolve, reject) {
		requestAnimationFrame(animate);
		animate.then(function() {
			resolve();
		});
	});
	return promise
}

User.emouseMove = function(e) { with (User) {
	var promise = new Promise(async function(resolve, reject) {
		var Pos = e.getBoundingClientRect();
		await mouseMove(mousePos.X,mousePos.Y,e.X,e.Y);
		resolve();
	});
	return promise;
}}

User.lclick = function() { with (User) {
	var promise = new Promise(async function(resolve, reject) {
		var event = new MouseEvent("mousedown", {
			view: window,
			bubbles: true,
			cancelable: false,
			clientX: mousePos.X,
			clientY: mousePos.Y,
			button: 1,
		});
		await hkwait(tminkInput,tmaxkInput)
		var event = new MouseEvent("mouseup", {
			view: window,
			bubbles: true,
			cancelable: false,
			clientX: mousePos.X,
			clientY: mousePos.Y,
			button: 1,
		});
		resolve();
	});
	return promise
}}

User.lclick = function() { with (User) {
	var promise = new Promise(async function(resolve, reject) {
		window.dispatchEvent(new MouseEvent("mousedown", {
			view: window,
			bubbles: true,
			cancelable: false,
			clientX: mousePos.X,
			clientY: mousePos.Y,
			button: 2,
		}));
		await User.hkwait(tminkInput,tmaxkInput)
		window.dispatchEvent(new MouseEvent("mouseup", {
			view: window,
			bubbles: true,
			cancelable: false,
			clientX: mousePos.X,
			clientY: mousePos.Y,
			button: 2,
		}));
		resolve();
	});
	return promise
}}

User.keydown = function(key,e) { with (User) {
	var promise = new Promise(async function(resolve, reject) {
		e.focus();
		window.dispatchEvent(new KeyboardEvent('keydown', { key: key, target: e }));
		window.dispatchEvent(new KeyboardEvent('beforeinput', { data: key, target: e }));
		window.dispatchEvent(new KeyboardEvent('keypress', { key: key, target: e }));
		if ('value' in e) {
			var sstart = e.selectionStart
			var send = e.selectionEnd
			if (selectionStart !== 0 || selectionEnd !== e.value.length) {
				e.value = e.value.slice(0, selectionStart) + key + e.value.slice(selectionEnd);
			} else {
				e.value += key;
			}
		}
		await hkwait(tminkInput,tmaxkInput/15)
		window.dispatchEvent(new Event('input', { bubbles: true }));
		window.dispatchEvent(new Event('change', { bubbles: true }));
		window.dispatchEvent(new KeyboardEvent('keyup', { key: key, target: e }));
		resolve();
	});
	return promise
}}


User.type = function(text,e) { with (User) {
	var promise = new Promise(async function(resolve, reject) {
		for (const char of text) {
			await keydown(char,e);
		}
		resolve();
	});
	return promise
}}

setTimeout(function(){User.type("hello there",document.activeElement); console.log('ok')},5000)
