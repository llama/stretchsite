
MAX_SCALE_FACTOR = 4

sliderForScaleFactor = (scaleFactor) ->
  return Math.log(scaleFactor) / Math.log(MAX_SCALE_FACTOR)

scaleFactorForSlider = (sliderVal) ->
  return Math.pow(MAX_SCALE_FACTOR, sliderVal)

if Meteor.isClient

  Meteor.startup ()->
    vurl = getParameterByName('videoUrl')
    scale = getParameterByName('scaleFactor')
    zoom = getParameterByName('zoomFactor')
    
    if vurl
      $('#videourl').val(vurl)
      updateForVideoUrl()

    if zoom
      $('#zoom').val(sliderForScaleFactor(zoom))
      updateForRange(false)

    if scale
      $('#scale').val(sliderForScaleFactor(scale))
      updateForRange(false)


  getId = (url) ->
    regExp = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/
    match = url.match(regExp)
    if match and match[1].length == 11
      match[1]
    else
      'error'

  updateVideoTimeout = null
  updateForRange = (changeUrl=true)->
    scale =  $('#scale').val()
    scale =  scaleFactorForSlider(scale)
    zoom  =  $('#zoom').val()
    zoom  =  scaleFactorForSlider(zoom)

    clearTimeout(updateVideoTimeout)
    if changeUrl
      updateVideoTimeout = setTimeout (()-> 
        updateQueryStringParameter('scaleFactor',scale.toFixed(3))
        updateQueryStringParameter('zoomFactor',zoom.toFixed(3))), 300


    vid = $('#thevideo')
    transform = "scaleX(#{zoom*scale}) scaleY(#{zoom})" #" translateY(#{(zoom-1) * vid.height()/zoom/2}px)"
    vid.css({'transform': transform, '-webkit-transform': transform})

  updateForVideoUrl = ()->
    val = $('#videourl').val()
    updateQueryStringParameter('videoUrl',val)
    myId = getId(val)
    $('iframe').attr('src','//www.youtube.com/embed/' + myId + '?autoplay=1')

  Template.main.events 
    'input #scale, input #zoom': updateForRange

    'input #videourl': updateForVideoUrl

    'click button': (b)->
      v = $(b.currentTarget).data('scale')
      $('#scale').val(sliderForScaleFactor(v))
      updateForRange()




if Meteor.isServer
  Meteor.startup ->
    # code to run on server at startup
    return



