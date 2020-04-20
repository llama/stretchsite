/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const MAX_SCALE_FACTOR = 4;
const FADE_OUT_AFTER_MILLISECONDS = 3*1000;

const sliderForScaleFactor = scaleFactor => Math.log(scaleFactor) / Math.log(MAX_SCALE_FACTOR);

const scaleFactorForSlider = sliderVal => Math.pow(MAX_SCALE_FACTOR, sliderVal);

if (Meteor.isClient) {
  this.fadeTimeout = null;

  //this function is called by the API
  onYouTubeIframeAPIReady = () => {
      console.log('onYouTubeIframeAPIReady');
      //creates the player object
      window.player = new YT.Player('thevideo');
      //subscribe to events
      player.addEventListener("onReady",       "onYouTubePlayerReady");
      player.addEventListener("onStateChange", "onYouTubePlayerStateChange");
  }

  onYouTubePlayerReady = (event) => {
      console.log('onYouTubePlayerReady');
      // event.target.playVideo();
  }

  onYouTubePlayerStateChange = (event) => {
      // console.log('onYouTubePlayerStateChange');
  }

  togglePlayPause = ()=> {
    if (player.getPlayerState() == YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  } 

  seek = (seconds) => {
    player.seekTo(player.getCurrentTime()+seconds, true);
  }

  toggleMute = () => {
    if (player.isMuted()) {
      player.unMute();
    } else {
      player.mute()
    }
  }


  // keypress would be better so we get repeating, but it doesnt work for arrow keys for some odd reason
  $('body').keyup(function(event) {
    switch (event.key) {
      case " ": 
        togglePlayPause();
        break
      case "k": 
        togglePlayPause();
        break
      case "ArrowLeft": 
        seek(-5);
        break
      case "ArrowRight": 
        seek(5);
        break
      case "j": 
        seek(-10);
        break
      case "l": 
        seek(10);
        break
      case "m":
        toggleMute();
        break
      case "ArrowUp":
        player.setVolume(player.getVolume()+5)
        break
      case "ArrowDown":
        player.setVolume(player.getVolume()-5)
        break
    }
  })


  var resetFade = function(){
    clearTimeout(window.fadeTimeout);
    $('.content').stop(true);
    $('.content').animate({opacity:1},50);
    window.fadeTimeout = setTimeout(function(){
      if ($('#videourl').val()) {
        $('.content').animate({opacity:0},1000);
      } else {
        resetFade();
      }
    }
    , FADE_OUT_AFTER_MILLISECONDS);
  };

  Meteor.startup(function(){
    const vurl = getParameterByName('videoUrl');
    const scale = getParameterByName('scaleFactor');
    const zoom = getParameterByName('zoomFactor');

    resetFade();
    $(window).focus(resetFade);

    if (vurl) {
      $('#videourl').val(vurl);
      updateForVideoUrl();
    }

    if (zoom) {
      $('#zoom').val(sliderForScaleFactor(zoom));
      updateForRange(false);
    }

    if (scale) {
      $('#scale').val(sliderForScaleFactor(scale));
      updateForRange(false);
    }
  });


  const getId = function(url) {
    const regExp = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/;
    const match = url.match(regExp);
    if (match && (match[1].length === 11)) {
      return match[1];
    } else {
      return 'error';
    }
  };

  let updateVideoTimeout = null;
  var updateForRange = function(changeUrl){
    if (changeUrl == null) { changeUrl = true; }
    let scale =  $('#scale').val();
    scale =  scaleFactorForSlider(scale);
    let zoom  =  $('#zoom').val();
    zoom  =  scaleFactorForSlider(zoom);

    clearTimeout(updateVideoTimeout);
    if (changeUrl) {
      updateVideoTimeout = setTimeout((function(){
        updateQueryStringParameter('scaleFactor',scale.toFixed(3));
        updateQueryStringParameter('zoomFactor',zoom.toFixed(3));}), 300);
    }


    const vid = $('#thevideo');
    const transform = `scaleX(${zoom*scale}) scaleY(${zoom})`; //" translateY(#{(zoom-1) * vid.height()/zoom/2}px)"
    vid.css({'transform': transform, '-webkit-transform': transform});
  };

  var updateForVideoUrl = function(){
    const val = $('#videourl').val();
    updateQueryStringParameter('videoUrl',val);
    const myId = getId(val);
    $('#ad').hide();
    $('iframe').attr('src','//www.youtube.com/embed/' + myId + '?autoplay=1&modestbranding=1&enablejsapi=1&fs=0'); // &origin=stretch.site
  };

  Template.main.events({
    'input #scale, input #zoom': updateForRange,

    'mousemove': resetFade,
    'focus': resetFade,
    'input #videourl': updateForVideoUrl,

    'click button'(b){
      const v = $(b.currentTarget).data('scale');
      $('#scale').val(sliderForScaleFactor(v));
      updateForRange();
    }
  });
}




if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
  });
}



