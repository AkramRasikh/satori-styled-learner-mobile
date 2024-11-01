const youtube = 'youtube';
const netflix = 'netflix';

export const isMediaContent = (titleOrigin?: string) => {
  if (!titleOrigin) {
    return false;
  }
  if (titleOrigin === youtube || titleOrigin === netflix) {
    return true;
  }

  return false;
};

export const isYoutube = (titleOrigin?: string) => {
  if (!titleOrigin) {
    return false;
  }
  if (titleOrigin === youtube) {
    return true;
  }
  return false;
};
