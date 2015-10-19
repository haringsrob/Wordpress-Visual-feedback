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

  var $debug            = false;
  var $floating_buttons = false;
  var $allowfeedback    = null;

  jQuery(document).ready(function() {
    $ = jQuery;
    // Add the button to the body
    $('body').addClass('har_button');
      $('body').append('<div class="har_button har_feedbackbutton" style="position: fixed; width: 150px; min-height: 50px; line-height: 50px; text-align: center; bottom: 10px; right: 10px; background: #fff; border: 1px solid #ccc;">Feedback</div>');

    // Trigger onclick event;
    $(document).on('click', '.har_feedbackbutton:not(".har_feedback_active")', function(){
      $('body').addClass('har_feedback_active');
      $(this).addClass('har_feedback_active');
      $('.har_feedbackbutton').html('cancel');
      $allowfeedback = true;
    });

    // Undo the onclick event
    $(document).on('click', '.har_feedbackbutton.har_feedback_active', function(){
      har_remove_elements();
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
    if($allowfeedback && $(event.target).hasClass('har_button')){
      event.preventDefault();
      //go up the dom
      if($(event.target).hasClass('har_dom_up')){
        if($('.har_active_element').parent().length != 0){
          $('.har_active_element').removeClass('har_active_element').parent().addClass('har_active_element');
          // Reposition buttons
          har_reposition_buttons();
        }else{
          har_throw_error($debug, 'This is the first object!');
        }
      }
      // go down the dom
      if($(event.target).hasClass('har_dom_down')){
        if($('.har_active_element').children().first().length != 0){
          $('.har_active_element').removeClass('har_active_element').children().first().addClass('har_active_element');
          // Reposition buttons
          har_reposition_buttons();
        }else{
          har_throw_error($debug, 'This is the last object!');
        }
      }
      // go next dom object
      if($(event.target).hasClass('har_dom_next')){
        if($('.har_active_element').next().length != 0){
          $('.har_active_element').removeClass('har_active_element').next().addClass('har_active_element');
          // Reposition buttons
          har_reposition_buttons();
        }else{
          har_throw_error($debug, 'Next object not found');
        }
      }
      // go previous dom object
      if($(event.target).hasClass('har_dom_previous')){
        if($('.har_active_element').prev().length != 0){
          $('.har_active_element').removeClass('har_active_element').prev().addClass('har_active_element');
          // Reposition buttons
          har_reposition_buttons();
        }else{
          har_throw_error($debug, 'Previous object not found');
        }
      }
    }

    /*
    * Set active
    */
    if($allowfeedback && !$(event.target).hasClass('har_button')){
      event.preventDefault();

      // Remove all other element classes
      remove_all_active();

      // Set clicked item class
      $(event.target).addClass('har_active_element');

      // Add the button to the document
      if($('.har_dom_actions').length == 0){
          $('body').append('<div class="har_dom_actions har_button"><a href="#" class="har_button har_dom_up">Up</a><a href="#" class="har_button har_dom_down">down</a><a href="#" class="har_button har_dom_previous">prev</a><a href="#" class="har_button har_dom_next">next</a></div>');
          $('body').append('<div class="har_dom_ready har_button" style="background: green; color: #fff; font-weight: bold; z-index: 9999; border: 1px solid #ccc; width: 150px; min-height: 50px; line-height: 50px; text-align: center; position: fixed; top: 10px; right: 10px;">Ready</div>');
      }
      // Set button position
      har_reposition_buttons();
    }
  });

  /**
  * Cancel button click function
  */
  $(document).on('click', '.har_dom_cancel', function(event){
    $('.har_remove_overlay').remove();
  });

  /**
   * Send button function
   */
  $(document).on('click', '.har_dom_send', function(event){

    var canvas  = document.getElementById('send_this_canvas');
    var dataURL = canvas.toDataURL();
        dataURL = dataURL.replace('data:image/png;base64,','');

        var message = $('#har_feedback_text').val();
        var subject = $('#har_feedback_title').val();
        var image   = dataURL;
        var url   = window.location.pathname;

        var data = {pst_subject: subject, pst_message:message ,pst_image:image, pst_url:url, pst_sideid:siteid};

        $.ajax({
      type: "POST",
      url: adminurl+'/admin/tickets/add_web_ticket',
      data: data,
      success: function(data, textStatus){
        alert(data);
      }
    });

  });

  /**
  * Ready button click function
  */
  $(document).on('click', '.har_dom_ready', function(event){
    if($('.har_active_element').length != 0){

      html2canvas($('.har_active_element'), {
        onrendered: function(canvas) {

          har_remove_elements();

          $('body').append('<div class="har_remove_overlay har_dom_send har_button" style="background: green; color: #fff; font-weight: bold; z-index: 9999; border: 1px solid #ccc; width: 150px; min-height: 50px; line-height: 50px; text-align: center; position: fixed; top: 10px; right: 10px;">Send!</div>');
          $('body').append('<div class="har_remove_overlay har_dom_cancel har_button" style="background: red; color: #fff; font-weight: bold; z-index: 9999; border: 1px solid #ccc; width: 150px; min-height: 50px; line-height: 50px; text-align: center; position: fixed; bottom: 10px; right: 10px;">Cancel!</div>');

          $('body').append('<div class="har_remove_overlay har_overlay har_button"></div>');

          $('.har_overlay').css({
            'width': document.width+'px',
            'height': document.height+'px',
            'background': '#fff',
            'z-index': '9990',
            'opacity': '0.9'
          });

          $(canvas).addClass('har_remove_overlay har_canvasobject har_button');
          $(canvas).attr('id', 'send_this_canvas');
          $('body').append(canvas);

          var har_canvas_width  = $('.har_canvasobject').width();
          var har_canvas_height = $('.har_canvasobject').height();

          var har_overlay_width  = $('.har_overlay').width();
          var har_overlay_height = $('.har_overlay').height();

          var offsetleft  = (har_overlay_width-har_canvas_width)/2;

          $('.har_canvasobject').css({
            'position': 'fixed',
            'top': '10px',
            'left': offsetleft+'px',
            'max-height': '250px',
            'overflow': 'hidden',
            'z-index': '9999',
            'background': '#fff',
            'border': '1px solid #ccc',
            'text-align': 'center',
          });

          var har_canvas_newwidth = $('.har_canvasobject').width();
          var offsetleft  = (har_overlay_width-har_canvas_newwidth)/2;

          $('.har_canvasobject').css({
            'left': offsetleft+'px',
          });

          $('body').append('<div class="har_remove_overlay har_feedback_text"><h2>Leave additional feedback information</h2><h3>Title</h3><input type="text" style="width: 100%" id="har_feedback_title" /><br /><h3>message</h3><textarea style="width: 100%" id="har_feedback_text"></textarea></div>');

          if(har_canvas_height<250){
            var form_offsettop = har_canvas_height+20;
          }else{
          var form_offsettop = 250+20;
          }

          var form_offsetleft = $('.har_overlay').width()/4;
          var form_width = $('.har_overlay').width()/2;

          $('.har_feedback_text').css({
            'position': 'fixed',
            'top': form_offsettop+'px',
            'left': form_offsetleft+'px',
            'width': form_width+'px',
            'min-height': '200px',
            'z-index': '9999'
          });

        }
      });

    }else{
      har_throw_error($debug, 'No element found, cannot complete.');
    }
  });

}

/**
 * Remove all har elements.
 */
function har_remove_elements(){
  $('body').removeClass('har_feedback_active');
  $('.har_feedbackbutton.har_feedback_active').removeClass('har_feedback_active');
  $('.har_feedbackbutton').html('Feedback');
  $('.har_dom_actions, .har_dom_ready').remove();
  remove_all_active();
  $allowfeedback = null;
}

/**
 * Repositioning function.
 */
function har_reposition_buttons(){
  if($floating_buttons){
    var target = $('.har_active_element');
    var har_position = $(target).position();
    $('.har_dom_actions').css({
      'position': 'absolute',
      'left': har_position.left,
      'top': har_position.top,
      'z-index': '99999'
    });
  }else{
    $('.har_dom_actions').css({
      'position': 'fixed',
      'left': '10px',
      'bottom': '10px',
      'z-index': '99999'
    });
  }
}

/**
 * Error function.
 */
function har_throw_error($debug, message){
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
  $('.har_active_element').each(function() {
    $(this).removeClass('har_active_element');
  });
}
