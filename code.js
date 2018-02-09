

/* If you don't know channel ID, use this site: http://johnnythetank.github.io/youtube-channel-name-converter/ */
const channelId = "UChAHYPBvyaQIpjyTSdQhOMQ";
const videoHeight = 280;
const videoWidth = 500;
const maxResults = 5;


const video = $('#video');
let playlistId;
let flag = false;
let nextPage;
let responseData;

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
		if (pageToken) {
			$.get(
				"https://www.googleapis.com/youtube/v3/playlistItems", {
				part: 'snippet',
				pageToken,
				playlistId,
				maxResults,
				key: 'AIzaSyBXpLUT6WzX24CqJb4rM4PKpWh7lfC3pZY'}, 

				function (data) {
					responseData = data;
					useData();
				}
			);
		} else {
			$.get(
				"https://www.googleapis.com/youtube/v3/playlistItems", {
				part: 'snippet',
				playlistId,
				maxResults,
				key: 'AIzaSyBXpLUT6WzX24CqJb4rM4PKpWh7lfC3pZY'}, 

				function (data) {
					responseData = data;
					video.attr("data-id", data.items[0].snippet.resourceId.videoId);
					useData();
					flag = true;
				}
			);
		}
	}

	function useData() {
		console.log(responseData);
		nextPage = responseData.nextPageToken;
		prevPage = responseData.prevPageToken;
		$('#results').empty();
		$.each(responseData.items, function(i, item){
			const list = `<li><img data-id="${item.snippet.resourceId.videoId}" class="thumbnail" src="${item.snippet.thumbnails.default.url}"></li>`;
			$('#results').append(list);
			if (video.attr('data-id') == `${item.snippet.resourceId.videoId}`) getCurrentVideo(item); 
		})
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
	  	getVideos(playlistId, nextPage);
	}

    function prevPage(e) {
    	e.preventDefault();
	  	getVideos(playlistId, prevPage);
	}

	$('#next').click(nextPage);
	$('#prev').click(prevPage);

	$( "#results").on( "click", "img", function(e) {
		e.preventDefault();
		let newId = $(this).data('id');
    	video.attr("data-id", newId);
    	useData();
	})

	video.click(useData);
});