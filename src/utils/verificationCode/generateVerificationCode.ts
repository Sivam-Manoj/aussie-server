// Function to generate a random 5-digit verification code
export const generateVerificationCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // Generate 5-digit number
};
