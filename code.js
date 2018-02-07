
const channelId = "UCppPagXEXp7Ls6XM2Pk1vGQ";
const videoHeight = 300;
const videoWidth = 500;

$(document).ready(function(){
	$.get(
		"https://www.googleapis.com/youtube/v3/channels", {
		part: 'contentDetails',
		id: channelId,
		key: 'AIzaSyBXpLUT6WzX24CqJb4rM4PKpWh7lfC3pZY'}, 

		function (data) {
			$.each(data.items, function(i, item){
				const playlistId = item.contentDetails.relatedPlaylists.uploads;
				getVideos(playlistId);
			})
		}
	);

	function getVideos (playlistId) {
		$.get(
			"https://www.googleapis.com/youtube/v3/playlistItems", {
			part: 'snippet',
			playlistId,
			maxResults: 25,
			key: 'AIzaSyBXpLUT6WzX24CqJb4rM4PKpWh7lfC3pZY'}, 

			function (data) {
				$.each(data.items, function(i, item){
					const videoTitle = item.snippet.title;
					const videoId = item.snippet.resourceId.videoId;
					const output = `<li><iframe src="https://www.youtube.com/embed/${videoId}" height="${videoHeight}" width="${videoWidth}"></iframe></li>`;
					$('#results').append(output);
				})
			}
		);
	}
})