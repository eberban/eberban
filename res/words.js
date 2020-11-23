var request = new XMLHttpRequest();
request.open('GET', '../words.yaml', false); // `false` makes the request synchronous
request.send(null);
var words = jsyaml.load(request.responseText);
