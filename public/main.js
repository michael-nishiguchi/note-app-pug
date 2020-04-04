function logout() {
	console.log('in main js file');
	$.post('/logout', function(result) {
		if (result && result.success) {
			$('#status').text('Successfully logged out.');
		}
		else {
			$('#status').text('Error logging out.');
		}
	});
}

function add() {
	$.get('/add', function() {
		if (result && result.success) {
			$('#status').text('add done');
			console.log('Im here');
		}
		else {
			$('#status').text('Error logging in.');
			console.log('here');
		}
	});
}

function about() {
	$.get('/about', function() {
		if (result && result.success) {
			$('#status').text('Successfully logged in.');
		}
		else {
			$('#status').text('Error logging in.');
		}
	});
}
