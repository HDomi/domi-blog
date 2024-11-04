type ClassName = string | undefined;

export const CNJ = (classes: Array<ClassName>) => {
  if (classes.length === 0) return "";
  return classes.filter((c) => c).join(" ");
};
export default CNJ;
