

/* If you don't know channel ID, use this site: http://johnnythetank.github.io/youtube-channel-name-converter/ */
const channelId = "UChAHYPBvyaQIpjyTSdQhOMQ";
const videoHeight = 280;
const videoWidth = 500;
const maxResults = 5;
const moreMaxResults = 2;

let thumbListWidth = $('#results').width();
let positionX = 0;
let clickCount = 1;

const video = $('#video');
let playlistId;
let flag = false;
let timer = 0;
let nextPage;
let responseData;
let direction;

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
					loadThumbnails();
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
					loadThumbnails();
					flag = true;
				}
			);
		}
	}

	function toggleArrow () {
		if (prevPage == undefined){
			$('#prev').addClass('disabled');
			$('#prev').attr("disabled", true)
		} else {
			$('#prev').removeClass('disabled');
			$('#prev').attr("disabled", false)
		}
	}

	function moveThumbnails () {
		clearTimeout(timer);
		timer = 0;
		if (direction === 'right') {
			$('#results li').each(function(i){
			  $(this).css("transform", `translateX(-${positionX}px)`);
			});
		} else {
		
		}
	}

	function loadThumbnails() {
		let ready = false;
		nextPage = responseData.nextPageToken;
		prevPage = responseData.prevPageToken;
		// toggleArrow();
		let thumbnails = '';

		$.each(responseData.items, function(i, item){
			const list = `<li><img data-id="${item.snippet.resourceId.videoId}" class="thumbnail" src="${item.snippet.thumbnails.default.url}"></li>`;
			thumbnails += list;
		})		

		if (direction === 'left') {
			$('#results').prepend(thumbnails);
			ready = true;
		} else {
			$('#results').append(thumbnails);
			ready = true;
		}

		getCurrentVideo();
		if (direction) {
			moveThumbnails();
			// timer = setTimeout(moveThumbnails, 1)
		};
	}

	function getCurrentVideo () {
		$.each(responseData.items, function(i, item){
			if (video.attr('data-id') == `${item.snippet.resourceId.videoId}`) {
				const videoId = item.snippet.resourceId.videoId;
				const videoTitle = item.snippet.title;
				$('#title').html(videoTitle);
				runVideo(videoId);
				if (!flag) video.html(`<img data-id="${item.snippet.resourceId.videoId}" class="main-thumbnail" src="${item.snippet.thumbnails.maxres.url}">`);
			}
		});
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


    function prevPage(e) {
    	e.preventDefault();
	  	getVideos(playlistId, prevPage);
	}

	$('#next').click(function (e){
		e.preventDefault();
		direction = 'right';
	  	getVideos(playlistId, nextPage);
	  	positionX = positionX + thumbListWidth;
	  	clickCount++;
	});

	$('#prev').click(function (e){
		e.preventDefault();
		direction = 'left';
	  	getVideos(playlistId, prevPage);
	});

	$( "#results").on( "click", "img", function(e) {
		e.preventDefault();
		let newId = $(this).data('id');
    	video.attr("data-id", newId);
    	video.removeClass('youtube-player');
    	getCurrentVideo();
	})

	video.click(function(){
		video.removeClass('youtube-player');
		getCurrentVideo();
	});
});