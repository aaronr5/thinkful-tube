var API_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';

var state = {
  currentSearchTerm: false
};

// HTML Templates //////////////////////////////////////////////////////////////

var resultsPageTemplate = '<div>' +
                            '<form class="results-form" action="index.html" method="post">' +
                              '<input id="user-input" type="text" name="user-input" placeholder="Search Youtube...">' +
                              '<button id="submit-btn" class="result-page-submit" type="submit" name="button"><span class="fa fa-search"></span></button>' +
                            '</form>' +
                            '<h4 class="current-results-for"></h4>' +
                            '<section class="results"></section>' +
                            '<div class="page-controls">' +
                              '<button class="prev-page">&larr; Prev</button>' +
                              '<button class="next-page">Next &rarr;</button>' +
                            '</div>' +
                            '<footer><p>Made by Aaron Robertson.</footer>' +
                            '<div class="pop-out-wrapper">' +
                              '<span class="pop-out-close">&times;</span>' +
                              '<iframe frameborder="0" width="640" height= "360" id="video-frame"></iframe>' +
                            '</div>'+
                          '</div>';

var resultsItemTemplate = '<div class="result-item">' +
                            '<img class="item-image" />' +
                            '<div class="item-info">' +
                              '<h3 class="item-title"></h3>' +
                              '<p class="item-channel"></p>' +
                              '<p class="item-description"></p>' +
                            '</div>' +
                          '</div>';

var popOutTemplate = '<div class="pop-out-wrapper">' +
                        '<iframe></iframe>' +
                     '</div>';

// API Call ////////////////////////////////////////////////////////////////////

function getDataFromYT(searchValue, callback, token) {
  var settings = {
    url: API_ENDPOINT,
    data: {
      part: 'snippet',
      key: 'AIzaSyDkTx14QbY3_QlW-0jmypHQFrcHaGefzds',
      q: searchValue,
      type: 'video',
      pageToken: token
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

// DOM Rendering Functions /////////////////////////////////////////////////////


function displayResults(data) {
  window.scrollTo(0, 0);
  var resultsElement = $(resultsPageTemplate);
  $(resultsElement).find('.results').append(renderThumbnails(data.items));
  $(resultsElement).find('#user-input').attr('value', state.currentSearchTerm);
  $(resultsElement).find('.current-results-for').text('Showing results for: "' + state.currentSearchTerm + '"');
  if(!data.nextPageToken) {
    $(resultsElement).find('.page-controls').children('.next-page').hide();
  }else{
    $(resultsElement).find('.page-controls').children('.next-page').attr('data-next-page-token', data.nextPageToken);
  }
  if(!data.prevPageToken) {
    $(resultsElement).find('.page-controls').children('.prev-page').hide();
  }else{
    $(resultsElement).find('.page-controls').children('.prev-page').attr('data-prev-page-token', data.prevPageToken);
  }

  $('.container').html(resultsElement);
}

function renderThumbnails(itemArray) {
  var elementArray = itemArray.map(function(item) {
    var thisElement = $(resultsItemTemplate);
    thisElement.find('.item-image').attr('src', item.snippet.thumbnails.medium.url);
    thisElement.find('.item-image').attr('data-video-link', 'https://www.youtube.com/embed/' + item.id.videoId + '?autoplay=1');
    thisElement.find('.item-title').append('<a href="#">' + item.snippet.title + '</a>');
    thisElement.find('.item-title').attr('data-video-link', 'https://www.youtube.com/embed/' + item.id.videoId + '?autoplay=1');
    thisElement.find('.item-channel').text(item.snippet.channelTitle);
    thisElement.find('.item-description').text(item.snippet.description);
    return thisElement;
  });
  return elementArray;
}

function renderLightBox(videoLink) {
  $('.container').find('.pop-out-wrapper').css("display", "block");
  $('.container').find('#video-frame').attr('src', videoLink);
}

// functions ///////////////////////////////////////////////////////////////////

// Event handlers //////////////////////////////////////////////////////////////
function closePopOutClick() {
  $('.container').on('click', '.pop-out-close', function(event) {
    console.log('clicked');
    $('#video-frame').attr('src', '');
    $('.pop-out-wrapper').css('display', 'none');
  });
};

function prevPageClickHandler() {
  $('.container').on('click', '.prev-page', function(event) {
    var token = $(this).attr('data-prev-page-token');
    getDataFromYT(state.currentSearchTerm, displayResults, token);
  });
}

function nextPageClickHandler() {
  $('.container').on('click', '.next-page', function(event) {
    var token = $(this).attr('data-next-page-token');
    getDataFromYT(state.currentSearchTerm, displayResults, token);
  });
}

function titleClickHandler() {
  $('.container').on('click', '.item-title', function(event) {
    var videoLink = $(this).attr('data-video-link');
    renderLightBox(videoLink);
  });
}

function imageClickHandler() {
  $('.container').on('click', '.item-image', function(event) {
    var videoLink = $(this).attr('data-video-link');
    renderLightBox(videoLink);
  });
}

function watchForSubmit(state) {
  $('#search-form').submit(function(event) {
    event.preventDefault();
    state.currentSearchTerm = $('#user-input').val();
    if(!state.currentSearchTerm) {
      return;
    }else {
      getDataFromYT(state.currentSearchTerm, displayResults);
    }
  });
}

function submitOnResultsPage(state) {
  $('.container').on('click', ".result-page-submit", function(event) {
    event.preventDefault();
    state.currentSearchTerm = $('#user-input').val();
    if(!state.currentSearchTerm) {
      return;
    }else {
      getDataFromYT(state.currentSearchTerm, displayResults);
    }
  });
}

$(function() {
  watchForSubmit(state);
  imageClickHandler();
  titleClickHandler();
  nextPageClickHandler();
  prevPageClickHandler();
  closePopOutClick();
  submitOnResultsPage(state);
});
