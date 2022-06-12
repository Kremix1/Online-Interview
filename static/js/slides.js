'use strict'

import { stopRecording } from 'record.js';

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


showSlides(slideIndex);


function nextSlide(post, id) {
	var token = document.querySelector('[name=csrfmiddlewaretoken]').value;
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
		nextButton.addEventListener('click', function(){
                stopRecording();
            });
	} else if (slideIndex > tasks.length) {
			leftNumber.style.visibility ="hidden";
            centralNumber.style.visibility ="hidden";
            rightNumber.style.visibility ="hidden";
            nextButton.style.visibility = "hidden";
			personStream.style.visibility = "hidden";
			question.textContent = "Благодарим вас за прохождение интервью! Ваша заявка будет рассмотрена в течении 2-х дней.";
			let backVideo = document.querySelector('.wrapper__video');
            backVideo.style.visibility = "hidden";
			$.ajax({
				headers: {"X-CSRFToken": token},
				url: "post_video",
				type: "POST",
				data: {
					download_screen_link : videoURL,
					post : post,
					id : id
				},
				success: function (response) {
					console.log("video was posted")
					console.log(videoURL)
					console.log(this.data.download_screen_link)
				}
			});
	}
}


function showSlides(n) {
	leftNumber.textContent = n;
	rightNumber.textContent = n + 1;
	let slides = document.getElementsByClassName('item');
}