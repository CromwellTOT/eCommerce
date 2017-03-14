$(document).ready(function() {
	// hover to dropdown menu
	$('ul.nav li.dropdown').hover(function() {
		$(this).find('.dropdown-menu').stop(true, true).show();
	}, function() {
		$(this).find('.dropdown-menu').stop(true, true).hide();
	});
	$(".hideErrorMsg").focus(function() {
		$(".errorMsg").hide();
	})
	$("span.close").on("click", function() {
		$(".modal").hide();
		$(".errorMsg").hide();
	});
	String.prototype.capitalizeFirstLetter = function() {
	    return this.charAt(0).toUpperCase() + this.slice(1);
	}
});