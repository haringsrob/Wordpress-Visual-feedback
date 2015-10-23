<?php
/**
 * @file
 * Contains our ajax handeling functions.
 */

// Add our action to accept the javascript request. The first one is for a
// registered user, the second one for anonymous.
add_action('wp_ajax_nopriv_hrvfb_submit_ticket', 'hr_visual_feedback_handle_feedback_request');
add_action('wp_ajax_hrvfb_submit_ticket', 'hr_visual_feedback_handle_feedback_request');

/**
 * Function to handle the ajax request.
 */
function hr_visual_feedback_handle_feedback_request() {
  // Inintialize.
  $post_id = -1;

  // Set our data.
  $subject = (isset($_POST['pst_subject']) && !empty($_POST['pst_subject'])) ? sanitize_text_field($_POST['pst_subject']) : FALSE;
  $message = (isset($_POST['pst_message']) && !empty($_POST['pst_message'])) ? sanitize_text_field($_POST['pst_message']) : 'No message submitted';
  $image = (isset($_POST['pst_image']) && !empty($_POST['pst_image'])) ? $_POST['pst_image'] : FALSE;
  $url = (isset($_POST['pst_url']) && !empty($_POST['pst_url'])) ? sanitize_text_field($_POST['pst_url']) : FALSE;

  // Set our author id to 1.
  $author_id = 1;

  // If our subject is not set. We generate one.
  if (!$subject) {
    $subject = 'Feedback: submitted from "' . $url . '"';
  }

  // Add our message after our introduction.
  $message = $message . '<br /><hr />';
  $message .= 'Feedback: submitted from "' . $url . '"<br />';
  // Also add our browser information.
  $message .= '<br />User Agent:' . print_r($_SERVER['HTTP_USER_AGENT'], TRUE);

  // Create the post.
  $post_id = wp_insert_post(
    array(
      'comment_status'  => 'closed',
      'ping_status'     => 'closed',
      'post_author'     => $author_id,
      'post_name'       => sanitize_title($subject),
      'post_title'      => $subject,
      'post_status'     => 'publish',
      'post_type'       => 'hrvfb_feedback',
      'post_content'    => $message,
    )
  );

  if ($post_id > 0) {
    // Set the source.
    update_post_meta($post_id, 'hr_visual_feedback_source', $url);

    // Set our upload dir.
    $upload_dir = wp_upload_dir();
    // Set the full upload path.
    $upload_path = str_replace('/', DIRECTORY_SEPARATOR, $upload_dir['path']) . DIRECTORY_SEPARATOR;
    // Decode our file.
    $decoded = base64_decode($image);
    // Set our filename.
    $filename = $post_id . '_' . rand(10000, 999999) . '.png';
    // Do the upload.
    $image_upload = file_put_contents($upload_path . $filename, $decoded);
    // Handle the upload.
    if (!function_exists('wp_handle_sideload')) {
      require_once ABSPATH . 'wp-admin/includes/file.php';
    }
    if (!function_exists('wp_get_current_user')) {
      require_once ABSPATH . 'wp-includes/pluggable.php';
    }
    // Create our file array.
    $file             = array();
    $file['error']    = '';
    $file['tmp_name'] = $upload_path . $filename;
    $file['name']     = $filename;
    $file['type']     = 'image/png';
    $file['size']     = filesize($upload_path . $filename);
    // Upload file to server.
    $file_return = media_handle_sideload($file, $post_id);
    // If the file did not give an error.
    if (is_wp_error($file_return)) {
      echo 'Error handeling image';
      print_r($file);
      @unlink($file['tmp_name']);
    }
    else {
      set_post_thumbnail($post_id, $file_return);
    }

    // Show a message.
    echo __('We have received your feedback. Thank you for your submission.');
  }
  else {
    echo __('Something went wrong...');
  }

  die();
}
