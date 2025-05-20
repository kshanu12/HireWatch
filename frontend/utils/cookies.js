import Cookies from "js-cookie";

export const setCookie = (key, value, options = {}) => {
  Cookies.set(key, value, options);
};

// export const getCookie = (key) => {
//   const value=Cookies.get(key);
//   console.log("COOKIE VALUE", value);
//   return value
// };

export const removeCookie = (key) => {
  Cookies.remove(key);
};