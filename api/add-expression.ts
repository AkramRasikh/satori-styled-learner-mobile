import {ADD_EXPRESSION_URL} from '@env';

const addExpressionAPI = async params => {
  const baseUrl = ADD_EXPRESSION_URL;

  try {
    const response = await fetch(baseUrl, {
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
    console.log('## Error addExpressionAPI to text: ', error);
  }
};

export default addExpressionAPI;
