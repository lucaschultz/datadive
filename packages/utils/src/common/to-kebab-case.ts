// Any combination of spaces and punctuation characters thanks to http://stackoverflow.com/a/25575009
const wordSeparators =
  // eslint-disable-next-line regexp/no-dupe-characters-character-class
  /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]+/
// eslint-disable-next-line regexp/no-obscure-range
const capital_plus_lower = /[A-ZÀ-Ý][a-zà-ÿ]/g
// eslint-disable-next-line regexp/no-obscure-range
const capitals = /[A-ZÀ-Ý]+/g

/**
 * Converts a string to kebab-case.
 * @param str - The string to convert
 * @returns The kebab-case string
 * @example
 * ```
 * kebabCase('the quick brown fox'); // 'the-quick-brown-fox'
 * kebabCase('the-quick-brown-fox'); // 'the-quick-brown-fox'
 * kebabCase('the_quick_brown_fox'); // 'the-quick-brown-fox'
 * kebabCase('theQuickBrownFox'); // 'the-quick-brown-fox'
 * kebabCase('theQuickBrown Fox'); // 'the-quick-brown-fox'
 * kebabCase('thequickbrownfox'); // 'thequickbrownfox'
 * kebabCase('the - quick * brown# fox'); // 'the-quick-brown-fox'
 * kebabCase('theQUICKBrownFox'); // 'the-quick-brown-fox'
 * ```
 */
export function toKebabCase(str: string) {
  return (
    str
      // treat cap + lower as start of new word
      .replace(
        capital_plus_lower,
        (match) => ` ${match.slice(0, 1).toLowerCase()}${match.slice(1)}`,
      )
      // treat all remaining capitals as words
      .replace(capitals, (match) => ` ${match.toLowerCase()}`)
      .trim()
      .split(wordSeparators)
      .join('-')
      .replace(/^-/, '')
      .replace(/-\s*$/, '')
  )
}
