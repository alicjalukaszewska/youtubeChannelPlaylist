

/* If you don't know channel ID, use this site: http://johnnythetank.github.io/youtube-channel-name-converter/ */
const channelId = "UChAHYPBvyaQIpjyTSdQhOMQ";
const videoHeight = 280;
const videoWidth = 500;
const maxResults = 5;


const video = $('#video');
let playlistId;
let flag = false;
let nextPage;

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

	function getVideos (playlistId, pageToken) {
		$.get(
			"https://www.googleapis.com/youtube/v3/playlistItems", {
			part: 'snippet',
			playlistId,
			maxResults,
			key: 'AIzaSyBXpLUT6WzX24CqJb4rM4PKpWh7lfC3pZY'}, 

			function (data) {	
				if (pageToken) {
				   data.pageToken = pageToken;
				}
				console.log(data);
				nextPage = data.nextPageToken;
				prevPage = data.prevPageToken;
				$.each(data.items, function(i, item){
					video.attr("data-id", data.items[0].snippet.resourceId.videoId);
					if (!flag) {
						const list = `<li><img data-id="${item.snippet.resourceId.videoId}" class="thumbnail" src="${item.snippet.thumbnails.default.url}"></li>`;
						$('#results').append(list);
					}
					
					searchVideo(item);
				})
				flag = true;
			}
		);
	}

	function getNextPage (playlistId, pageToken) {
		$.get(
			"https://www.googleapis.com/youtube/v3/playlistItems", {
			part: 'snippet',
			pageToken,
			playlistId,
			maxResults,
			key: 'AIzaSyBXpLUT6WzX24CqJb4rM4PKpWh7lfC3pZY'}, 

			function (data) {	
				nextPage = data.nextPageToken;
				prevPage = data.prevPageToken;
				$.each(data.items, function(i, item){
					const list = `<li><img data-id="${item.snippet.resourceId.videoId}" class="thumbnail" src="${item.snippet.thumbnails.default.url}"></li>`;
					$('#results').append(list);
					searchVideo(item);
				})
			}
		);
	}

	function searchVideo (item) {
		if (video.attr('data-id') == `${item.snippet.resourceId.videoId}`) getCurrentVideo(item); 
	}


	function getCurrentVideo (item) {
		const videoId = item.snippet.resourceId.videoId;
		const videoTitle = item.snippet.title;
		$('#title').html(videoTitle);
		runVideo(videoId);
		if (!flag) video.html(`<img data-id="${item.snippet.resourceId.videoId}" class="main-thumbnail" src="${item.snippet.thumbnails.maxres.url}">`);
		
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

    function nextPage(e) {
    	e.preventDefault();
	  	getNextPage(playlistId, nextPage);
	}

    function prevPage(e) {
    	e.preventDefault();
	  	getNextPage(playlistId, prevPage);
	}

	$('#next').click(nextPage);
	$('#prev').click(prevPage);

	$( "#results").on( "click", "img", function() {
		let newId = $(this).data('id');
    	video.attr("data-id", newId);
    	console.log(newId);
    	getVideos(playlistId);
	})

	video.click(() => getVideos(playlistId));
});