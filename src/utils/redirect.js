export const redirect = url => {
  if (url) {
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  }
};
