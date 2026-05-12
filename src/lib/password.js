export const charSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function getUnbiasedRandom(max) {
  const limit = Math.floor(2 ** 32 / max) * max;
  let value;
  do {
    value = crypto.getRandomValues(new Uint32Array(1))[0];
  } while (value >= limit);
  return value % max;
}

export function generatePassword(length, options) {
  if (options.length === 0 || length === 0) return null;

  const pool = options.map((option) => charSets[option]).join("");
  let password = "";

  for (let i = 0; i < length; i++) {
    password += pool[getUnbiasedRandom(pool.length)];
  }

  return password;
}

export function calculateStrength(length, options) {
  const numOptions = options.length;

  if (numOptions === 0) return null;
  if (numOptions === 1 || length <= 5) return "too-weak";
  if (numOptions === 2 || length <= 10) return "weak";
  if (numOptions === 3 || length <= 15) return "medium";
  return "strong";
}
