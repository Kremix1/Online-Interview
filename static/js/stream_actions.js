'use strict'

let dop = document.querySelector('#dop');
var checkScreen, checkMedia = false;

var stream = null,
	audio = null,
	chunks = [];

var start_button = document.querySelector('#start-interview');
start_button.style.display = "none";

async function setupStream () {
	try {
		stream = await navigator.mediaDevices.getDisplayMedia({
			video: true
		});
		audio = await navigator.mediaDevices.getUserMedia({
			audio: {
				echoCancellation: true,
				noiseSuppression: true,
				sampleRate: 44100,
			},
		});
	} catch (err) {
		console.error(err)
	}
}

function handleDataAvailable (e) {
	chunks.push(e.data);
}

let videoURL = null;
function handleStop (e) {
	const blob = new Blob(chunks, { 'type' : 'video/mp4' });
	chunks = [];

	videoURL = URL.createObjectURL(blob);
	dop.href = videoURL;
	dop.download = 'video.mp4';

	stream.getTracks().forEach((track) => track.stop());
	audio.getTracks().forEach((track) => track.stop());

	console.log('Recording stopped');
}