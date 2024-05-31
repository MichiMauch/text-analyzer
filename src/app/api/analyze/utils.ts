import { convert } from 'html-to-text';
import cheerio from 'cheerio';

export const extractVisibleText = (html: string) => {
  const $ = cheerio.load(html);

  // Funktion zum Extrahieren der Titel, ohne die im <header> und <footer>
  const extractTitles = () => {
    let titles = '';
    $('body')
      .find('h1, h2, h3, h4, h5, h6')
      .each((_, element) => {
        const parentTag = $(element).closest('header, footer');
        if (parentTag.length === 0) {
          titles += $(element).text().trim() + '\n';
        }
      });
    return titles;
  };

  const titles = extractTitles();

  // Wandelt HTML in Text um und behält spezielle Selektoren bei
  const text = convert(html, {
    wordwrap: 130,
    selectors: [
      { selector: 'h1', options: { uppercase: false } },
      { selector: 'h2', options: { uppercase: false } },
      { selector: 'h3', options: { uppercase: false } },
      { selector: 'h4', options: { uppercase: false } },
      { selector: 'h5', options: { uppercase: false } },
      { selector: 'h6', options: { uppercase: false } },
      { selector: 'ul', format: 'block' },
      { selector: 'ol', format: 'block' },
      { selector: 'li', format: 'block', options: { itemPrefix: ' - ' } },
      { selector: 'p', options: { uppercase: false } },
      { selector: 'div', format: 'block' },
      { selector: 'span', format: 'inline' },
      { selector: 'a', options: { ignoreHref: true } },
      { selector: 'img', format: 'skip' },
      { selector: 'nav', format: 'skip' },
      { selector: 'header', format: 'skip' },
      { selector: 'footer', format: 'skip' },
      { selector: 'aside', format: 'skip' },
      { selector: 'noscript', format: 'skip' },
      { selector: 'form', format: 'skip' },
      { selector: 'iframe', format: 'skip' },
      { selector: 'figure', format: 'skip' },
    ],
  });

  // Filtere den Text, behalte nur Zeilen mit mindestens vier Wörtern bei
  const filteredText = text
    .split('\n')
    .filter(line => {
      return line.trim().split(/\s+/).length >= 4;
    })
    .join('\n');

  // Kombiniere die Titel und den gefilterten Text
  const resultText = [titles, filteredText].filter(Boolean).join('\n\n');

  return resultText.trim();
};

export const getMainContent = (html: string) => {
  const $ = cheerio.load(html);

  const mainContentSelectors = ['#default', '.default', '#main-content', '.main-content', 'article', '#content', '.content'];

  let mainContent = '';
  mainContentSelectors.forEach(selector => {
    if ($(selector).length > 0) {
      mainContent += $(selector).html() + ' ';
    }
  });

  if (mainContent.trim() === '') {
    mainContent = $('body').html() || '';
  }

  return mainContent;
};
