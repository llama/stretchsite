updateQueryStringParameter = function(key, value) {
  if (!value) value='';

  value = encodeURIComponent(value);

  var uri = document.location.href;
  var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
  separator = uri.indexOf('?') !== -1 ? "&" : "?";
  var res;
  if (uri.match(re)) {
    res = uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    res = uri + separator + key + "=" + value;
  }
  window.history.replaceState({},"", res); // change replaceState to pushState if you want a new history entry
}


getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}



