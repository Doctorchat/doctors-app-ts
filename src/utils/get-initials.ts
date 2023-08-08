export const getInitials = (
  name?: string,
  options?: {
    fallback?: string;
    maxLength?: number;
  },
) => {
  const { fallback = "U", maxLength = 2 } = options || {};

  if (name === undefined) return fallback;

  const initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, maxLength);

  return initials || fallback;
};
