/* -----------------------------------------
  Have focus outline only for keyboard users 
 ---------------------------------------- */




const handleFirstTab = (e) => {
	if (e.key === 'Tab') {
		document.body.classList.add('user-is-tabbing')

		window.removeEventListener('keydown', handleFirstTab)
		window.addEventListener('mousedown', handleMouseDownOnce)
	}

}

const handleMouseDownOnce = () => {
	document.body.classList.remove('user-is-tabbing')

	window.removeEventListener('mousedown', handleMouseDownOnce)
	window.addEventListener('keydown', handleFirstTab)
}

window.addEventListener('keydown', handleFirstTab)

const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

let alterStyles = (isBackToTopRendered) => {
	backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
	backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
	backToTopButton.style.transform = isBackToTopRendered
		? "scale(1)"
		: "scale(0)";
};

window.addEventListener("scroll", () => {
	if (window.scrollY > 700) {
		isBackToTopRendered = true;
		alterStyles(isBackToTopRendered);
	} else {
		isBackToTopRendered = false;
		alterStyles(isBackToTopRendered);
	}
});


document.getElementById("read_more").addEventListener('click', changeClass);

function changeClass() {
	var content = document.getElementById("extra_content");
	var btn = document.getElementById("read_more");
	content.classList.toggle('show');

	if (content.classList.contains("show")) {
		btn.innerHTML = "Show Less";
	} else {
		btn.innerHTML = "Show More";
	}
}

$(function () {

	'use strict';

	// Form

	var contactForm = function () {

		if ($('#contactForm').length > 0) {
			$("#contactForm").validate({
				rules: {
					name: "required",
					email: {
						required: true,
						email: true
					},
					message: {
						required: true,
						minlength: 5
					}
				},
				messages: {
					name: "Please enter your name",
					email: "Please enter a valid email address",
					message: "Please enter a message"
				},
				/* submit via ajax */
				submitHandler: function (form) {
					var $submit = $('.submitting'),
						waitText = 'Submitting...';

					$.ajax({
						type: "POST",
						url: "/",
						data: $(form).serialize(),

						beforeSend: function () {
							$submit.css('display', 'block').text(waitText);
						},
					});
				}

			});
		}
	};
	contactForm();

});
