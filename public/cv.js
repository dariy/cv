const getThePhone = () => {
    const numbers = ["9", "7", "8", "6", "4", "5", "3"];
    let areaCode = ["0", "2", "1"];
    [areaCode[1], areaCode[2]] = [areaCode[2], areaCode[1]];
    areaCode = areaCode.join("");

    let part1 = numbers.slice(4, 7).reverse();
    [part1[1], part1[2]] = [part1[2], part1[1]];
    part1 = part1.join("");

    let part2 = numbers.slice(0, 4).reverse();
    [part2[1], part2[2]] = [part2[2], part2[1]];
    part2 = part2.join("");

    const phone = `(${areaCode})&nbsp;${part1}&#0045;${part2}`;
    const element = document.createElement("a");
    const href = document.createAttribute("href");
    href.value = `tel:+1${areaCode}${part1}${part2}`;
    element.setAttributeNode(href);
    element.innerHTML = phone;
    return element.outerHTML;
};

const getTheYear = () => new Date().getFullYear();
const getTheProfessionalYears = () => getTheYear() - 2005;
const getDesiredRole = () => "Senior Software Developer";

globalThis.window.addEventListener("DOMContentLoaded", function () {
    const $ = (name) => document.querySelector(name) || null;
    $(".theCurrentYear").innerText = new Date().getFullYear();
    $(".thePhone").innerHTML = getThePhone();
    $(".theProfessionalYears").innerText = getTheProfessionalYears();
    $(".theDesiredRole").innerText = getDesiredRole();
});
