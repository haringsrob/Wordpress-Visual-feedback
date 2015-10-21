if (typeof jQuery === 'undefined') {
    // jQuery is NOT available
    console.log('could not load hr visual feedback, jquery not available');
} else {

  if(typeof html2canvas === 'undefined'){
    console.log('html2canvas not loaded. Adding it.');
    var scriptObject = document.createElement('script');
    var headTag = document.getElementsByTagName('head')[0];
    scriptObject.type = 'text/javascript';
    scriptObject.async = true;
    scriptObject.src = adminurl+'/assets/js/html2canvas.min.js';
    headTag.appendChild(scriptObject);
  }

  var $debug = false,
      $floating_buttons = false,
      $allowfeedback = null;

  jQuery(document).ready(function() {
    $ = jQuery;
    // Add the button to the body
    $('body').append('<div class="hrvfb_element hrvfb_btn hrvfb_feedbackbutton">Feedback</div>');

    // Trigger onclick event;
    $(document).on('click', '.hrvfb_feedbackbutton:not(".hrvfb_feedback_active")', function(){
      $('body').addClass('hrvfb_feedback_active');
      $(this).addClass('hrvfb_feedback_active');
      $('.hrvfb_feedbackbutton').html('cancel');
      // Add the help message.
      $('body').append('<div class="hrvfb_help-text hrvfb_element"><div class="hrvfb_element hrvfb_help-text__content">Now you can on something you want to give feedback about.</div></div>');
      $allowfeedback = true;
    });

    // Undo the onclick event
    $(document).on('click', '.hrvfb_feedbackbutton.hrvfb_feedback_active', function(){
      hrvfb_remove_elements();
    });
  });

  /**
  * The selector
  * @param  {[type]} event [description]
  * @return {[type]}       [description]
  */
  $(document).on('click', function(event){
    /*
    * Up/down button function
    */
    if($allowfeedback && $(event.target).hasClass('hrvfb_element')){
      event.preventDefault();
      //go up the dom
      if($(event.target).hasClass('hrvfb_dom_up')){
        if($('.hrvfb_active_element').parent().length != 0){
          $('.hrvfb_active_element').removeClass('hrvfb_active_element').parent().addClass('hrvfb_active_element');
          // Reposition buttons
          hrvfb_reposition_buttons();
        }else{
          hrvfb_throw_error($debug, 'This is the first object!');
        }
      }
      // go down the dom
      if($(event.target).hasClass('hrvfb_dom_down')){
        if($('.hrvfb_active_element').children().first().length != 0){
          $('.hrvfb_active_element').removeClass('hrvfb_active_element').children().first().addClass('hrvfb_active_element');
          // Reposition buttons
          hrvfb_reposition_buttons();
        }else{
          hrvfb_throw_error($debug, 'This is the last object!');
        }
      }
      // go next dom object
      if($(event.target).hasClass('hrvfb_dom_next')){
        if($('.hrvfb_active_element').next().length != 0){
          $('.hrvfb_active_element').removeClass('hrvfb_active_element').next().addClass('hrvfb_active_element');
          // Reposition buttons
          hrvfb_reposition_buttons();
        }else{
          hrvfb_throw_error($debug, 'Next object not found');
        }
      }
      // go previous dom object
      if($(event.target).hasClass('hrvfb_dom_previous')){
        if($('.hrvfb_active_element').prev().length != 0){
          $('.hrvfb_active_element').removeClass('hrvfb_active_element').prev().addClass('hrvfb_active_element');
          // Reposition buttons
          hrvfb_reposition_buttons();
        }else{
          hrvfb_throw_error($debug, 'Previous object not found');
        }
      }
    }

    /*
    * Set active.
    */
    if($allowfeedback && !$(event.target).hasClass('hrvfb_element')){
      event.preventDefault();

      // Remove all other element classes.
      remove_all_active();

      // Set clicked item class.
      $(event.target).addClass('hrvfb_active_element');

      // Add the button to the document.
      if($('.hrvfb_dom_actions').length == 0){
        $actionbuttons = '<div class="hrvfb_dom_actions hrvfb_element">';
        $actionbuttons += '<a href="#" class="hrvfb_element hrvfb_btn hrvfb_dom_up hrvfb_btn">Up</a>';
        $actionbuttons += '<a href="#" class="hrvfb_element hrvfb_btn hrvfb_dom_down">down</a>';
        $actionbuttons += '<a href="#" class="hrvfb_element hrvfb_btn hrvfb_dom_previous">prev</a>';
        $actionbuttons += '<a href="#" class="hrvfb_element hrvfb_btn hrvfb_dom_next">next</a>';
        $actionbuttons += '</div>';
        $('body').append($actionbuttons);
        $('body').append('<div class="hrvfb_dom_ready hrvfb_element hrvfb_btn">Ready</div>');
      }
      // Help text update.
      $('.hrvfb_help-text__content').html('Good, Now you can navigate using the buttons on the left.');

      // Set button position.
      hrvfb_reposition_buttons();
    }
  });

  /**
  * Cancel button click function.
  */
  $(document).on('click', '.hrvfb_dom_cancel', function(event){
    $('.hrvfb_remove_overlay').remove();
  });

  /**
   * Send button function
   */
  $(document).on('click', '.hrvfb_dom_send', function(event){
    var canvas = document.getElementById('send_this_canvas'),
        dataURL = canvas.toDataURL(),
        message = $('#hrvfb_feedback_text').val(),
        subject = $('#hrvfb_feedback_title').val(),
        action = 'hrvfb_submit_ticket',
        url = window.location.pathname;
    // Update the data url.
    dataURL = dataURL.replace('data:image/png;base64,','');
    var image = dataURL;
    // Set our full post.
    var data = {
      action: action,
      pst_subject: subject,
      pst_message: message,
      pst_image: image,
      pst_url: url,
      pst_sideid: siteid
    };
    // Do the ajax request.
    $.ajax({
      type: "POST",
      url: site_post_url,
      data: data,
      success: function(data, textStatus){
        alert(data);
        hrvfb_remove_elements();
      }
    });
  });

  /**
  * Ready button click function
  */
  $(document).on('click', '.hrvfb_dom_ready', function(event){
    if($('.hrvfb_active_element').length != 0){

      html2canvas($('.hrvfb_active_element'), {
        onrendered: function(canvas) {

          hrvfb_remove_elements();

          $('body').append('<div class="hrvfb_remove_overlay hrvfb_btn hrvfb_dom_send hrvfb_element">Send!</div>');
          $('body').append('<div class="hrvfb_remove_overlay hrvfb_btn hrvfb_dom_cancel hrvfb_element">Cancel!</div>');

          $('body').append('<div class="hrvfb_remove_overlay hrvfb_overlay hrvfb_element"></div>');

          $('.hrvfb_overlay').css({
            'width': document.width+'px',
            'height': document.height+'px',
          });

          $('body').addClass('hrvfb__has-overlay')

          $(canvas).addClass('hrvfb_remove_overlay hrvfb_canvasobject hrvfb_element');
          $(canvas).attr('id', 'send_this_canvas');
          $('body').append(canvas);

          var hrvfb_canvas_width  = $('.hrvfb_canvasobject').width();
          var hrvfb_canvas_height = $('.hrvfb_canvasobject').height();

          var hrvfb_overlay_width  = $('.hrvfb_overlay').width();
          var hrvfb_overlay_height = $('.hrvfb_overlay').height();

          var offsetleft  = (hrvfb_overlay_width-hrvfb_canvas_width)/2;

          $('.hrvfb_canvasobject').css({
            'left': offsetleft+'px',
          });

          var hrvfb_canvas_newwidth = $('.hrvfb_canvasobject').width();
          var offsetleft  = (hrvfb_overlay_width-hrvfb_canvas_newwidth)/2;

          $('.hrvfb_canvasobject').css({
            'left': offsetleft+'px',
          });

          $overlay  = '<div class="hrvfb_remove_overlay hrvfb_feedback_text">';
          $overlay += '<h2>Leave additional feedback information</h2>';
          $overlay += '<h3>Title</h3><input type="text" id="hrvfb_feedback_title" /><br />';
          $overlay += '<h3>message</h3><textarea id="hrvfb_feedback_text"></textarea>';
          $overlay += '</div>';
          $('body').append($overlay);

          if(hrvfb_canvas_height<250){
            var form_offsettop = hrvfb_canvas_height+50;
          }else{
            var form_offsettop = 250+50;
          }

          var form_offsetleft = $('.hrvfb_overlay').width()/4;
          var form_width = $('.hrvfb_overlay').width()/2;

          $('.hrvfb_feedback_text').css({
            'top': form_offsettop+'px',
            'left': form_offsetleft+'px',
            'width': form_width+'px',
          });

        }
      });

    }else{
      hrvfb_throw_error($debug, 'No element found, cannot complete.');
    }
  });

}

/**
 * Remove all har elements.
 */
function hrvfb_remove_elements(){
  $('body').removeClass('hrvfb_feedback_active');
  $('body').removeClass('hrvfb__has-overlay');
  $('.hrvfb_feedbackbutton.hrvfb_feedback_active').removeClass('hrvfb_feedback_active');
  $('.hrvfb_feedbackbutton').html('Feedback');
  $('.hrvfb_dom_actions, .hrvfb_dom_ready').remove();
  $('.hrvfb_remove_overlay').remove();
  remove_all_active();
  $allowfeedback = null;
}

/**
 * Repositioning function.
 */
function hrvfb_reposition_buttons(){
  if($floating_buttons){
    var target = $('.hrvfb_active_element');
    var hrvfb_position = $(target).position();
    $('.hrvfb_dom_actions').css({
      'left': hrvfb_position.left,
      'top': hrvfb_position.top,
    });
  }else{
    $('.hrvfb_dom_actions').css({
      'left': '10px',
      'bottom': '10px',
    });
  }
}

/**
 * Error function.
 */
function hrvfb_throw_error($debug, message){
  if ($debug) {
    alert(message);
  } else {
    console.log(message);
  }
}

/**
 * Remvove all active function.
 */
function remove_all_active(){
  $('.hrvfb_active_element').each(function() {
    $(this).removeClass('hrvfb_active_element');
  });
}
