var User = {
	tminInput: 0.7,
	tmaxInput: 0.06
}

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function humwait() {
	var min = User.tminInput;
	var max = User.tmaxInput;
	var nmax = User.tmaxInput/4;
	var nmin = -nmax;
	var osc = min + Math.abs(Math.sin(Date.now())) * (max - min); // divide by 1000 to ensure output is within range
	var noi = nmin + Math.abs(Math.random()) * (nmax - nmin); // random noise
	var res = osc + noi;
	await sleep(res);
	return res;
}

User.mousemove = async function() {
	await humwait()
}

User.lclick = async function() {
	await humwait()
}

User.rclick = async function() {
	await humwait()
}
