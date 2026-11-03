document.addEventListener('DOMContentLoaded', function() {
	Leipzig({ abbreviations: {}, firstLineOrig: true}).gloss();
});

document.addEventListener('gloss:complete', function(event) {
	let element = document.getElementById("content");

	element.innerHTML = element.innerHTML.replaceAll(/\$\((.+?)\)/g, '<span class="cursive">$1</span>');
});

// MathJax.Hub.Config({
// 	tex2jax: {
// 	 inlineMath: [ ['$','$'], ["\\(","\\)"] ],
// 	 processEscapes: true
// 	}
// });