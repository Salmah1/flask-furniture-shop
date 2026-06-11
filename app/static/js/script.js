// ACCESSIBILITY FEATURES

const darkModeToggle = document.getElementById("darkModeToggle");
const contentWrapper = document.getElementById("content-wrapper");
const increaseBrightnessButton = document.getElementById("increase-brightness");
const decreaseBrightnessButton = document.getElementById("decrease-brightness");
const fontToggle = document.getElementById("fontToggle");
const speechToggle = document.getElementById("speechToggle");
const content = document.getElementById("content");

let brightness = Number(localStorage.getItem("brightness")) || 1;
let textScale = Number(localStorage.getItem("textScale")) || 100;
let speaking = false;

// Restore saved settings
document.addEventListener("DOMContentLoaded", function () {
  // Dark mode
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");

    if (darkModeToggle) {
      darkModeToggle.checked = true;
    }
  }

  // Brightness
  if (contentWrapper) {
    contentWrapper.style.filter = `brightness(${brightness})`;
  }

  // Text size
  if (content) {
    content.style.fontSize = `${textScale}%`;
  }

  // Readable text
  if (localStorage.getItem("dyslexicMode") === "true") {
    document.body.classList.add("OpenDyslexic");

    if (fontToggle) {
      fontToggle.checked = true;
    }
  }

  // Speech
  if (speechToggle && localStorage.getItem("speechEnabled") === "true") {
    speechToggle.checked = true;

    setTimeout(() => {
      speakText();
    }, 500);
  }

  // Live filtering Search
  const searchInput = document.getElementById("liveSearch");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const value = this.value.toLowerCase();

      let visibleCount = 0;

      document.querySelectorAll(".col").forEach((card) => {
        const titleElement = card.querySelector(".card-title");

        if (!titleElement) return;

        const title = titleElement.textContent.toLowerCase();

        if (title.includes(value)) {
          card.style.display = "";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      const noResults = document.getElementById("noResults");

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? "block" : "none";
      }
    });
  }
});

// Accessibility modal
function toggleSidebar() {
  document.getElementById("accessibilityModal").classList.toggle("show");
}

function closeModal() {
  document.getElementById("accessibilityModal").classList.remove("show");
}

window.addEventListener("click", function (e) {
  const modal = document.getElementById("accessibilityModal");

  if (e.target === modal) {
    closeModal();
  }
});

// Dark mode
if (darkModeToggle) {
  darkModeToggle.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", darkModeToggle.checked);

    localStorage.setItem("darkMode", darkModeToggle.checked);
  });
}

// Brightness
if (increaseBrightnessButton) {
  increaseBrightnessButton.addEventListener("click", function () {
    brightness = Math.min(brightness + 0.1, 1.4);

    if (contentWrapper) {
      contentWrapper.style.filter = `brightness(${brightness})`;
    }

    localStorage.setItem("brightness", brightness);
  });
}

if (decreaseBrightnessButton) {
  decreaseBrightnessButton.addEventListener("click", function () {
    brightness = Math.max(brightness - 0.1, 0.8);

    if (contentWrapper) {
      contentWrapper.style.filter = `brightness(${brightness})`;
    }

    localStorage.setItem("brightness", brightness);
  });
}

// Text size
function increaseFontSize() {
  textScale = Math.min(textScale + 10, 200);

  if (content) {
    content.style.fontSize = `${textScale}%`;
  }

  localStorage.setItem("textScale", textScale);
}

function decreaseFontSize() {
  textScale = Math.max(80, textScale - 10);

  if (content) {
    content.style.fontSize = `${textScale}%`;
  }

  localStorage.setItem("textScale", textScale);
}

// Readable text
if (fontToggle) {
  fontToggle.addEventListener("change", function () {
    document.body.classList.toggle("OpenDyslexic", this.checked);

    localStorage.setItem("dyslexicMode", this.checked);
  });
}

// Speech
if (speechToggle) {
  speechToggle.addEventListener("change", function () {
    localStorage.setItem("speechEnabled", this.checked);

    if (!this.checked) {
      window.speechSynthesis.cancel();
      speaking = false;
    } else {
      speakText();
    }
  });
}

function speakText() {
  if (speaking) return;

  const contentElement = document.querySelector(".content");

  if (!contentElement) return;

  const speech = new SpeechSynthesisUtterance(contentElement.innerText);

  speech.rate = 1;

  speech.onend = function () {
    speaking = false;
  };

  speech.onerror = function () {
    speaking = false;
  };

  speaking = true;

  window.speechSynthesis.speak(speech);
}

// Reset
function resetAccessibility() {
  document.body.classList.remove("dark-mode", "OpenDyslexic");

  brightness = 1;
  textScale = 100;
  speaking = false;

  if (contentWrapper) {
    contentWrapper.style.filter = "brightness(1)";
  }

  if (content) {
    content.style.fontSize = "100%";
  }

  if (darkModeToggle) darkModeToggle.checked = false;
  if (fontToggle) fontToggle.checked = false;
  if (speechToggle) speechToggle.checked = false;

  localStorage.removeItem("darkMode");
  localStorage.removeItem("dyslexicMode");
  localStorage.removeItem("brightness");
  localStorage.removeItem("textScale");
  localStorage.removeItem("speechEnabled");

  window.speechSynthesis.cancel();

  closeModal();
}

// INDEX PAGE

// Function to sort items based on criteria
function sortItems(criteria) {
  const container = document.querySelectorAll(".row");

  container.forEach((row) => {
    const items = Array.from(row.querySelectorAll(".col"));

    items.sort((a, b) => {
      let valueA, valueB;

      switch (criteria) {
        case "name":
          valueA = a.querySelector(".card-title").textContent.trim();
          valueB = b.querySelector(".card-title").textContent.trim();
          break;

        case "price":
          valueA = parseFloat(
            a.querySelector(".card-price").textContent.replace("£", ""),
          );
          valueB = parseFloat(
            b.querySelector(".card-price").textContent.replace("£", ""),
          );
          break;

        case "environment":
          valueA = parseFloat(
            a.querySelector(".card-properties").dataset.carbon,
          );

          valueB = parseFloat(
            b.querySelector(".card-properties").dataset.carbon,
          );

          break;

        default:
          return 0;
      }

      return criteria === "name"
        ? valueA.localeCompare(valueB)
        : valueA - valueB;
    });

    // Reorder items in the row
    row.innerHTML = "";
    items.forEach((item) => row.appendChild(item));
  });
}

// AJAX to retrieve furniture descriptions
if (typeof $ !== "undefined") {
  $(document).ready(function () {
    $(".card").hover(
      function () {
        const descriptionDiv = $(this).find(".hover-description");
        const itemId = descriptionDiv.data("id");

        // Only load once
        if (!descriptionDiv.data("loaded")) {
          $.get(`/description/${itemId}`, function (data) {
            descriptionDiv.text(data.description);
            descriptionDiv.data("loaded", true);
          });
        }

        descriptionDiv.addClass("show-description");
      },
      function () {
        $(this).find(".hover-description").removeClass("show-description");
      },
    );
  });
}

// Item added to basket flash message
const flashMessage = document.querySelector(".flash-message");

if (flashMessage) {
  setTimeout(() => {
    flashMessage.style.opacity = "0";

    setTimeout(() => {
      flashMessage.remove();
    }, 500);
  }, 3000);
}
