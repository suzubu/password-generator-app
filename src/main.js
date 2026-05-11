// elements
const range = document.querySelector("#char-length");
const charLengthOutput = document.querySelector(".char-length-output");
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const strengthLabel = document.querySelector("#strength-label");
const strengthValues = document.querySelectorAll(".strength-value");
const generateButton = document.querySelector("#generate");
const passwordDisplay = document.querySelector("#password-display");
const copiedLabel = document.querySelector("#copied-label");
const copyButton = document.querySelector(".copy-button");

// constants
const charSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

// state
let passwordGenerated = false;

// slider
function updateSlider() {
  const min = Number(range.min);
  const max = Number(range.max);
  const currentVal = Number(range.value);

  charLengthOutput.value = currentVal;
  range.style.backgroundSize =
    ((currentVal - min) / (max - min)) * 100 + "% 100%";
}

updateSlider();
range.addEventListener("input", updateSlider);

// checkboxes
function getSelectedOptions() {
  return Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", updateStrength);
});

// strength
function calculateStrength(length, options) {
  const numOptions = options.length;

  if (numOptions === 0) return null;
  if (numOptions === 1 || length <= 5) return "too-weak";
  if (numOptions === 2 || length <= 10) return "weak";
  if (numOptions === 3 || length <= 15) return "medium";
  return "strong";
}

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

range.addEventListener("input", updateStrength);

// password generation
function generatePassword(length, options) {
  if (options.length === 0 || length === 0) return null;

  const pool = options.map((option) => charSets[option]).join("");
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    password += pool[randomIndex];
  }

  return password;
}

generateButton.addEventListener("click", () => {
  const length = Number(range.value);
  const options = getSelectedOptions();

  if (options.length === 0 || length === 0) return;

  const password = generatePassword(length, options);
  passwordDisplay.textContent = password;
  passwordGenerated = true;

  copiedLabel.classList.remove("visible");
  updateStrength();
});

// copy to clipboard
copyButton.addEventListener("click", () => {
  if (!passwordGenerated) return;

  const password = passwordDisplay.textContent;

  navigator.clipboard.writeText(password).then(() => {
    copiedLabel.textContent = "COPIED!";
    copiedLabel.classList.add("visible");
  });
});
