if (typeof jQuery === 'undefined') {
    // jQuery is NOT available
    console.log('could not load hr visual feedback, jquery not available');
} else if (typeof html2canvas !== 'undefined') {
  // Set base config.
  var $floating_buttons = false,
      $allowfeedback = null,
      $dataurl;
  // init jqueyr.
  $ = jQuery;
  // On ready function.
  jQuery(document).ready(function() {
    console.log($.browser);
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
        dataURL = $dataurl,
        message = $('#hrvfb_feedback_text').val(),
        subject = $('#hrvfb_feedback_title').val(),
        action = 'hrvfb_submit_ticket',
        url = window.location.pathname,
        dataURL = dataURL.replace('data:image/png;base64,',''),
        image = dataURL;
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
        hrvfb_remove_elements();
        hrvfb_set_help_text(data);
      }
    });
  });
  // When element is selected.
  $(document).on('click', '.hrvfb_dom_ready', function(event){
    if($('.hrvfb_active_element').length != 0){
      $('.hrvfb_element.hrvfb_btn').fadeOut(100, function () {
        hrvfb_create_overlay();
      });
      $('.hrvfb_element.hrvfb_btn').fadeIn();
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


function hrvfb_get_cropped_element(div, target, myCallback){
  console.log('loaded');
  html2canvas($('body'), {
    onrendered:function(canvas) {
      var context = canvas.getContext('2d'),
          tmpCanvas = document.createElement('canvas'),
          context2 = canvas.getContext('2d'),
          imageObj = new Image();
      tmpCanvas.width = canvas.width;
      tmpCanvas.height = canvas.height;
      imageObj.onload = function() {
        var position = target.offset(),
            sourceX = position.left,
            sourceY = position.top,
            sourceWidth = target.outerWidth(),
            sourceHeight = target.outerHeight(),
            destWidth = sourceWidth,
            destHeight = sourceHeight,
            destX = canvas.width / 2 - destWidth / 2,
            destY = canvas.height / 2 - destHeight / 2;
        context2.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        var data = context2.getImageData(sourceX, sourceY, sourceWidth, sourceHeight);
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = sourceWidth;
        canvas.height = sourceHeight;
        context2.putImageData(data,0,0);
        var data_to_return;
        data_to_return = {"image":canvas.toDataURL('image/png'), "width":sourceWidth, "height":sourceHeight};
        myCallback(data_to_return);
        context.clearRect(0, 0,  sourceWidth, sourceHeight);
        context2.clearRect(0, 0, sourceWidth, sourceHeight);
        data = null;
        tmpCanvas = null;
        canvas = null;
        imageObj = null;
      };
      imageObj.src = tmpCanvas.toDataURL("image/png");
    }
  });
}
// Function to create the overlay.
function hrvfb_create_overlay() {
  hrvfb_get_cropped_element($('body'), $('.hrvfb_active_element'), function(canvas) {
    // Remove all elements
    hrvfb_remove_elements();
    $dataurl = canvas['image'];
    // Render our display.
    $new_elements = '<div class="hrvfb_remove_overlay hrvfb_btn hrvfb_dom_send hrvfb_element">' + hrvfb_wp_data['hrvfb_action_send'] + '</div>';
    $new_elements += '<div class="hrvfb_remove_overlay hrvfb_btn hrvfb_dom_cancel hrvfb_element">' + hrvfb_wp_data['hrvfb_action_cancel'] + '</div>';
    $new_elements += '<div class="hrvfb_remove_overlay hrvfb_overlay hrvfb_element"></div>';
    $('body').append($new_elements).addClass('hrvfb__has-overlay');
    $('.hrvfb_overlay').css({
      'width': document.width+'px',
      'height': document.height+'px',
    });
    $image_element = '<div class="hrvfb_element hrvfb_image_wrapper">';
    $image_element += '<img id="send_this_canvas" class="hrvfb_element hrvfb_remove_overlay hrvfb_image_element" src="' + canvas['image'] + '" ></div>';
    $('.hrvfb_overlay').append($image_element);
    // Render the form.
    $overlay  = '<div class="hrvfb_remove_overlay hrvfb_element hrvfb_feedback_text">';
    $overlay += '<h2 class="hrvfb_element">' + hrvfb_wp_data['hrvfb_string_message'] + '</h2>';
    $overlay += '<textarea id="hrvfb_feedback_text" class="hrvfb_element"></textarea>';
    $overlay += '</div>';
    $('.hrvfb_overlay').append($overlay);
    // Call our resize function.
    hrvfb_resize_overlay();
  });
}
// Function to change overlay size.
function hrvfb_resize_overlay() {
  $(window).resize(function() {
    $('.hrvfb_overlay').css({
      'width': document.width+'px',
      'height': document.height+'px',
    });
  });
}
