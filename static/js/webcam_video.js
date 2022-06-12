'use strict'

let personStream = document.querySelector("#video");
personStream.width = 220;

let cameraStreamView = null;
let cameraButton = document.querySelector("#start-camera");
cameraButton.addEventListener('click', async function() {
	checkMedia = true;
		if (checkScreen && checkMedia)
			start_button.style.display = 'block';
	cameraStreamView = await navigator.mediaDevices.getUserMedia({ video: true, audio : false});
	personStream.srcObject = cameraStreamView;
});