const axios = require('axios');
const fs = require('fs');
const https = require('https');
const os = require('os');

async function fetchAPOD() {
  try {
    const response = await axios.get('https://api.nasa.gov/planetary/apod?api_key=pvzJZdcJrJhCuoNSR2sr5JuWHYDzwUIZbAJtvs5k');

    if (response.status === 200) {
      return {
        date: response.data.date,
        title: response.data.title,
        explanation: response.data.explanation,
        url: response.data.hdurl || response.data.url,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('NASA APOD API error:', error);
    return null;
  }
}

async function fetchImage(url) {
  try {
    const response = await axios.get(url, { responseType: 'stream' });

    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Image fetch error:', error);
    return null;
  }
}

module.exports = {
  config: {
    name: 'mics',
    aliases: ['mcs'],
    version: '2.0',
    author: 'Subash',
    countDown: 0,
    role: 0,
    shortDescription: {
      vi: 'đây là mô tả ngắn của lệnh',
      en: 'Cat | Fact | Joke | Nasa | News | Poem | Quote',
    },
    longDescription: {
      vi: 'đây là mô tả dài của lệnh',
      en: 'Cat | Fact | Joke | Nasa | News | Poem | Quote',
    },
    category: 'Media',
    guide: {
      vi: 'đây là hướng dẫn sử dụng của lệnh',
      en: '{pn} Cat\n{pn} Fact\n{pn} Joke\n{pn} Nasa\n{pn} News\n{pn} Poem\n{pn} Quote',
    },
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const option = args[0];

      if (option === 'joke') {
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any');

        if (response.status === 200) {
          const jokeData = response.data;

          let joke = '';
          if (jokeData.type === 'twopart') {
            joke = `${jokeData.setup}\n\n- ${jokeData.delivery}`;
          } else {
            joke = jokeData.joke;
          }

          api.sendMessage(joke, event.threadID, event.messageID);
        } else {
          api.sendMessage('Sorry, I couldn\'t fetch a joke at the moment.', event.threadID, event.messageID);
        }
      } else if (option === 'quote') {
        const response = await axios.get('https://api.quotable.io/random');
        const quoteData = response.data;

        if (quoteData && quoteData.content && quoteData.author) {
          const messageToSend = `"${quoteData.content}"\n\n- ${quoteData.author}`;
          api.sendMessage(messageToSend, event.threadID);
        } else {
          api.sendMessage('Failed to retrieve a quote.', event.threadID);
        }
      } else if (option === 'fact') {
        const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
        const factData = response.data;

        if (factData && factData.text) {
          const factText = factData.text;
          const messageToSend = `📌 - ${factText}`;
          api.sendMessage(messageToSend, event.threadID);
        } else {
          api.sendMessage('Failed to retrieve a fact.', event.threadID);
        }
      } else if (option === 'poem') {
        const response = await axios.get('https://poetrydb.org/random');
        const poemData = response.data[0];

        if (poemData && poemData.title && poemData.author && poemData.lines) {
          const poemTitle = poemData.title;
          const poemAuthor = poemData.author;
          const poemLines = poemData.lines.join('\n');
          const messageToSend = `📜 ${poemTitle}\n🖋 ${poemAuthor}\n\n${poemLines}`;
          api.sendMessage(messageToSend, event.threadID);
        } else {
          api.sendMessage('Failed to retrieve a poem.', event.threadID);
        }
      } else if (option === 'news') {
        const apiKey = '7604d5d5d7a9411d8b6dd6f1e9c777ca';

        const response = await axios.get(`https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&country=us&pageSize=10`);

        const articles = response.data.articles;

        if (articles.length > 0) {
          let messageToSend = '📰 Latest News Headlines:\n\n\n';

          articles.forEach((article, index) => {
            messageToSend += `${index + 1}. ${article.title}\n`;
            messageToSend += `   - Source: ${article.source.name}\n`;
            messageToSend += `   - Published: ${new Date(article.publishedAt).toDateString()}\n`;
            messageToSend += `   - Description: ${article.description}\n`;
            messageToSend += `${article.url}\n\n`;
          });

          api.sendMessage(messageToSend, event.threadID);
        } else {
          api.sendMessage('No news articles found.', event.threadID);
        }
      } else if (option === 'nasa') {
        const apodData = await fetchAPOD();

        if (apodData) {
          const { title, explanation, url } = apodData;

          const responseMessage = `NASA Astronomy Picture of the Day (APOD)\n\nDate: ${apodData.date}\nTitle: ${title}\n\nExplanation: ${explanation}`;

          const imageStream = await fetchImage(url);
          api.sendMessage({ body: responseMessage, attachment: imageStream }, event.threadID);
        } else {
          api.sendMessage('An error occurred while fetching NASA\'s APOD data.', event.threadID);
        }
      } 
      else if (option === 'cat') {
  const factResponse = await axios.get('https://meowfacts.herokuapp.com/');
  const catFact = factResponse.data.data;

  const imageResponse = await axios.get('https://api.thecatapi.com/v1/images/search');
  const catImageURL = imageResponse.data[0].url;

  const imageFileName = 'cat_image.jpg';
  const tempDir = os.tmpdir();
  const imageFilePath = `${tempDir}/${imageFileName}`;

  const file = fs.createWriteStream(imageFilePath);
  const request = https.get(catImageURL, function (response) {
    response.pipe(file);
    file.on('finish', function () {

      api.sendMessage({
        body: `🐱 *** Cat Fact ***\n\n${catFact}`,
        attachment: fs.createReadStream(imageFilePath)
      }, event.threadID);
      file.close(() => {
        fs.unlink(imageFilePath, (err) => {
          if (err) {
            console.error('Error deleting temporary file:', err);
          }
        });
      });
    });
  });
 } else {
        api.sendMessage('⚠️ Usage guide -\n\n/M Cat (Cat facts)\n/M Fact (Random facts)\n/M Joke (Random jokes)\n/M Nasa (APOD)\n/M News (Headlines)\n/M Poem (Random poems)\n/M Quote (Random quotes)', event.threadID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage('An error occurred while fetching data.', event.threadID);
    }
  },
};
