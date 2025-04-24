const checkIfVideoExists = async url => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
    });

    if (!response.ok) {
      return false; // 404, 403, etc.
    }

    const contentType = response.headers.get('Content-Type');
    const isVideo =
      contentType?.startsWith('video/') ||
      contentType === 'application/octet-stream' ||
      /\.(mp4|mov|avi|mkv|webm)$/i.test(url);

    return isVideo;
  } catch (error) {
    console.error('Error checking video URL:', error);
    return false;
  }
};

export default checkIfVideoExists;
