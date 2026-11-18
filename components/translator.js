const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

const LOCALES = ['american-to-british', 'british-to-american'];

const invert = (obj) =>
  Object.keys(obj).reduce((acc, key) => {
    acc[obj[key].toLowerCase()] = key;
    return acc;
  }, {});

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

class Translator {
  constructor() {
    this.dictionaries = {
      'american-to-british': {
        terms: { ...americanOnly, ...americanToBritishSpelling },
        titles: { ...americanToBritishTitles },
        timeRegex: /(\d{1,2}):(\d{2})/,
        timeSep: '.'
      },
      'british-to-american': {
        terms: { ...britishOnly, ...invert(americanToBritishSpelling) },
        titles: invert(americanToBritishTitles),
        timeRegex: /(\d{1,2})\.(\d{2})/,
        timeSep: ':'
      }
    };
    this.regexes = {};
    for (const locale of LOCALES) {
      const dict = this.dictionaries[locale];
      const map = {};
      for (const [k, v] of Object.entries(dict.terms)) map[k.toLowerCase()] = v;
      for (const [k, v] of Object.entries(dict.titles)) map[k.toLowerCase()] = v;
      dict.map = map;
      // Longest phrases first so multi-word terms win over their parts.
      const keys = Object.keys(map).sort((a, b) => b.length - a.length).map(escapeRegex);
      const pattern =
        '(?<![\\p{L}\\p{N}_])(?:(' + dict.timeRegex.source.replace(/\(/g, '(?:') + ')|(' +
        keys.join('|') + '))(?![\\p{L}\\p{N}_])';
      this.regexes[locale] = new RegExp(pattern, 'giu');
    }
  }

  isValidLocale(locale) {
    return LOCALES.includes(locale);
  }

  translate(text, locale, highlight = true) {
    if (!this.isValidLocale(locale)) throw new Error('Invalid value for locale field');
    const dict = this.dictionaries[locale];
    const wrap = (s) => (highlight ? `<span class="highlight">${s}</span>` : s);
    return text.replace(this.regexes[locale], (match, time, term) => {
      if (time) {
        const [, h, m] = time.match(dict.timeRegex);
        return wrap(h + dict.timeSep + m);
      }
      let replacement = dict.map[term.toLowerCase()];
      if (match[0] !== match[0].toLowerCase()) {
        replacement = replacement[0].toUpperCase() + replacement.slice(1);
      }
      return wrap(replacement);
    });
  }
}

module.exports = Translator;
