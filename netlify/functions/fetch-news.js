// netlify/functions/fetch-news.js
// Ця функція виконується на сервері Netlify, API ключ прихований

exports.handler = async (event) => {
  const { query, lang, country } = event.queryStringParameters;
  const apiKey = process.env.API_KEY; // Встановіть API_KEY у налаштуваннях середовища Netlify

  if (!query || !lang) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Параметри query або lang відсутні" }),
    };
  }

  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${lang}${country !== 'Any' ? `&country=${country}` : ''}&max=20&apikey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Помилка API: ${response.status}`);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Помилка отримання новин" }),
    };
  }
};