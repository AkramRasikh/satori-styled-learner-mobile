export async function translateText({text, language}) {
  try {
    const url = process.env.TRANSLATE_URL as string;
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        text,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return {text, translation: data.translation};
  } catch (error) {
    console.error('Error translating text:', error);
    return null;
  }
}
