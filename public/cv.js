const data = {
	name: "John Doe",
	email: ["right", "center", "left"],
	phone: ["1", "2", "0", "3", "5", "4", "6", "8", "7", "9"],
	since: 2005,
	desiredRole: "Senior Software Developer",
	cv: "https://cv.username.com",
	location: {
		url: "https://maps.app.goo.gl/U3Hp5aWgkAzVUsRB7",
		title: "Montréal",
	},
	links: [
		{
			url: "https://github.com/username/cv",
			title: "github: username/cv",
		},
		{
			url: "https://www.linkedin.com/in/username",
			title: "linkedin: username",
		},
	],
};

globalThis.window.addEventListener("DOMContentLoaded", () => {
	const $ = (name) => document.querySelector(name) || null;
	const $$ = (name) => document.querySelectorAll(name) || null;

	document.title = `CV: ${data.name}`;
	$$(".author").forEach((element) => (element.innerText = data.name));

	$(".theCurrentYear").innerText = getCurrentYear();
	$(".theProfessionalYears").innerHTML = getTheProfessionalYears(data.since);
	$(".theDesiredRole").innerText = data.desiredRole;
	$(".thePhone").appendChild(phoneElementBuild(phoneDecode(data.phone)));
	$(".theEmail").appendChild(emailElementBuild(data.name, data.email));
	$(".theEmailRequest").appendChild(emailElementBuild(data.name, data.email, "request", "CV Reference Request"));
	$(".theCV").innerText = getTitle(data.cv);
	$(".theLocation").innerHTML = `<a href="${data.location.url}" target="_blank">${data.location.title}</a>`;
	data.links.forEach(({ url, title }) => {
		const item = document.createElement("li");
		item.innerHTML = `
			<a class="web" href="${url}" target="_blank">${title || getTitle(url)}</a>
			<span class="print">${getTitle(url)}</span>
			`;
		$(".contacts ul").appendChild(item);
	});
});

export function getTitle(url) {
	return url
		.replace(/https?:\/\/(www\.)?/, "")
		.replace(/\/$/, "")
		.replaceAll(/-/g, "&#8209;")
		.replaceAll("/", "<span class='delimiter'>/</span>")
		.replace("<span class='delimiter'>/</span>", "<br /><span class='intend delimiter'>/</span>");
}

export function getCurrentYear() {
	return new Date().getFullYear();
}

export function getTheProfessionalYears(sinceYear) {
	const years = getCurrentYear() - sinceYear;
	return years === 1 ? `${years}&nbsp;year` : `${years}&nbsp;years`;
}

export function emailElementBuild(aName, anEmail, title = "", emailTitle) {
	// noinspection JSUnusedGlobalSymbols
	return Object.assign(document.createElement("a"), {
		innerHTML: title || `${anEmail[2]}<span class="delimiter">&#0064</span>${anEmail[1]}.${anEmail[0]}`,
		onclick: () => {
			window.open(
				`mailto:"${aName}" <${anEmail[2]}@${anEmail[1]}.${anEmail[0]}>${emailTitle ? `?subject=${emailTitle}` : ""}`,
				"_blank",
			);
		},
	});
}

export function phoneElementBuild(aPhone) {
	return Object.assign(document.createElement("a"), {
		href: `tel:+1${aPhone}`,
		innerHTML: `${aPhone.slice(0, 3)}<span class="delimiter">&#0045;</span>${aPhone.slice(3, 6)}<span class="delimiter">&#0045;</span>${aPhone.slice(6)}`,
	});
}

export function phoneEncode(aPhone) {
	const p = aPhone instanceof Array ? aPhone : aPhone.split("");
	[p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]] =
		// eslint-disable-next-line no-self-assign
		[p[1], p[2], p[0], p[5], p[4], p[3], p[6], p[8], p[7], p[9]];
	return p.join("");
}

export function phoneDecode(aPhone) {
	const p = aPhone instanceof Array ? aPhone : aPhone.split("");
	[p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]] =
		// eslint-disable-next-line no-self-assign
		[p[2], p[0], p[1], p[5], p[4], p[3], p[6], p[8], p[7], p[9]];
	return p.join("");
}
