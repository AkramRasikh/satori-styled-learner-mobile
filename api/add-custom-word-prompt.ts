import {BACKEND_ENDPOINT} from '@env';

const addCustomWordPromptAPI = async params => {
  const baseUrl = BACKEND_ENDPOINT;

  try {
    const response = await fetch(baseUrl + '/custom-word-prompt', {
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
    console.log('## Error addCustomWordPromptAPI to text: ', error);
  }
};

export default addCustomWordPromptAPI;
