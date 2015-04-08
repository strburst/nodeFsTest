$(function() {
  // Create a fake <a> and use it to extract the pathname from the current url
  var urlParse = document.createElement('a');
  urlParse.href = document.URL;
  var filepath = urlParse.pathname;

  // Append the pathname to the page heading
  $('h1').append(filepath);
  // Trailing spaces in <title> are ignored :(
  document.title = document.title + " " + filepath;

  var filesHTML = files.reduce(function(prev, elem) {
    return prev + buildHTMLFile(document.URL, elem);
  }, "");

  $('#fileArea').html(filesHTML);
});

function buildHTMLFile(baseURL, fileName) {
  return '<p><a href="' + baseURL + '/' + fileName + '">' + fileName + '</a></p>';
}
