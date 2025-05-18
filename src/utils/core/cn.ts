// A simple utility for conditionally joining class names, similar to clsx or classnames.
export type ClassValue = string | number | boolean | undefined | null;
export type ClassArray = ClassValue[];
export type ClassDictionary = Record<string, any>;

function toVal(mix: ClassValue | ClassArray | ClassDictionary) {
  let k, y, str='';

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix;
  } else if (typeof mix === 'object') {
    if (Array.isArray(mix)) {
      for (k=0; k < mix.length; k++) {
        if (mix[k]) {
          if (y = toVal(mix[k])) {
            str && (str += ' ');
            str += y;
          }
        }
      }
    } else {
      for (k in mix) {
        if (mix[k]) {
          str && (str += ' ');
          str += k;
        }
      }
    }
  }

  return str;
}

export function cn(...args: (ClassValue | ClassArray | ClassDictionary)[]) {
  let i=0, tmp, x, str='';
  while (i < args.length) {
    if (tmp = args[i++]) {
      if (x = toVal(tmp)) {
        str && (str += ' ');
        str += x
      }
    }
  }
  return str;
}

export default cn; 