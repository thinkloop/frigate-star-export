const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

run();
async function run() {

	// prompt user for frigate url 
	const baseURL = await new Promise((resolve) => (rl.question('URL to frigate (http://nas.example:5000): ', (answer) => (resolve(answer)))));

	// get list of all starred videos
	const listOfAllStarredVideos = await (async () => {
		const resp = await fetch(`${baseURL}/api/events?favorites=1&limit=-1&include_thumbnails=0`);
		if (!resp.ok) {
			throw new Error(`Response status: ${resp.status}`);
		}
		const json = await resp.json();
		return json.sort((a, b) => b.start_time - a.start_time);
	})();

	console.log(`
***************************************
found ${listOfAllStarredVideos.length} starred videos, exporting...
***************************************`);

	// loop through starred videos and trigger an export for each
	for (i = 0; i < listOfAllStarredVideos.length; i++) {
		const video = listOfAllStarredVideos[i];

		// trigger export in frigate
		const exportURL = `${baseURL}/api/export/${video.camera}/start/${video.start_time}/end/${video.end_time}`;
		const videoResp = await fetch(exportURL, { method: 'POST' });
		const msg = await videoResp.text();

		// print response
		const seconds = Math.round(video.end_time - video.start_time);
		const waitSeconds = Math.round(seconds * 40 / 100) / 10;
		if (!videoResp.ok) {
			const startDate = new Date(Math.ceil(video.start_time * 1000)).toISOString();
			const endDate = new Date(Math.floor(video.start_time * 1000)).toISOString();
			console.error(`Failed to export: ${video.camera} - ${seconds}s - ${video.start_time} (${startDate}) >> ${video.end_time} (${endDate}), ${msg}`);
		}
		else {
			console.info(`${i + 1}. ${video.camera} - ${formatDateTime(video.start_time, video.end_time, seconds)} [wait ${waitSeconds}s...]`);
		}

		// wait a few seconds depending on the duration of the video
		await new Promise((resolve) => {
			setTimeout(resolve, waitSeconds * 1000);
		});
	}
	rl.close();
}

function formatDateTime(dateA, dateB, seconds) {
	const startDate = new Date(Math.round(dateA * 1000));
	const startYear = startDate.getFullYear();
	const startMonth = startDate.getMonth().toString().padStart(2, '0');
	const startDay = startDate.getDate().toString().padStart(2, '0');
	const startHours = startDate.getHours().toString().padStart(2, '0');
	const startMinutes = startDate.getMinutes().toString().padStart(2, '0');
	const startSeconds = startDate.getSeconds().toString().padStart(2, '0');

	const endDate = new Date(Math.round(dateB * 1000));
	const endHours = endDate.getHours().toString().padStart(2, '0');
	const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
	const endSeconds = endDate.getSeconds().toString().padStart(2, '0');

	return `${startYear}/${startMonth}/${startDay} - ${startHours}:${startMinutes}:${startSeconds} > ${seconds}s > ${endHours}:${endMinutes}:${endSeconds}`;
}