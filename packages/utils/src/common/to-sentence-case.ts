// Any combination of spaces and punctuation characters thanks to http://stackoverflow.com/a/25575009
const wordSeparators =
  // eslint-disable-next-line regexp/no-dupe-characters-character-class
  /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]+/
const capitals = /[A-Z\u00C0-\u00D6\u00D9-\u00DD]/g

/**
 * Converts a string to sentence case.
 * @param str - The string to convert
 * @returns The sentence case string
 * @example
 * ```
 * toSentenceCase('the quick brown fox'); // 'the quick brown fox'
 * toSentenceCase('the-quick-brown-fox'); // 'the quick brown fox'
 * toSentenceCase('the_quick_brown_fox'); // 'the quick brown fox'
 * toSentenceCase('theQuickBrownFox'); // 'the quick brown fox'
 * toSentenceCase('theQuickBrown Fox'); // 'the quick brown fox'
 * toSentenceCase('thequickbrownfox'); // 'thequickbrownfox'
 * toSentenceCase('the - quick * brown# fox'); // 'the quick brown fox'
 * toSentenceCase('theQUICKBrownFox'); // 'the q u i c k brown fox'
 * ```
 */
export function toSentenceCase(str: string) {
  return str
    .replace(capitals, (match) => ` ${match.toLowerCase()}`)
    .trim()
    .split(wordSeparators)
    .join(' ')
}
