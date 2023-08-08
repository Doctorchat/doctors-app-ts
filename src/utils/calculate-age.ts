export const calculateAge = (birthDate: Date) => {
  const today = new Date();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  let age = today.getFullYear() - birthDate.getFullYear();

  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--;
  }

  if (age === 0) {
    return {
      count: currentMonth - birthMonth + (currentDay < birthDay ? -1 : 0),
      translation: "common:month.count",
    };
  }

  return {
    count: age,
    translation: "common:year.count",
  };
};
