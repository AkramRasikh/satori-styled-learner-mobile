import {BACKEND_ENDPOINT} from '@env';

// // adhoc-sentence-tts
// {
//   "language": "japanese",
//   "sentence": "If you want to go then just go!",
//   "context": "Speaking to an indecisive friend that is annoying me",
//   "includeVariations":true
// }

// // adhoc-expression-tts

// {
//   "language": "japanese",
//   "inquiry": "How do I start a conversation once I'm on a call",
//   "context": "I log on to a google meets call and im not sure if the person can see/hear me yet",
//   "includeVariations":true
// }

const addAdhocSentenceTTSAPI = async params => {
  const baseUrl = BACKEND_ENDPOINT;

  const modeParam =
    params.mode === 'inquiry' ? '/adhoc-expression-tts' : '/adhoc-sentence-tts';

  try {
    const response = await fetch(baseUrl + modeParam, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
      }),
    });

    const res = await response.json();

    return res;
  } catch (error) {
    console.log('## Error addAdhocSentenceTTSAPI to text: ', error);
  }
};

export default addAdhocSentenceTTSAPI;
