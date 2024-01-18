export const extractPublicId = (url: string) => {
  const splitSource = url.split("/");
  return splitSource[splitSource.length - 1].split(".")[0];
};
