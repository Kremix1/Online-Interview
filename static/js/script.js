'use strict'
let dop = document.querySelector('#dop');

//START INTERVIEW
let start_button = document.querySelector('#start-interview');
start_button.style.display = "none";
let checkScreen, checkMedia = false;
let InterviewStartTime = null;
let InterviewSecondsCount = 0
let popup = document.querySelector('#popup');
let tasks = [];
let onBlurik = "Нет";

function closePopup(post) {
	popup.style.display = "none";
	popup.style.opacity = "0";
	popup.style.visibility = "hidden";
	InterviewStartTime = Date.now();
	$.ajax({
			data: $(this).serialize(),
			url: "get_tasks",
			success: function (response) {
				for (let i = 0; i < response.tasks[post].length; i++)
					tasks.push(response.tasks[post][i]);
				question.textContent = tasks[0]
			}
	});
	// VISIBILITY
	let notFocus = null;
	window.onblur = function() {
		alert("Еще раз предупреждаем о том, что не стоит сворачивать эту вкладку, до окончания интервью.");
		onBlurik = "Да";
	};
	// VISIBILITY
}

// ЗАПИСЬ ОТСЮДА



let stream = null,
	audio = null,
	mixedStream = null,
	chunks = [],
	recorder = null,
	startButton = null;

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


async function startRecording () {
	await setupStream();

	if (stream && audio) {
		mixedStream = new MediaStream([...stream.getTracks(), ...audio.getTracks()]);
		recorder = new MediaRecorder(mixedStream);
		recorder.ondataavailable = handleDataAvailable;
		recorder.onstop = handleStop;
		recorder.start(1000);
	} else {
		console.warn('No stream available.');
	}
}

function stopRecording () {
	recorder.stop();
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
}

startButton = document.querySelector('#start-screen');
startButton.addEventListener('click', function(){
	checkScreen = true;
		if (checkScreen && checkMedia) {
			start_button.style.display = 'block';
			startRecording();
		}

});

// ЭТО ТРАНСЛЯЦИЯ ДЛЯ ПОЛЬЗОВАТЕЛЯ
let personStream = document.querySelector("#video");
personStream.width = 220;

let cameraStreamView = null;
let cameraButton = document.querySelector("#start-camera");
cameraButton.addEventListener('click', async function() {
	checkMedia = true;
		if (checkScreen && checkMedia) {
			start_button.style.display = 'block';
			startRecording();
		}
	cameraStreamView = await navigator.mediaDevices.getUserMedia({ video: true, audio : false});  // Включение самого ВИДЕО
	personStream.srcObject = cameraStreamView;
});




// QUESTIONS
let slideIndex = 1;
let nextButton = document.querySelector('#nextButton');
let nextButtonContent = document.querySelector('#nextButtonContent');

let leftNumber = document.querySelector('#firstNumber');
leftNumber.textContent = '1';
leftNumber.style.visibility = "hidden";

let centralNumber = document.querySelector('#secondNumber');
centralNumber.textContent = '1';

let rightNumber = document.querySelector('#thirdNumber');
rightNumber.textContent = slideIndex + 1;

let question = document.querySelector('#question');

let timeStamps = "";
showSlides(slideIndex);
function nextSlide(post, id) {
	var token = document.querySelector('[name=csrfmiddlewaretoken]').value;
	// ТАЙМКОДЫ ВОПРОСОВ
	let questionEndTime = Date.now();
	let questionStartSeconds =  Math.round(InterviewSecondsCount % 60);
	if (questionStartSeconds < 10) {
		questionStartSeconds = "0" + questionStartSeconds
	}
	let questionEndSeconds = Math.round((InterviewSecondsCount + (questionEndTime - InterviewStartTime) / 1000) % 60);
	if (questionEndSeconds < 10) {
		questionEndSeconds = "0" + questionEndSeconds
	}
	let questionStartMinutes =  parseInt(InterviewSecondsCount / 60);
	if (questionStartMinutes < 10) {
		questionStartMinutes = "0" + questionStartMinutes
	}
	let questionEndMinutes = parseInt((InterviewSecondsCount + (questionEndTime - InterviewStartTime) / 1000) / 60);
	if (questionEndMinutes < 10) {
		questionEndMinutes = "0" + questionEndMinutes
	}
	let timeStamp = "Вопрос " + ((slideIndex == tasks.length + 1) ? slideIndex - 1 : slideIndex) + ": " + questionStartMinutes + ":" + questionStartSeconds + " - " + questionEndMinutes + ":" + questionEndSeconds;
	InterviewSecondsCount = InterviewSecondsCount + (questionEndTime - InterviewStartTime) / 1000;
	InterviewStartTime = questionEndTime;
	timeStamps += timeStamp + "\n";
	if (slideIndex <= tasks.length) {
		if (slideIndex == 1) {
			$.ajax({
				headers: {"X-CSRFToken": token},
				url: "post_data",
				type: "POST",
				data: {
					start_date: Date.now(),
					post: post,
					id: id
				}
			});
		}
		showSlides(slideIndex++);
		leftNumber.style.visibility = "visible";
		centralNumber.textContent = slideIndex;
		rightNumber.textContent = slideIndex + 1;
		question.textContent = tasks[slideIndex - 1];

	}
	if (slideIndex == tasks.length) {
		rightNumber.style.visibility = "hidden";
		nextButtonContent.textContent = "Закончить интервью";
		slideIndex += 1;

	} else if (slideIndex > tasks.length) {
			nextButton.addEventListener('click', function(){
                stopRecording();
				leftNumber.style.visibility =
                centralNumber.style.visibility =
                rightNumber.style.visibility =
                nextButton.style.visibility =
                personStream.style.visibility = "hidden";
				question.textContent = "Благодарим вас за прохождение интервью! Ваша заявка будет рассмотрена в течении 2-х дней.";
				let backVideo = document.querySelector('.wrapper__video');
				backVideo.style.visibility = "hidden";
				$.ajax({
					headers: {"X-CSRFToken": token},
					url: "post_interview_params",
					type: "POST",
					data: {
						onBlur: onBlurik,
						time_stamps: timeStamps,
						post: post,
						id: id
					}
				});
				setTimeout(()=> {$.ajax({
					headers: {"X-CSRFToken": token},
					url: "post_video",
					type: "POST",
					data: {
						download_screen_link : videoURL,
						post : post,
						id : id
					}
				});}, 1000)
				window.onblur = null;
            });
		}
}


function showSlides(n) {
	leftNumber.textContent = n;
	rightNumber.textContent = n + 1;
}
// QUESTIONS
