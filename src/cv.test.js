// import {
//     emailElementBuild,
//     getCurrentYear,
//     getTheProfessionalYears,
//     getTitle,
//     phoneDecode,
//     phoneElementBuild,
//     phoneEncode,
// } from "./cv.js";
// import { describe, expect, it } from "@jest/globals";
//
// describe("emailElementBuild", () => {
//     // Arrange
//     const name = "John Doe";
//     const sourceEmail = ["right", "center", "left"];
//
//     // Act
//     const emailElement = emailElementBuild(name, sourceEmail);
//
//     // Asserts
//     it("returns a HTML element", () => expect(emailElement).toBeInstanceOf(HTMLElement));
//     it("returns a proper email", () => {
//         expect(emailElement.innerHTML).toBe('left<span class="delimiter">@</span>center.right');
//     });
//     it("has email different than source", () =>
//         expect(emailElement.innerHTML).not.toBe(sourceEmail));
// });
//
// describe("phoneElementBuild", () => {
//     const sourcePhone = "0123456789";
//     const encodedPhone = phoneEncode(sourcePhone);
//     const decodedPhone = phoneDecode(encodedPhone);
//
//     it("adds the phone to the DOM from encoded phone", () => {
//         expect(phoneElementBuild(sourcePhone).outerHTML).toBe(
//             '<a class="phone" href="tel:+10123456789">012-345-6789</a>',
//         );
//     });
//
//     it("has decoded phone same as source", () => expect(decodedPhone).toBe(sourcePhone));
//     it("has encoded phone different than source", () => expect(encodedPhone).not.toBe(sourcePhone));
// });
//
// describe("getTitle", () => {
//     it("returns a proper title", () => {
//         expect(getTitle("https://github.com/darii/cv")).toBe(
//             "github.com<span class='delimiter'>/</span>darii<span class='delimiter'>/</span>cv",
//         );
//     });
// });
//
// describe("getCurrentYear", () => {
//     it("returns a proper year", () => {
//         expect(getCurrentYear()).toBe(new Date().getFullYear());
//     });
// });
//
// describe("getTheProfessionalYears", () => {
//     it("returns a proper number of years", () => {
//         expect(getTheProfessionalYears(2005)).toBe("20 years");
//     });
// });
