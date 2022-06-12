'use strict'

import { setupStream } from 'stream_actions.js';
import { handleDataAvailable } from 'stream_actions.js';
import { handleStop } from 'stream_actions.js';

let mixedStream = null,
	recorder = null,

async function startRecording () {
	await setupStream();

	if (stream && audio) {
		mixedStream = new MediaStream([...stream.getTracks(), ...audio.getTracks()]);
		recorder = new MediaRecorder(mixedStream);
		recorder.ondataavailable = handleDataAvailable;
		recorder.onstop = handleStop;
		recorder.start(1000);
		console.log('Recording started');
	} else {
		console.warn('No stream available.');
	}
}

let startButton = document.querySelector('#start-screen');
startButton.addEventListener('click', function(){
	checkScreen = true;
		if (checkScreen && checkMedia)
			start_button.style.display = 'block';
	startRecording();
});

function stopRecording () {
	recorder.stop();
}