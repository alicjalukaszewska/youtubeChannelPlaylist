

/* If you don't know channel ID, use this site: http://johnnythetank.github.io/youtube-channel-name-converter/ */

const defaultChannelId = "UChAHYPBvyaQIpjyTSdQhOMQ";
const videoHeight = 280;
const videoWidth = 500;
const maxResults = 5;
const moreMaxResults = 2;

let thumbListWidth = $('#results').width();
let positionX = 0;

const video = $('#video');
let playlistId;
let afterFirstLoad = false;
let play = false;
let nextPage;
let responseData;
let direction;

$(document).ready(function(){
	function getChannelId() {
		let inputValue = $('#channelId').val();
		if (inputValue !== ''){
			channelId = inputValue;
		} else {
			channelId = defaultChannelId;
		}
		afterFirstLoad = false;
		$('#results').empty();
		getChannel();
	}

	$('#getChannel').on('click', getChannelId);
	$('#channelId').click(function () {
	   $(this).select();
	});
	getChannelId();

	function getChannel() {
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
	}

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
					afterFirstLoad = true;
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

	function removeHiddenThumbnails() {
		// $('.thumbnail').each(function(index, thumb) {
		// 	$.each(responseData.items, function(i, item){
		// 		if (item.snippet.resourceId.videoId === thumb.dataset.id) {
		// 			console.log(item.snippet.resourceId.videoId, thumb.dataset.id);
		// 		} else {
		// 			// $(thumb).closest('li').remove();
		// 		}
		// 	})
		// })

	}

	function moveThumbnails(thumbnails) {
		if (direction === 'left') {
			$('#results').prepend(thumbnails);
		} else {
			$('#results').append(thumbnails);
		}
		$('.list').on('transitionend', removeHiddenThumbnails);
		$('.list ul').css("transform", `translateX(-${positionX}px)`);

	}


	function loadThumbnails() {
		nextPage = responseData.nextPageToken;
		prevPage = responseData.prevPageToken;
		toggleArrow();
		let thumbnails = '';

		$.each(responseData.items, function(i, item){
			const list = `<li><img data-id="${item.snippet.resourceId.videoId}" class="thumbnail" src="${item.snippet.thumbnails.default.url}"></li>`;
			thumbnails += list;
		})
		if (!afterFirstLoad) $('#results').append(thumbnails);	
		if (direction) {
			moveThumbnails(thumbnails);
		};
		getCurrentVideo();
	}

	function getCurrentVideo () {
		$.each(responseData.items, function(i, item){
			if (video.attr('data-id') == `${item.snippet.resourceId.videoId}`) {
				const videoId = item.snippet.resourceId.videoId;
				const videoTitle = item.snippet.title;
				$('#videoTitle').html(videoTitle);
				
				if (play === false) {
					video.html(`<img data-id="${item.snippet.resourceId.videoId}" class="main-thumbnail" src="${item.snippet.thumbnails.maxres.url}">`)
				} else {
					video.removeClass('youtube-player-preview');
					runVideo(videoId);
				}
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


	$('#next').click(function (e){
		e.preventDefault();
		direction = 'right';
	  	getVideos(playlistId, nextPage);
	  	positionX = positionX + thumbListWidth;
	});

	$('#prev').click(function (e){
		e.preventDefault();
		direction = 'left';
		positionX = positionX - thumbListWidth;
	  	getVideos(playlistId, prevPage);
	});

	$( "#results").on( "click", "img", function(e) {
		e.preventDefault();
		let newId = $(this).data('id');
    	video.attr("data-id", newId);
    	play = true;
    	getCurrentVideo();
	})

	video.click(function(){
		play = true;
		getCurrentVideo();
	});
});