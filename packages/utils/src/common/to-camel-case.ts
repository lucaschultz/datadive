// Any combination of spaces and punctuation characters thanks to http://stackoverflow.com/a/25575009
const wordSeparatorsRegEx =
  // eslint-disable-next-line regexp/no-dupe-characters-character-class
  /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]+/

const basicCamelRegEx =
  // eslint-disable-next-line regexp/no-dupe-characters-character-class
  /^[a-z\u00E0-\u00FC\u00C0-\u00DC][\d|a-z\u00E0-\u00FC\u00C0-\u00DC]*$/i
const fourOrMoreConsecutiveCapsRegEx = /([A-Z\u00C0-\u00DC]{4,})/g
const allCapsRegEx = /^[A-Z\u00C0-\u00DC]+$/

/**
 * Converts a string to camelCase.
 * This utility is based on
 * {@link https://github.com/angus-c/just/tree/master/packages/string-camel-case | just-camel-case}
 * by Angus Croll.
 * @param str - The string to convert
 * @returns The camelCase string
 * @example
 * ```
 * camelCase('the quick brown fox'); // 'theQuickBrownFox'
 * camelCase('the_quick_brown_fox'); // 'theQuickBrownFox'
 * camelCase('the-quick-brown-fox'); // 'theQuickBrownFox'
 * camelCase('theQuickBrownFox'); // 'theQuickBrownFox'
 * camelCase('thequickbrownfox'); // 'thequickbrownfox'
 * camelCase('the - quick * brown# fox'); // 'theQuickBrownFox'
 * camelCase('behold theQuickBrownFox'); // 'beholdTheQuickBrownFox'
 * camelCase('Behold theQuickBrownFox'); // 'beholdTheQuickBrownFox'
 * // all caps words are camel-cased
 * camelCase('The quick brown FOX'), 'theQuickBrownFox');
 * // all caps substrings >= 4 chars are camel-cased
 * camelCase('theQUickBrownFox'); // 'theQUickBrownFox'
 * camelCase('theQUIckBrownFox'); // 'theQUIckBrownFox'
 * camelCase('theQUICKBrownFox'); // 'theQuickBrownFox'
 * ```
 */
export function toCamelCase(str: string) {
  const words = str.split(wordSeparatorsRegEx)
  const len = words.length
  const mappedWords = new Array(len)
  for (let i = 0; i < len; i++) {
    // eslint-disable-next-line security/detect-object-injection
    let word = words[i]
    if (word === '' || word === undefined) {
      continue
    }
    const isCamelCase = basicCamelRegEx.test(word) && !allCapsRegEx.test(word)
    if (isCamelCase) {
      word = word.replace(
        fourOrMoreConsecutiveCapsRegEx,
        function (match, _, offset) {
          return deCap(match, (word?.length ?? 0 - offset - match.length) == 0)
        },
      )
    }
    let firstLetter = word[0] ?? ''
    firstLetter = i > 0 ? firstLetter.toUpperCase() : firstLetter.toLowerCase()
    // eslint-disable-next-line security/detect-object-injection
    mappedWords[i] =
      firstLetter + (!isCamelCase ? word.slice(1).toLowerCase() : word.slice(1))
  }

  return mappedWords.join('')
}

const deCap = (match: string, endOfWord: boolean) => {
  const arr = match.split('')
  const first = arr.shift()?.toUpperCase()
  const last = endOfWord ? arr.pop()?.toLowerCase() : arr.pop()

  return (first ?? '') + arr.join('').toLowerCase() + (last ?? '')
}
