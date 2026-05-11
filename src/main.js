// elements
const range = document.querySelector("#char-length");
const output = document.querySelector("#output");

// initialize slider fill on page load
function updateSlider() {
  const min = Number(range.min);
  const max = Number(range.max);
  const currentVal = Number(range.value);

  output.value = currentVal;
  range.style.backgroundSize =
    ((currentVal - min) / (max - min)) * 100 + "% 100%";
}

// set initial state
updateSlider();

// update on input
range.addEventListener("input", updateSlider);