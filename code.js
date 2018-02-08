

/* If you don't know channel ID, use this site: http://johnnythetank.github.io/youtube-channel-name-converter/ */
const channelId = "UChAHYPBvyaQIpjyTSdQhOMQ";
const videoHeight = 280;
const videoWidth = 500;
const maxResults = 5;


const video = $('#video');
let playlistId;
let flag = false;

$(document).ready(function(){
	$.get(
		"https://www.googleapis.com/youtube/v3/channels", {
		part: 'contentDetails',
		id: channelId,
		key: 'AIzaSyBXpLUT6WzX24CqJb4rM4PKpWh7lfC3pZY'}, 

		function (data) {
			$.each(data.items, function(i, item){
				playlistId = item.contentDetails.relatedPlaylists.uploads;
				getVideos(playlistId);
			})
		}
	);

	function getVideos (playlistId) {
		$.get(
			"https://www.googleapis.com/youtube/v3/playlistItems", {
			part: 'snippet',
			playlistId,
			maxResults,
			key: 'AIzaSyBXpLUT6WzX24CqJb4rM4PKpWh7lfC3pZY'}, 

			function (data) {
				console.log(data);
				$.each(data.items, function(i, item){
					if (!flag) {
						const list = `<li><img data-id="${item.snippet.position}" class="thumbnail" src="${item.snippet.thumbnails.default.url}"></li>`;
						$('#results').append(list);
					}
					if (video.attr('data-id') == `${item.snippet.position}`) getCurrentVideo(item);
				})
				flag = true;
			}
		);
	}

	function getCurrentVideo (item) {
		const videoId = item.snippet.resourceId.videoId;
		const videoTitle = item.snippet.title;
		$('#title').html(videoTitle);
		runVideo(videoId);
		if (!flag) video.html(`<img data-id="${videoId}" class="main-thumbnail" src="${item.snippet.thumbnails.maxres.url}">`);
		
	}

    function runVideo(videoId) {
		const iframe = document.createElement("iframe");
		var embed = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
		iframe.setAttribute("src", embed);
		iframe.setAttribute("width", `${videoWidth}`);
		iframe.setAttribute("height", `${videoHeight}`);
		iframe.setAttribute("frameborder", "0");
		iframe.setAttribute("controls", "2");
		iframe.setAttribute("allowfullscreen", "1");
		video.html(iframe);
    }

	
	$( "#results").on( "click", "img", function() {
		let newId = $(this).data('id');
    	video.attr("data-id", newId);
    	getVideos(playlistId);
	})

	video.click(() => getVideos(playlistId));
});