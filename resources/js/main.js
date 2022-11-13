const apis = {
    waifupics: {
        url: "https://api.waifu.pics/{0}/{1}",
        sfw: [
            "waifu",
            "neko",
            "shinobu",
            "megumin",
            "bully",
            "cuddle",
            "cry",
            "hug",
            "awoo",
            "kiss",
            "lick",
            "pat",
            "smug",
            "bonk",
            "yeet",
            "blush",
            "smile",
            "wave",
            "highfive",
            "handhold",
            "nom",
            "bite",
            "glomp",
            "slap",
            "kill",
            "kick",
            "happy",
            "wink",
            "poke",
            "dance",
            "cringe",
        ],
        nsfw: ["waifu", "neko", "trap", "blowjob"],
    },
    nekoslife: {
        url: "https:/nekos.life/api/v2/img/{1}",
        sfw: [
            "smug",
            "cuddle",
            "avatar",
            "slap",
            "pat",
            "gecg",
            "feed",
            "fox_girl",
            "lizard",
            "neko",
            "hug",
            "kiss",
            "ngif",
        ],
        nsfw: ["spank"],
    },
    anime: {
        url: "https://anime-api.hisoka17.repl.co/img/{1}",
        sfw: [
            "hug",
            "kiss",
            "punch",
            "slap",
            "wink",
            "pat",
            "kill",
            "cuddle",
            "waifu",
        ],
        nsfw: ["hentai", "boobs", "lesbian"],
    },
    catboys: {
        url: "https://api.catboys.com/{1}",
        sfw: ["img", "baka"],
    },
};

const xhttp = new XMLHttpRequest();
const api = document.getElementById("api");
const sfwtype = document.getElementById("sfw-type");
const nsfwtype = document.getElementById("nsfw-type");
const category = document.getElementById("category");
const generateBtn = document.getElementById("generate");
const loadingSpinner = generateBtn.querySelector(".spinner-border");
const sourceImage = document.getElementById("show-image");

let oldAPI = "none";
let oldType = "sfw";
let type = "sfw";

/**
 * Gets selected api categories
 * @returns {string[]} categories
 */
function getAPICategory() {
    const data = apis[api.value];
    if (!data) return false;

    return data[type];
}

/**
 * Updates the category options for the selected API
 */
function updateOptions() {
    // Prevent extra processing
    if (api.value === oldAPI && oldType === type) return;

    // Clear categories
    for (let i = category.options.length - 1; i > 0; i--) {
        category.options.remove(i);
    }

    // Get categories
    const categories = getAPICategory();
    if (!categories) {
        category.disabled = true;
        return;
    }

    // Add categories
    category.disabled = false;
    for (let i = 0; i < categories.length; i++) {
        category.add(new Option(categories[i], categories[i]));
    }
}

/**
 * Toggles the active button type
 */
function toggleButtons() {
    oldType = type;
    if (type === "sfw") {
        type = "nsfw";
        sfwtype.classList.remove("active");
        nsfwtype.classList.add("active");
    } else {
        type = "sfw";
        nsfwtype.classList.remove("active");
        sfwtype.classList.add("active");
    }
    updateOptions();
}

/**
 * Toggles the loading icon for the generate button
 * @param {boolean} state
 */
function toggleLoading(state) {
    if (!loadingSpinner.classList.contains("d-none") || state) {
        loadingSpinner.classList.add("d-none");
        generateBtn.lastChild.textContent = " Generate";
    } else {
        loadingSpinner.classList.remove("d-none");
        generateBtn.lastChild.textContent = " Generating...";
    }
}

/**
 *
 * @returns {string} URL
 */
function generateURL() {
    // Handling api
    const apiData = apis[api.value];
    if (!apiData) return false;

    // Handling category
    const selectedCat =
        category.value === "default" ? apiData.default : category.value;
    if (!selectedCat) return false;

    // Returning formatted string
    const args = [type, selectedCat];
    return apiData.url.replace(/{([0-9]+)}/g, function (match, index) {
        return typeof args[index] == undefined ? match : args[index];
    });
}

/**
 * Parses data and loads image
 */
function handleImage(event) {
    if (xhttp.status !== 200) return;
    const data = JSON.parse(xhttp.responseText);
    if (!data.url) {
        console.log("Handle Error");
        return;
    }

    document.getElementById("show-image").src = data.url;
}

/**
 * Generates images
 */
function generateImage() {
    const url = generateURL();
    if (!url) {
        console.log("Failed to generate url");
        // TODO: Make error prompt
        return;
    }

    // Making request
    toggleLoading();
    try {
        xhttp.open("GET", url);
        xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhttp.send();
    } catch (e) {
        console.log(`Failed to load. ${e}`);
        toggleLoading();
    }
}

// Called when ready
function init() {
    // Default settings
    updateOptions();
    toggleLoading(false);

    // Add event handlers
    sourceImage.onload = toggleLoading;
    api.addEventListener("focusout", updateOptions);
    xhttp.addEventListener("load", handleImage);
    xhttp.addEventListener("error", toggleLoading);
    sfwtype.addEventListener("click", toggleButtons);
    nsfwtype.addEventListener("click", toggleButtons);
    generateBtn.addEventListener("click", generateImage);
}
document.addEventListener("DOMContentLoaded", init);
