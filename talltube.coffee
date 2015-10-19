if Meteor.isClient

  Meteor.startup ()->
    vurl = getParameterByName('videoUrl')
    scale = getParameterByName('scaleFactor')
    
    if vurl
      $('#videourl').val(vurl)
      updateForVideoUrl()

    if scale
      v = if scale<1 then (scale-0.5)*2 else ((scale-1)*2)+1
      $('#scale').val(v)
      updateForRange()



  getId = (url) ->
    regExp = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/
    match = url.match(regExp)
    if match and match[1].length == 11
      match[1]
    else
      'error'

  updateForRange = ()->
    val =  $('#scale').val()
    val =  if val<1 then (0.5 + val/2) else (1 + (val-1)*0.5)
    updateQueryStringParameter('scaleFactor',val)
    $('#thevideo').css({'transform': "scaleX(#{val})"})

  updateForVideoUrl = ()->
    val = $('#videourl').val()
    updateQueryStringParameter('videoUrl',val)
    myId = getId(val)
    $('iframe').attr('src','//www.youtube.com/embed/' + myId + '?autoplay=1')

  Template.hello.events 
    'input #scale': updateForRange

    'input #videourl': updateForVideoUrl

    'click button': (b)->
      v = $(b.currentTarget).data('scale')
      v = if v<1 then (v-0.5)*2 else ((v-1)*2)+1
      console.log v
      $('#scale').val(v)
      updateForRange()



if Meteor.isServer
  Meteor.startup ->
    # code to run on server at startup
    return



