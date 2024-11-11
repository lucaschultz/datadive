/**
 * Show members of `TStringUnion` as autocomplete suggestions but accept any string
 * @example
 * type Color = LooseAutocomplete<'red' | 'green' | 'blue'>;
 *
 * const color: Color = 'red'; // No error
 * const color: Color = 'yellow'; //  No error
 * const color: Color = ''; // Autocomplete: 'red', 'green', 'blue'
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type LooseAutocomplete<TStringUnion> = TStringUnion | (string & {})
