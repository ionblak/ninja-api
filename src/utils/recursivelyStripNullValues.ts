export const recursivelyStripNullValues = (values: unknown): unknown => {
  if (Array.isArray(values)) {
    return values.map(recursivelyStripNullValues);
  }
  if (values !== null && typeof values === 'object') {
    return Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        recursivelyStripNullValues(value),
      ]),
    );
  }
  if (values !== null) {
    return values;
  }
};
