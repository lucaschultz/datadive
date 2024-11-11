// Any combination of spaces and punctuation characters thanks to http://stackoverflow.com/a/25575009
const wordSeparators =
  // eslint-disable-next-line regexp/no-dupe-characters-character-class
  /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]+/
const capitals = /[A-Z\u00C0-\u00D6\u00D9-\u00DD]/g

/**
 * Converts a string to snake_case.
 * @param str - The string to convert
 * @returns The snake_case string
 * @example
 * ```
 * snakeCase('the quick brown fox'); // 'the_quick_brown_fox'
 * snakeCase('the-quick-brown-fox'); // 'the_quick_brown_fox'
 * snakeCase('the_quick_brown_fox'); // 'the_quick_brown_fox'
 * snakeCase('theQuickBrownFox'); // 'the_quick_brown_fox'
 * snakeCase('theQuickBrown Fox'); // 'the_quick_brown_Fox'
 * snakeCase('thequickbrownfox'); // 'thequickbrownfox'
 * snakeCase('the - quick * brown# fox'); // 'the_quick_brown_fox'
 * snakeCase('theQUICKBrownFox'); // 'the_q_u_i_c_k_brown_fox'
 * ```
 */
export function toSnakeCase(str: string) {
  return str
    .replace(capitals, (match) => ` ${match.toLowerCase()}`)
    .trim()
    .split(wordSeparators)
    .join('_')
}
