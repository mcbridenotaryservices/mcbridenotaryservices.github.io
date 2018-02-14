		$("#datepicker").datepicker();

			// Variable to hold request
			var request;

			// Bind to the submit event of our form
			$("#gform").submit(function(event){

				// Prevent default posting of form - put here to work in case of errors
				event.preventDefault();

				// Abort any pending request
				if (request) {
					request.abort();
				}

				var formData = getFormData();

				if (formData.formComplete) {
					// setup some local variables
					if( !validEmail(formData.inputEmail) ) {   // if email is not valid show error
						$("#email-invalid").css( "display", "block" );
						return false;
					}

					var $form = $(this);

					var $inputs = $form.find("input, select, button, textarea"); // Let's select and cache all the fields

					// Disable the inputs for the duration of the Ajax request.
					// Note: we disable elements AFTER the form data has been serialized.
					// Disabled form elements will not be serialized.
					$inputs.prop("disabled", true);

					// Fire off the request to /form.php
					request = $.ajax({
						url: "https://script.google.com/macros/s/AKfycbyd3ljEKsQrGGYR0OcqSthCeGdchy49960e71E7iTa_yz_ffXA/exec",
						type: "post",
						data: formData
					});

					// Callback handler that will be called on success
					request.done(function (response, textStatus, jqXHR){
						// Log a message to the console
						console.log("Data successfully transmitted.");

						$("#formIncomplete").css( "display", "none" );
						$("form").css( "display", "none" );
						$("#contactMsg").css( "display", "none" );
						$("#thankyoumsg").css( "display", "block" );

					});

					// Callback handler that will be called on failure
					request.fail(function (jqXHR, textStatus, errorThrown){
						// Log the error to the console
						console.error(
						"The following error occurred: "+
						textStatus, errorThrown
						);
					});

					// Callback handler that will be called regardless
					// if the request failed or succeeded
					request.always(function () {
					// Reenable the inputs
						$inputs.prop("disabled", false);
					});
				}

			});

			function getFormData() {
				var form = document.getElementById("gform")
				var data = {"response": "", "formComplete": true};

				$("#formIncomplete").css( "display", "none" );
				$("#email-invalid").css( "display", "none" );

				$(".form-control").each(function(index,element) {
					data[element.id] = element.value;

					if ((element.id !== "inputMessage") && ((element.value == "Preferred Location") || (element.value == "Select Service") || !element.value)) 
					{
						$("#" + element.id).css( "background-color", "#f7f2d7" );
						$("#formIncomplete").css( "display", "block" );
						data["formComplete"] = false;
					}
					else
					{
						$("#" + element.id).css( "background-color", "#fff" );
						
					}
				});

				data.formDataNameOrder = JSON.stringify(data);
				return data;
			}


			function validEmail(email) { // see:
				var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
				return re.test(email);
			}

			$(document).ready(function () {

				$('#inputMessage').keypress(function (event) {
					var max = 250;
					var len = $(this).val().length;

					if (len >= max) {
						event.preventDefault();
					}
				});

			  $('#inputMessage').keyup(function (event) {
					var max = 250;
					var len = $(this).val().length;
					var char = max - len;

					$('#textRemaining').text(char + ' characters remaining');
				});

			});