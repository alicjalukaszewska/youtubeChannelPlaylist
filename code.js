
const channelId = "UCppPagXEXp7Ls6XM2Pk1vGQ";
const videoHeight = 300;
const videoWidth = 500;
const video = $('#video');

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
					const list = `<li><img data-id="${item.snippet.position}" class="thumbnail" src="${item.snippet.thumbnails.default.url}"></li>`;
					$('#results').append(list);
					$('#title').html(videoTitle);
					if (video.data('id') == `${item.snippet.position}`) getCurrentVideo(item);
				})
			}
		);
	}

	function getCurrentVideo (item) {
		const videoId = item.snippet.resourceId.videoId;
		video.html(`<img data-id="${videoId}" class="thumbnail" src="${item.snippet.thumbnails.high.url}">`);
	}

    function runVideo() {
        var iframe = document.createElement("iframe");
        var embed = "https://www.youtube.com/embed/ID?autoplay=1";
        iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");
        this.parentNode.replaceChild(iframe, this);
    }

	video.click(runVideo);
	$( "#results").on( "click", "img", function( event ) {
		console.log(event.target);
		let newId = $(this).data('id');
    	video.data('id', newId);
	})
});