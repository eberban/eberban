document.addEventListener('DOMContentLoaded', function() {
	Leipzig({ abbreviations: {}, firstLineOrig: true}).gloss();
});

document.addEventListener('gloss:complete', function(event) {
	console.log({document});

	let element = document.documentElement;

	// element.innerHTML = element.innerHTML.replaceAll(/\$\$\{(.+)\}/g, '<span class="cursive">$1</span>');
	element.innerHTML = element.innerHTML.replaceAll(/\$\((.+?)\)/g, '<span class="cursive">$1</span>');
});

// MathJax.Hub.Config({
// 	tex2jax: {
// 	 inlineMath: [ ['$','$'], ["\\(","\\)"] ],
// 	 processEscapes: true
// 	}
// });