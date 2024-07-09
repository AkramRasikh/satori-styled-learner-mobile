export const generateRandomId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36); // Generate a version 4 (random) UUID
};
