const toNumericValue = (value, quotes = true) => {
  const t = /^-{0,1}\d+$/.test(value);
  if (t && value <= Number.MAX_SAFE_INTEGER) {
    return Number(value);
  } else {
    if (quotes) {
      return `'${value}'`;
    } else {
      return `${value}`;
    }
  }
};

export default toNumericValue;
