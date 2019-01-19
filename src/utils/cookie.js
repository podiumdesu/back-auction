function setCookie(name, value, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  // d.setTime(d.getTime() + (exdays * 60 * 1000));

  let expires = "expires=" + d.toGMTString();
  document.cookie = name + "=" + value + "; " + expires;
}

function getCookie(name) {
  name = name + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export {
  setCookie,
  getCookie
}