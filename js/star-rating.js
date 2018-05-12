$(document).ready(function(){
  $("#flip").click(function(){
      $("#panel").slideToggle("slow");
  });

  var star_rating = $('.star-rating .fa-star');

  var SetRatingStar = function() {
    return star_rating.each(function() {
      if (parseInt(star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
        return $(this).removeClass('far').addClass('fas');
      } else {
        return $(this).removeClass('fas').addClass('far');
      }
    });
  };
  
  star_rating.on('click', function() {
    star_rating.siblings('input.rating-value').val($(this).data('rating'));
    return SetRatingStar();
  });
  
  SetRatingStar();
  $(document).ready(function() {
  
  });
});
