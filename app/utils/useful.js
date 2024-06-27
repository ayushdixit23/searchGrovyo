import jwt from "jsonwebtoken";
import aesjs from "aes-js";
const getKey = () => {
  try {
    return JSON.parse(process.env.NEXT_PUBLIC_KEY);
  } catch (e) {
    console.log("Error parsing key:", e);
  }
};

const key = getKey();

export const encryptaes = (data) => {
  try {
    const textBytes = aesjs.utils.utf8.toBytes(data);
    const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    const encryptedBytes = aesCtr.encrypt(textBytes);
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
  } catch (e) {
    console.log(e);
  }
};

export const decryptaes = (data) => {
  try {
    let d;
    if (typeof data !== "string") {
      d = JSON.stringify(data);
    } else {
      d = data;
    }
    const encryptedBytes = aesjs.utils.hex.toBytes(d);
    const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);

    const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    return decryptedText;
  } catch (e) {
    console.log(e)
  }
};


export const formatDateToString = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so add 1
  const day = date.getDate().toString().padStart(2, "0");
  // const formattedDate = `${day}/${month}/${year}`;
  const formattedDate = `${day}-${month}-${year}`;
  // conormattedDate = `${year}-${month}-${day}`;st f
  return formattedDate;
};

// export const formatDate = (dateString) => {
//   const dateNow = new Date(); // Current date
//   const createdAt = new Date(dateString); // Date of post creation

//   // Calculate the difference in milliseconds
//   const differenceInMilliseconds = dateNow - createdAt;

//   // Convert milliseconds to days and round to the nearest integer
//   const differenceInDays = Math.round(
//     differenceInMilliseconds / (1000 * 60 * 60 * 24)
//   );

//   // Create a human-readable string
//   let dateStrings = "";
//   if (differenceInDays === 0) {
//     dateStrings = "today";
//   } else if (differenceInDays === 1) {
//     dateStrings = "1 day ago";
//   } else {
//     dateStrings = `${differenceInDays} days ago`;
//   }
//   return dateStrings;
// };

export const formatDate = (dateString) => {
  const dateNow = new Date(); // Current date
  const createdAt = new Date(dateString); // Date of post creation

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = dateNow - createdAt;

  // Convert milliseconds to seconds, minutes, hours, days, months, and years
  const seconds = Math.floor(differenceInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  // Create a human-readable string
  let dateStrings = "";
  if (years > 0) {
    dateStrings = years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (months > 0) {
    dateStrings = months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (days > 0) {
    dateStrings = days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    dateStrings = hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    dateStrings = minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    dateStrings = "just now";
  }
  return dateStrings;
};

export const checkToken = async (token) => {
  try {
    const decodedToken = jwt.decode(token, { complete: true });
    if (decodedToken && decodedToken.header && decodedToken.payload) {
      const issuedAt = decodedToken.payload.iat;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const isValidIat = issuedAt <= currentTimestamp;
      const expiration = decodedToken.payload.exp;
      const isValidExp = currentTimestamp <= expiration;
      if (isValidIat && isValidExp) {
        return { isValid: true, payload: decodedToken.payload };
      } else {
        return { isValid: false, payload: "" };
      }
    }
  } catch (error) {
    console.log(error);
  }
};

