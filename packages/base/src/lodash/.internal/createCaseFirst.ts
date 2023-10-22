import castSlice from './castSlice';
import hasUnicode from './hasUnicode';
import stringToArray from './stringToArray';

/**
 * Creates a function like `lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
export default function createCaseFirst(methodName: any) {
  return (string: any) => {
    if (!string) {
      return '';
    }

    const strSymbols = hasUnicode(string) ? stringToArray(string) : undefined;

    const chr = strSymbols ? strSymbols[0] : string[0];

    const trailing = strSymbols
      ? castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}
