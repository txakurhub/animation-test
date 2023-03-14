let paths = document.querySelectorAll("svg path"),
  i = 0;

paths.forEach(function (item, index) {
  i++;

  let pathLength = item.getTotalLength(),
    speed = 750;

  item.setAttribute("stroke-dasharray", pathLength);
  item.setAttribute("stroke-dashoffset", pathLength);

  if (index === 0) {
    item.innerHTML =
      "<animate id='a " +
      i +
      "' attributeName='stroke-dashoffset' begin='0s' dur='" +
      pathLength / speed +
      "s' to='0' fill='freeze'/>";
  } else {
    item.innerHTML =
      "<animate id='a " +
      i +
      "' attributeName='stroke-dashoffset' begin='a" +
      (i - 1) +
      ".end' dur='" +
      pathLength / speed +
      "s' to='0' fill='freeze'/>";
  }
});
