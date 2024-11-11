// Any combination of spaces and punctuation characters thanks to http://stackoverflow.com/a/25575009
const wordSeparators =
  // eslint-disable-next-line regexp/no-dupe-characters-character-class
  /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]+/

/**
 * Converts a string to PascalCase.
 * @param str - The string to convert
 * @returns The PascalCase string
 * @example
 * pascalCase('the quick brown fox'); // 'TheQuickBrownFox'
 * pascalCase('the_quick_brown_fox'); // 'TheQuickBrownFox'
 * pascalCase('the-quick-brown-fox'); // 'TheQuickBrownFox'
 * pascalCase('theQuickBrownFox'); // 'TheQuickBrownFox'
 * pascalCase('thequickbrownfox'); // 'Thequickbrownfox'
 * pascalCase('the - quick * brown# fox'); // 'TheQuickBrownFox'
 * pascalCase('theQUICKBrownFox'); // 'TheQUICKBrownFox'
 */
export function toPascalCase(str: string) {
  return str
    .split(wordSeparators)
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join('')
}
