'use strict'

let popup = document.querySelector('#popup');
var tasks = [];

function closePopup(post) {
	popup.style.display = "none";
	popup.style.opacity = "0";
	popup.style.visibility = "hidden";

	$.ajax({
			data: $(this).serialize(),
			url: "get_tasks",
			success: function (response) {
				for (let i = 0; i < response.tasks[post].length; i++)
					tasks.push(response.tasks[post][i]);
				question.textContent = tasks[0]
			}
	});
}
