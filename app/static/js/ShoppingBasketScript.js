// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Select all quantity input elements
  const quantityInputs = document.querySelectorAll(".quantity-input");

  // Loop through each quantity input element
  quantityInputs.forEach((input) => {
    // Add event listener to input event for each quantity input
    input.addEventListener("input", function () {
      const itemId = this.getAttribute("id").replace("quantity_", "");
      const itemPrice = parseFloat(this.getAttribute("data-item-price"));
      const newQuantity = parseInt(this.value);
      const totalPriceElement = document.querySelector(
        `.basket-items[data-id="${itemId}"] .total-price`
      );

      // Check if item price or quantity is invalid
      if (isNaN(itemPrice) || isNaN(newQuantity)) {
        console.error(`Invalid price or quantity for item ${itemId}`);
        return;
      }

      // Calculate the new total price for the item
      const newTotalPrice = itemPrice * newQuantity;

      // Update the total price element text content with the new total price
      totalPriceElement.textContent = `£${newTotalPrice.toFixed(2)}`;
      console.log(
        `Updated total price for item ${itemId}: £${newTotalPrice.toFixed(2)}`
      );

      // Update the total price displayed on the page
      updateTotalPrice();
    });
  });

  // Function to update the total price displayed on the page
  function updateTotalPrice() {
    // Select all total price elements
    const totalPriceElements = document.querySelectorAll(".total-price");
    let totalPrice = 0;

    // Loop through each total price element
    totalPriceElements.forEach((element) => {
      // Find the parent .basket-items element
      const basketItemElement = element.closest(".basket-items");
      if (basketItemElement) {
        const itemId = basketItemElement.getAttribute("data-id");
        const priceText = element.textContent.replace("£", "");
        const price = parseFloat(priceText);

        if (!isNaN(price)) {
          // Add the price to the total
          totalPrice += price;
        } else {
          console.error(`Invalid price for item: ${itemId}`);
        }
      } else {
        console.error("Could not find the parent .basket-items element");
      }
    });

    // Select the total price display element
    const totalPriceDisplay = document.querySelector("#total-price");
    if (totalPriceDisplay) {
      if (!isNaN(totalPrice)) {
        // Update the total price display with the calculated total
        totalPriceDisplay.textContent = `£${totalPrice.toFixed(2)}`;
      } else {
        console.error("Invalid total price:", totalPrice);
      }
    } else {
      console.error("Could not find the #total-price element");
    }
  }
});
