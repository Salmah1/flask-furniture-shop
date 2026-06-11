// Add event listener to the payment form for form submission
document
  .getElementById("payment-form")
  .addEventListener("submit", function (event) {
    // Retrieve form input values
    var name = document.getElementById("name").value;
    var cardNumber = document.getElementById("card").value;
    var expiry = document.getElementById("expiry").value;
    var cvc = document.getElementById("cvc").value;

    // Regular expression patterns for validation
    var expiryPattern = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;

    // Validate expiration date format
    if (!expiryPattern.test(expiry)) {
      alert("Please enter a valid expiration date in MM/YY format.");
      // Prevent form submission
      event.preventDefault();
      return;
    }

    // Check if expiration date is in the future
    var currentDate = new Date();
    var enteredExpiryDate = new Date(
      "20" + expiry.slice(3) + "-" + expiry.slice(0, 2) + "-01",
    );
    if (enteredExpiryDate <= currentDate) {
      alert("Please enter a valid date.");
      // Prevent form submission
      event.preventDefault();
      return;
    }

    // Regular expression patterns for validation
    var cardNumberPattern = /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/;

    // Validate card number format
    if (!cardNumberPattern.test(cardNumber)) {
      alert("Please enter a valid 16-digit card number.");
      // Prevent form submission
      event.preventDefault();
      return;
    }

    // Validate CVC format
    if (!/^\d{3}$/.test(cvc)) {
      alert("Please enter a valid 3-digit CVC number.");
      // Prevent form submission
      event.preventDefault();
      return;
    }

    // Validate name format
    if (!/^[A-Za-z ]{3,50}$/.test(name)) {
      alert("Please enter a valid name with only letters.");
      // Prevent form submission
      event.preventDefault();
      return;
    }
  });
