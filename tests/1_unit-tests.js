const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
const translator = new Translator();

const A2B = 'american-to-british';
const B2A = 'british-to-american';
const strip = (s) => s.replace(/<span class="highlight">(.*?)<\/span>/g, '$1');

suite('Unit Tests', () => {
  suite('American to British English', () => {
    const cases = [
      ['Mangoes are my favorite fruit.', 'Mangoes are my favourite fruit.'],
      ['I ate yogurt for breakfast.', 'I ate yoghurt for breakfast.'],
      ["We had a party at my friend's condo.", "We had a party at my friend's flat."],
      ['Can you toss this in the trashcan for me?', 'Can you toss this in the bin for me?'],
      ['The parking lot was full.', 'The car park was full.'],
      ['Like a high tech Rube Goldberg machine.', 'Like a high tech Heath Robinson device.'],
      ['To play hooky means to skip class or work.', 'To bunk off means to skip class or work.'],
      ['No Mr. Bond, I expect you to die.', 'No Mr Bond, I expect you to die.'],
      ['Dr. Grosh will see you now.', 'Dr Grosh will see you now.'],
      ['Lunch is at 12:15 today.', 'Lunch is at 12.15 today.']
    ];
    cases.forEach(([input, expected]) => {
      test(`Translate ${input} to British English`, () => {
        assert.equal(strip(translator.translate(input, A2B)), expected);
      });
    });
  });

  suite('British to American English', () => {
    const cases = [
      ['We watched the footie match for a while.', 'We watched the soccer match for a while.'],
      ['Paracetamol takes up to an hour to work.', 'Tylenol takes up to an hour to work.'],
      ['First, caramelise the onions.', 'First, caramelize the onions.'],
      ['I spent the bank holiday at the funfair.', 'I spent the public holiday at the carnival.'],
      ['I had a bicky then went to the chippy.', 'I had a cookie then went to the fish-and-chip shop.'],
      ["I've just got bits and bobs in my bum bag.", "I've just got odds and ends in my fanny pack."],
      ['The car boot sale at Boxted Airfield was called off.', 'The swap meet at Boxted Airfield was called off.'],
      ['Have you met Mrs Kalyani?', 'Have you met Mrs. Kalyani?'],
      ["Prof Joyner of King's College, London.", "Prof. Joyner of King's College, London."],
      ['Tea time is usually around 4 or 4.30.', 'Tea time is usually around 4 or 4:30.']
    ];
    cases.forEach(([input, expected]) => {
      test(`Translate ${input} to American English`, () => {
        assert.equal(strip(translator.translate(input, B2A)), expected);
      });
    });
  });

  suite('Highlighting', () => {
    test('Highlight translation in Mangoes are my favorite fruit.', () => {
      assert.equal(
        translator.translate('Mangoes are my favorite fruit.', A2B),
        'Mangoes are my <span class="highlight">favourite</span> fruit.'
      );
    });
    test('Highlight translation in I ate yogurt for breakfast.', () => {
      assert.equal(
        translator.translate('I ate yogurt for breakfast.', A2B),
        'I ate <span class="highlight">yoghurt</span> for breakfast.'
      );
    });
    test('Highlight translation in We watched the footie match for a while.', () => {
      assert.equal(
        translator.translate('We watched the footie match for a while.', B2A),
        'We watched the <span class="highlight">soccer</span> match for a while.'
      );
    });
    test('Highlight translation in Paracetamol takes up to an hour to work.', () => {
      assert.equal(
        translator.translate('Paracetamol takes up to an hour to work.', B2A),
        '<span class="highlight">Tylenol</span> takes up to an hour to work.'
      );
    });
  });
});
