$(function() {
	var $runDuration = $('#run-duration');

	$runDuration.val('15');

	$('.modify').on('click', function() {
		var modifyAmount = parseInt($(this).data('amount'));

		if ($runDuration.val() === '') {
			if (modifyAmount >= 15) {
				$($runDuration.val(modifyAmount));
			}
		} else {
			var modifiedRunDuration = parseInt($runDuration.val()) + modifyAmount;

			if (modifiedRunDuration < 15) {
				modifiedRunDuration = 15;
			}

			$runDuration.val(modifiedRunDuration);
		}
	});

	$runDuration.keypress(function(e) {
		if (e.keyCode === 8 || e.ctrlKey || e.metaKey) {
			return;
		}

		var keyPressed = String.fromCharCode(e.which);

		if (parseInt(keyPressed) != keyPressed) {
			e.preventDefault();
		}
	});
});