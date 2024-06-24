const getKey = () => {
  try {
    return JSON.parse(process.env.NEXT_PUBLIC_KEY);
  } catch (e) {
    console.log("Error parsing key:", e);
  }
};

export const key = getKey();
