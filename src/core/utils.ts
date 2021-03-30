import { Guess } from "./types";

/**
 * Get a random sample of size n from an array
 * @param arr The array to sample from
 * @param n The number of items to sample
 */
export function sample<T>(arr: T[], n: number): T[] {
  let len = arr.length;

  n = Math.min(len, n);

  let result = new Array(n),
      taken = new Array(len);

  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }

  return result;
}

/**
 * Check an array for duplicates
 * @param items The items to check for duplicates
 */
export function duplicates<T>(items: T[]): T[] {
  const hash = new Map<T, number>();

  for (let item of items) {
    hash.set(item, (hash.get(item) ?? 0) + 1);
  }

  let dups: T[] = [];
  hash.forEach((num, item) => {
    if (num > 1) dups.push(item);
  });

  return dups;
}

/**
 * Break down a large string into smaller equal chunks
 * @param str A string to break into equal chunks
 * @param size The size of the chunks
 */
export function chunks(str: string, size: number): string[] {
  let chunks: string[] = [];

  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.substring(i, i + size));
  }

  return chunks;
}

/**
 * Get the size of set X where X = A ∩ B
 * @param a Set A
 * @param b Set B
 */
export function numIntersect<T>(a: T[], b: T[]): number {
  let n = 0;
  for (let i = 0; i < a.length; i++) {
      n += b.includes(a[i]) ? 1 : 0;
  }

  return n;
}

/**
 * Determine if set A is a superset of B
 * @param a Set A
 * @param b Set B
 */
export function isSuperset<T>(a: T[], b: T[]): boolean {
  return numIntersect(a, b) === b.length;
}

/**
 * Get the intersection of A and B
 * @param a Set A
 * @param b Set B
 */
export function intersect<T>(a: T[], b: T[]): T[] {
  return a.filter(n => b.includes(n));
}

/**
 * Get the set subtraction of set A and B
 * @param a Set A
 * @param b Set B
 */
export function subtract<T>(a: T[], b: T[]): T[] {
  return a.filter(x => !b.includes(x));
}

/**
 * Get the union of set A and B
 * @param a Set A
 * @param b Set B
 */
export function union<T>(a: T[], b: T[]): T[] {
  let x = new Set([...a, ...b]);
  return Array.from(x.values());
}

/**
 * Determine if both A and B are equal
 * @param a Array A
 * @param b Array B
 */
export function arrayEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;

  let sorted = a.slice().sort();
  return b.slice().sort().every((item, index) =>
    item === sorted[index]);
}


//
// More specific functions
// (maybe put in a seperate file)
// ==============================


/**
 * Generate the classes required for a specific letter.
 * This is specifically for the alphebet component.
 * @param char The character to generate the classes for
 * @param found The found characters array
 * @param eliminated The eliminated character array
 */
export function charClasses(
  char: string,
  found: string[],
  eliminated: string[]
): string[] {
  let classes: string[] = [];
  if (found.includes(char)) classes.push('found')
  if (eliminated.includes(char)) classes.push('eliminated')
  return classes
}

/**
 * Search for words with specific conditions
 * @param words The set of words to search
 * @param contains The characters that are contained in the word
 * @param notContains The characters that not not in the word
 */
export function wordSearch(
  words: string[],
  contains: string[],
  notContains: string[]
): string[] {
  return words.filter(word =>
    // @ts-expect-error
    isSuperset(word, contains) && numIntersect(word, notContains) === 0);
}

/**
 * Check if the guess has any error
 * @param guess The guess to check
 */
export function hasError(guess: Guess): boolean {
  return guess.invalidChar || guess.wordShort || guess.doubleLetter || guess.badNumber
}