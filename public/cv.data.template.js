// Copy cvDataTemplate below to `cv.data.js` into export const cv_data = { }, and insert your cv.
export const cv_data_template = {
    name: "John Doe",
    since: 2000,
    desiredRole: "The role",
    summary:
        '**theProfessionalYears** <strong class="theProfessionalYears"></strong> ' +
        '**theDesiredRole** <strong class="theDesiredRole"></strong> ' +
        '[[theLocation]]<span class="theLocation"></span> ',
    location: {
        url: "https://www.google.com/maps/place/[[TheLocation]]",
        title: "[[The Location]]",
    },
    contacts: {
        email: ["right", "center", "left"], // stub "protection" from static crawlers.
        // `phoneEncode` is exported from this file. Use it to get the encoded phone for cv_data.
        // console.log(`phone: ["${window.phoneEncode("0123456789").join('", "')}"]`);
        phone: ["1", "2", "0", "3", "5", "4", "6", "8", "7", "9"],
        cv: "https://cv.username.com",
        location: {
            url: "https://www.google.com/maps/place/[[TheLocation]]",
            title: "[[The Location]]",
        },
        links: [
            {
                url: "https://github.com/[[username/cv]]",
                title: "github: [[username/cv]]",
            },
            {
                url: "https://www.linkedin.com/in/[[username]]",
                title: "linkedin: [[username]]",
            },
        ],
    },
    experience: [
        {
            role: "The Role or position",
            company: { name: "The company", url: "https://the.company.url" },
            location: { name: "The location", url: "https://www.google.com/maps/place/[[TheLocation]]/" },
            startDate: "2022-07-01",
            endDate: "2025-02-28",
            achievements: ["Achievement number one", "Achievement number two"],
        },
    ],
    expertise: [
        {
            title: "Main areas",
            skills: ["one", "two", "three"],
        },
    ],
};
