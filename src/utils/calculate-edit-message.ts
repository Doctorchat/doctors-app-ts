export const hasPassedTenMinutes = (updatedTimestamp: any) => {
  const TEN_MINUTES_IN_MS = 10 * 60 * 1000; // 10 minute în milisecunde
  const currentTime = new Date().getTime();
  const updatedTime = new Date(updatedTimestamp).getTime();
  const elapsedTime = currentTime - updatedTime;

  return elapsedTime < TEN_MINUTES_IN_MS;
};
export const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");
  const milliseconds = String(now.getUTCMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
};
