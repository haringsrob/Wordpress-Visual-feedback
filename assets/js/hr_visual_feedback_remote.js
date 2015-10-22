if (typeof jQuery === 'undefined') {
    // jQuery is NOT available
    console.log('could not load hr visual feedback, jquery not available');
} else if (typeof html2canvas !== 'undefined') {
  // Set base config.
  var $floating_buttons = false,
      $allowfeedback = null;
  // init jqueyr.
  $ = jQuery;
  // On ready function.
  jQuery(document).ready(function() {
    // Add the button to the body
    $('body').append('<div class="hrvfb_element hrvfb_btn hrvfb_feedbackbutton">' + hrvfb_wp_data['hrvfb_action_feedback'] + '</div>');
    // Trigger onclick event;
    $(document).on('click', '.hrvfb_feedbackbutton:not(".hrvfb_feedback_active")', function(){
      $('body').addClass('hrvfb_feedback_active');
      $(this).addClass('hrvfb_feedback_active');
      $('.hrvfb_feedbackbutton').html('cancel');
      // Add the help message.
      hrvfb_set_help_text(hrvfb_wp_data['hrvfb_help_text_step_1']);
      // Set our allowfeedback variable to true.
      $allowfeedback = true;
    });
    // Undo the onclick event
    $(document).on('click', '.hrvfb_feedbackbutton.hrvfb_feedback_active', function(){
      hrvfb_remove_elements();
    });
  });
  // Dom selector.
  $(document).on('click', function(event){
    // Function buttons
    if ($allowfeedback && $(event.target).hasClass('hrvfb_element')) {
      event.preventDefault();
      //go up the dom
      if ($(event.target).hasClass('hrvfb_dom_up')) {
        if ($('.hrvfb_active_element').parent().length != 0) {
          $('.hrvfb_active_element').removeClass('hrvfb_active_element').parent().addClass('hrvfb_active_element');
          // Reposition buttons
          hrvfb_reposition_buttons();
        }
        else {
          hrvfb_throw_error('This is the first object!');
        }
      }
      // go down the dom
      if ($(event.target).hasClass('hrvfb_dom_down')) {
        if ($('.hrvfb_active_element').children().first().length != 0) {
          $('.hrvfb_active_element').removeClass('hrvfb_active_element').children().first().addClass('hrvfb_active_element');
          // Reposition buttons
          hrvfb_reposition_buttons();
        }
        else {
          hrvfb_throw_error('This is the last object!');
        }
      }
      // go next dom object
      if ($(event.target).hasClass('hrvfb_dom_next')) {
        if ($('.hrvfb_active_element').next().length != 0) {
          $('.hrvfb_active_element').removeClass('hrvfb_active_element').next().addClass('hrvfb_active_element');
          // Reposition buttons
          hrvfb_reposition_buttons();
        }
        else {
          hrvfb_throw_error('Next object not found');
        }
      }
      // go previous dom object
      if ($(event.target).hasClass('hrvfb_dom_previous')) {
        if ($('.hrvfb_active_element').prev().length != 0) {
          $('.hrvfb_active_element').removeClass('hrvfb_active_element').prev().addClass('hrvfb_active_element');
          // Reposition buttons
          hrvfb_reposition_buttons();
        }
        else {
          hrvfb_throw_error('Previous object not found');
        }
      }
    }
    // Set active element.
    if($allowfeedback && !$(event.target).hasClass('hrvfb_element')){
      // Disallow regular events.
      event.preventDefault();
      // Remove all other element classes.
      remove_all_active();
      // Set clicked item class.
      $(event.target).addClass('hrvfb_active_element');
      // Add the button to the document.
      if (hrvfb_wp_data['hrvfb_show_navigator'] === 1 && $('.hrvfb_dom_actions').length == 0) {
        $actionbuttons = '<div class="hrvfb_dom_actions hrvfb_element">';
        $actionbuttons += '<a href="#" class="hrvfb_element hrvfb_btn hrvfb_dom_up hrvfb_btn">' + hrvfb_wp_data['hrvfb_action_up'] + '</a>';
        $actionbuttons += '<a href="#" class="hrvfb_element hrvfb_btn hrvfb_dom_down">' + hrvfb_wp_data['hrvfb_action_down'] + '</a>';
        $actionbuttons += '<a href="#" class="hrvfb_element hrvfb_btn hrvfb_dom_previous">' + hrvfb_wp_data['hrvfb_action_prev'] + '</a>';
        $actionbuttons += '<a href="#" class="hrvfb_element hrvfb_btn hrvfb_dom_next">' + hrvfb_wp_data['hrvfb_action_next'] + '</a>';
        $actionbuttons += '</div>';
        $('body').append($actionbuttons);
      }
      // Add the ready button.
      if ($('.hrvfb_dom_ready').length == 0) {
        $('body').append('<div class="hrvfb_dom_ready hrvfb_element hrvfb_btn">' + hrvfb_wp_data['hrvfb_action_ready'] + '</div>');
      }
      // Help text update.
      hrvfb_set_help_text(hrvfb_wp_data['hrvfb_help_text_step_2']);
      // Set button position.
      hrvfb_reposition_buttons();
    }
  });
  // Cancel the dom action
  $(document).on('click', '.hrvfb_dom_cancel', function(event){
    hrvfb_remove_elements();
  });
  // When pressing escape.
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      hrvfb_remove_elements();
    }
  });
  // Send function.
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
    };
    // Do the ajax request.
    $.ajax({
      type: "POST",
      url: hrvfb_wp_data['site_post_url'],
      data: data,
      success: function(data, textStatus){
        alert(data);
        hrvfb_remove_elements();
      }
    });
  });
  // When element is selected.
  $(document).on('click', '.hrvfb_dom_ready', function(event){
    if($('.hrvfb_active_element').length != 0){
      // Html 2 canvas.
      html2canvas($('.hrvfb_active_element'), {
        onrendered: function(canvas) {
          // Remove all elements.
          hrvfb_remove_elements();
          // Render our display.
          $new_elements = '<div class="hrvfb_remove_overlay hrvfb_btn hrvfb_dom_send hrvfb_element">' + hrvfb_wp_data['hrvfb_action_send'] + '</div>';
          $new_elements += '<div class="hrvfb_remove_overlay hrvfb_btn hrvfb_dom_cancel hrvfb_element">' + hrvfb_wp_data['hrvfb_action_cancel'] + '</div>';
          $new_elements += '<div class="hrvfb_remove_overlay hrvfb_overlay hrvfb_element"></div>';
          $('body').append($new_elements).addClass('hrvfb__has-overlay').append(canvas);
          $('.hrvfb_overlay').css({
            'width': document.width+'px',
            'height': document.height+'px',
          });
          $(canvas).addClass('hrvfb_remove_overlay hrvfb_canvasobject hrvfb_element').attr('id', 'send_this_canvas');
          // calculate some sizes.
          var hrvfb_canvas_height = $('.hrvfb_canvasobject').height(),
              hrvfb_overlay_width  = $('.hrvfb_overlay').width(),
              hrvfb_canvas_newwidth = $('.hrvfb_canvasobject').width(),
              offsetleft  = (hrvfb_overlay_width-hrvfb_canvas_newwidth)/2;
          // Position the element.
          $('.hrvfb_canvasobject').css({
            'left': offsetleft+'px',
          });
          // Render the form.
          $overlay  = '<div class="hrvfb_remove_overlay hrvfb_element hrvfb_feedback_text">';
          $overlay += '<h2 class="hrvfb_element">' + hrvfb_wp_data['hrvfb_string_message'] + '</h2>';
          $overlay += '<textarea id="hrvfb_feedback_text" class="hrvfb_element"></textarea>';
          $overlay += '</div>';
          $('body').append($overlay);
          // Set some data.
          if(hrvfb_canvas_height<250){
            var form_offsettop = hrvfb_canvas_height+50;
          }else{
            var form_offsettop = 250+50;
          }
          var form_offsetleft = $('.hrvfb_overlay').width()/4,
              form_width = $('.hrvfb_overlay').width()/2;
          // Reposiition.
          $('.hrvfb_feedback_text').css({
            'top': form_offsettop+'px',
            'left': form_offsetleft+'px',
            'width': form_width+'px',
          });
        }
      });
    }
    else {
      hrvfb_throw_error('No element found, cannot complete.');
    }
  });
}
else {
  console.log('HTML2CANVAS is not available.');
}
// Helper function to remove elements.
function hrvfb_remove_elements(){
  $('body').removeClass('hrvfb_feedback_active').removeClass('hrvfb__has-overlay');
  $('.hrvfb_feedbackbutton.hrvfb_feedback_active').removeClass('hrvfb_feedback_active');
  $('.hrvfb_dom_actions, .hrvfb_dom_ready').remove();
  $('.hrvfb_remove_overlay').remove();
  $('.hrvfb_feedbackbutton').html('Feedback');
  remove_all_active();
  $allowfeedback = null;
}
// Helper function to position buttons.
function hrvfb_reposition_buttons(){
  if($floating_buttons){
    var target = $('.hrvfb_active_element');
    var hrvfb_position = $(target).position();
    $('.hrvfb_dom_actions').css({
      'left': hrvfb_position.left,
      'top': hrvfb_position.top,
    });
  }
  else {
    $('.hrvfb_dom_actions').css({
      'left': '10px',
      'bottom': '10px',
    });
  }
}
// Error helper.
function hrvfb_throw_error(message){
  if (hrvfb_wp_data['hrvfb_debug']) {
    alert(message);
  }
  else {
    console.log(message);
  }
}
// Helper function to remove active.
function remove_all_active(){
  $('.hrvfb_active_element').each(function() {
    $(this).removeClass('hrvfb_active_element');
  });
}
// Helper to show help messages.
function hrvfb_set_help_text(help_text) {
  $('body').append('<div class="hrvfb_help-text hrvfb_element"><div class="hrvfb_element hrvfb_help-text__content">' + help_text + '</div></div>');
  $('.hrvfb_help-text').fadeIn();
  setTimeout(function() {
    $('.hrvfb_help-text').fadeOut(300, function() {
      $(this).remove();
    });
  }, 5000);
}
