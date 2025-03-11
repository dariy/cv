import { CvBuilder } from "./cv.builder.js";
// `cv_data` has the same structure as `cv_data_template` in cv.data.template.js.
import { cv_data } from "./cv.data.js";
import { cv_data_template } from "./cv.data.template.js";

window.addEventListener("DOMContentLoaded", () => new CvBuilder().build(cv_data || cv_data_template));
