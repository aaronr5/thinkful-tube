var API_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';

var resultsPageTemplate = '<div>' +
                            '<form id="search-form" class="results-form" action="index.html" method="post">' +
                              '<input id="user-input" type="text" name="user-input" placeholder="Search Youtube...">' +
                              '<button id="submit-btn" type="submit" name="button"><span class="fa fa-search"></span></button>' +
                            '</form>' +
                            '<section class="results"></section>' +
                            '<footer></footer>' +
                          'div';

var resultsItemTemplate = '<div class="result-item">' +
                            '<img class="item-image" />' +
                            '<div class="item-info">' +
                              '<h3 class="item-title"></h3>' +
                              '<p class="item-channel"></p>' +
                              '<p class="item-description"></p>' +
                            '</div>' +
                          '</div>';



function getDataFromYT(searchValue, callback) {
  var settings = {
    url: API_ENDPOINT,
    data: {
      part: 'snippet',
      key: 'AIzaSyDkTx14QbY3_QlW-0jmypHQFrcHaGefzds',
      q: searchValue,
      type: 'video'
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}


function displayResults(data) {
  console.log(data);
  var resultsElement = $(resultsPageTemplate);
  $(resultsElement).find('.results').append(renderThumbnails(data.items));
  $('.container').html(resultsElement);
}

function renderThumbnails(itemArray) {
  var elementArray = itemArray.map(function(item) {
    var thisElement = $(resultsItemTemplate);
    thisElement.find('.item-image').attr('src', item.snippet.thumbnails.medium.url);
    thisElement.find('.item-title').append('<a href="#">' + item.snippet.title + '</a>');
    thisElement.find('.item-channel').text(item.snippet.channelTitle);
    thisElement.find('.item-description').text(item.snippet.description);
    return thisElement;
  });
  return elementArray;
}

// Event handlers //////////////////////////////////////////////////////////////
function watchForSubmit() {
  $('#search-form').submit(function(event) {
    event.preventDefault();
    var userInput = $('#user-input').val();
    console.log(userInput);
    getDataFromYT(userInput, displayResults);
  });
}

$(function() {watchForSubmit()});
