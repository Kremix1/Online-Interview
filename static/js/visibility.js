'use strict'

let pollCount = 1;

let poll = function() {
	if (document.hidden) {
		return;
	}

	// console.log('Polled ' + pollCount + ' times');
	pollCount++;
};

setInterval(poll, 1000);

document.addEventListener('visibilitychange', function() {
	console.log('Visibility поменяли на ' + document.visibilityState + ' !');   // Сообщение о смене вкладки
});