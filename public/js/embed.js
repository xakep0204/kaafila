var $win = $(window),
    $head = $("head"),
    $root = $("body");

var ratios = {},
    ratioStyles = '';

$('.responsive-ratio.dynamic').each(function(i){
  
  var $this = $(this),
    $video = $this.children().first(),
    width = ( $video.attr("width") || $video.width() ),
    height = ( $video.attr("height") || $video.height() ),
    ratio = ((height / width)*100),
    className = "Ratio_"+Math.floor(ratio);
  
  ratios[className] = ratio;
  $this.addClass(className);
  
});

$.each(ratios, function(key, value) {
  ratioStyles += '.dynamic.' + key + ':after { padding-bottom: '+value + '%; }\n';
});

$head.append("<style>"+ratioStyles+"</style>");