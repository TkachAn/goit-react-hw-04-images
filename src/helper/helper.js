export const compactData = arr => {
  return arr.map(({ id, webformatURL, tags, largeImageURL }) => ({
    id,
    webformatURL,
    tags,
    largeImageURL,
  }));
};
