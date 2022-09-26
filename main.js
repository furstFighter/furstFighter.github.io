const prefetchCount = 2;
const prefetch = { nsfw: [], sfw: [] };
const NSFWDiv = document.querySelector("#nsfw"),
	  SFWDiv = document.querySelector("#sfw"),
	  NSFWOptions = document.querySelector("#nsfw-select"),
	  SFWOptions = document.querySelector("#sfw-select"),
	  image = document.querySelector("#waifu-image");

/* Detecting a change for NSFW selections */
const isNSFW = document.querySelector('input[type=checkbox]');    
function updateOptions() {
	NSFWDiv.style.display = isNSFW.checked ? "inline-block" : "none"
	SFWDiv.style.display = isNSFW.checked ? "none" : "inline-block"

	generateWaifu();
}

/* Fetches an image from both apis */
async function fetchWaifu() {
	/* Fetching nsfw */
	return [
		(await fetch(`https://api.waifu.pics/nsfw/${NSFWOptions.value}`)
		.then(response => response.json())
		.then(query => query.url)),
	
		/* Fetching sfw */
		(await fetch(`https://api.waifu.pics/sfw/${SFWOptions.value}`)
			.then(response => response.json())
			.then(query => query.url))
	]
}

/* Creates an image in the background to load a src */
function createPrefetchImages() {
	const prefetchImg = new Image();
	prefetchImg.style = "display: none;"
	prefetchImg.src = ""
	
	for (let i = 0; i < prefetchCount; i++) {
		prefetch.nsfw.push(prefetchImg.cloneNode());
		prefetch.sfw.push(prefetchImg.cloneNode());
		document.body.appendChild(prefetch.nsfw[i]);
		document.body.appendChild(prefetch.sfw[i]);
	}
}

/* Fetches multiple as a 'prefetch' so it can load faster */
async function prefetchWaifu() {
	const nsfwFirst = prefetch.nsfw.shift();
	const sfwFirst = prefetch.sfw.shift()	
	const [nsfwSrc, sfwSrc] = await fetchWaifu();

	nsfwFirst.src = nsfwSrc;
	sfwFirst.src = sfwSrc;
	prefetch.nsfw.push(nsfwFirst);
	prefetch.sfw.push(sfwFirst);
}

/* Gets an image and sets it as the src */
let previousCategory = undefined;
async function generateWaifu() {
	if (previousCategory != (isNSFW.checked ? NSFWOptions.value : SFWOptions.value).toString()) {
		for (let i = 0; i < prefetchCount; i++) { await prefetchWaifu() }
		previousCategory = (isNSFW.checked ? NSFWOptions.value : SFWOptions.value).toString()
	} else {
		prefetchWaifu();
	}

	image.src = isNSFW.checked ? prefetch.nsfw[0].src : prefetch.sfw[0].src;
}

/* Initial setup */
createPrefetchImages();
updateOptions();