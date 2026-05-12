import "./main.css";
import {
  charSets,
  generatePassword,
  calculateStrength,
} from "./lib/password.js";

function init() {
  // elements
  const range = document.querySelector("#char-length");
  const charLengthOutput = document.querySelector(".char-length-output");
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const strengthLabel = document.querySelector("#strength-label");
  const strengthValues = document.querySelectorAll(".strength-value");
  const generateButton = document.querySelector(".generate-btn");
  const passwordDisplay = document.querySelector("#password-display");
  const copiedLabel = document.querySelector("#copied-label");
  const copyButton = document.querySelector(".copy-button");

  // bail early if any critical element is missing
  if (
    !range ||
    !charLengthOutput ||
    !generateButton ||
    !passwordDisplay ||
    !copyButton
  ) {
    console.warn("Password generator: required elements not found");
    return;
  }

  // slider
  function updateSlider() {
    const min = Number(range.min);
    const max = Number(range.max);
    const currentVal = Number(range.value);

    charLengthOutput.value = currentVal;
    range.style.backgroundSize =
      ((currentVal - min) / (max - min)) * 100 + "% 100%";
  }

  // checkboxes
  function getSelectedOptions() {
    return Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
  }

  // strength UI
  function updateStrengthUI(strength) {
    strengthValues.forEach((el) => {
      el.classList.remove("too-weak", "weak", "medium", "strong");
    });

    strengthLabel.textContent = "";
    if (strength === null) return;

    const strengthMap = {
      "too-weak": { label: "Too Weak!", count: 1 },
      weak: { label: "Weak", count: 2 },
      medium: { label: "Medium", count: 3 },
      strong: { label: "Strong", count: 4 },
    };

    const { label, count } = strengthMap[strength];
    strengthLabel.textContent = label;

    strengthValues.forEach((el, index) => {
      if (index < count) el.classList.add(strength);
    });
  }

  function updateStrength() {
    const length = Number(range.value);
    const options = getSelectedOptions();
    const strength = calculateStrength(length, options);
    updateStrengthUI(strength);
  }

  // event listeners
  range.addEventListener("input", updateSlider);
  range.addEventListener("input", updateStrength);

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateStrength);
  });

  generateButton.addEventListener("click", () => {
    const length = Number(range.value);
    const options = getSelectedOptions();

    if (options.length === 0 || length === 0) return;

    const password = generatePassword(length, options);
    passwordDisplay.textContent = password;
    passwordDisplay.classList.add("active");

    copiedLabel.classList.remove("visible");
    updateStrength();
  });

  copyButton.addEventListener("click", () => {
    const password = passwordDisplay.textContent;

    if (!password || password === "P4$5W0rD!") return;

    if (!navigator.clipboard) {
      console.warn("Clipboard API not available");
      return;
    }

    navigator.clipboard
      .writeText(password)
      .then(() => {
        copiedLabel.textContent = "Copied";
        copiedLabel.classList.add("visible");
      })
      .catch((err) => {
        console.warn("Failed to copy password:", err);
      });
  });

  // initialize
  updateSlider();
  updateStrength();
}

init();
