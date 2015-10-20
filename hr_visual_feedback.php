<?php
/**
 * @file
 * Visual Feedback main file.
 *
 * Plugin Name: HR Visual Feedback
 * Plugin URI: http://harings.be
 * Description: This plugin users to provide feedback by selecting a region of
 * the website.
 *
 * Author: harings_be
 * Version: 1
 * Author URI: http://www.harings.be.
 */

/**
 * Register our custom content type.
 */
function hr_visual_feedback() {
  $labels = array(
    'name'                => _x('Visual Feedback', 'Post Type General Name', 'hrvfb'),
    'singular_name'       => _x('Visual Feedback', 'Post Type Singular Name', 'hrvfb'),
    'menu_name'           => __('Feedback', 'hrvfb'),
    'name_admin_bar'      => __('Feedback', 'hrvfb'),
    'parent_item_colon'   => __('Parent Item:', 'hrvfb'),
    'all_items'           => __('All Submissions', 'hrvfb'),
    'add_new_item'        => __('Add Feedback', 'hrvfb'),
    'add_new'             => __('Add Feedback', 'hrvfb'),
    'new_item'            => __('New Item', 'hrvfb'),
    'edit_item'           => __('Edit Item', 'hrvfb'),
    'update_item'         => __('Update Item', 'hrvfb'),
    'view_item'           => __('View Item', 'hrvfb'),
    'search_items'        => __('Search Item', 'hrvfb'),
    'not_found'           => __('Not found', 'hrvfb'),
    'not_found_in_trash'  => __('Not found in Trash', 'hrvfb'),
  );
  $args = array(
    'label'               => __('Visual Feedback', 'hrvfb'),
    'description'         => __('HR Visual Feedback item', 'hrvfb'),
    'labels'              => $labels,
    'supports'            => array('title', 'editor', 'thumbnail'),
    'hierarchical'        => FALSE,
    'public'              => FALSE,
    'show_ui'             => TRUE,
    'show_in_menu'        => TRUE,
    'menu_position'       => 5,
    'show_in_admin_bar'   => TRUE,
    'show_in_nav_menus'   => FALSE,
    'can_export'          => TRUE,
    'has_archive'         => FALSE,
    'exclude_from_search' => TRUE,
    'publicly_queryable'  => FALSE,
    'rewrite'             => FALSE,
    'capability_type'     => 'post',
  );
  register_post_type('hrvfb_feedback', $args);
}

/**
 * Function to add the settings page.
 */
function hr_visual_feedback_menu() {
  add_submenu_page('edit.php?post_type=hrvfb_feedback', 'HR Visual Feedback settings', 'Configuration', 'manage_options', 'hr_visual_feedback_options', 'hr_visual_feedback_options');
}

/**
 * Our settings function.
 */
function hr_visual_feedback_options() {
  if (!current_user_can('manage_options')) {
    wp_die(__('You do not have sufficient permissions to access this page.'));
  }
  echo '<div class="wrap">';
  echo '<p>Here is where the form would go if I actually had options.</p>';
  echo '</div>';
}

/**
 * Generate the script we have to add.
 */
function hr_visual_feedback_get_tag() {
  // Our script.
  $custom_script = '<script type="text/javascript">';
  $custom_script .= 'var scriptObject = document.createElement(\'script\'),';
  $custom_script .= 'headTag = document.getElementsByTagName(\'head\')[0],';
  $custom_script .= 'siteid  = "0",';
  $custom_script .= 'site_post_url  = "' . admin_url('admin-ajax.php') . '",';
  $custom_script .= 'adminurl = "' . plugins_url('', __FILE__) . '";';
  $custom_script .= 'scriptObject .type = \'text/javascript\';';
  $custom_script .= 'scriptObject .async = true;';
  $custom_script .= 'scriptObject .src = "' . plugins_url('assets/js/hr_visual_feedback_remote.js', __FILE__) . '";';
  $custom_script .= 'headTag.appendChild(scriptObject);';
  $custom_script .= '</script>';
  // To bad we have to echo this..
  echo $custom_script;
}

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
  $message = 'Feedback: submitted from "' . $url . '"<br />' . $message;

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

/**
 * Add our meta boxes to hold custom data.
 */
function hr_visual_feedback_add_fields() {
  add_meta_box(
    'hr_visual_feedback_source',
    __('Extra information', 'hr_visual_feedback'),
    '_hr_visual_feedback_data_box',
    'hrvfb_feedback',
    'side',
    'default'
  );
}

/**
 * Helper to create the box itself.
 */
function _hr_visual_feedback_data_box($post) {
  // Required.
  wp_nonce_field('hr_visual_feeback_source', 'hr_visual_feeback_nonce');
  // Our source.
  echo '<label for="hr_visual_feedback_source">';
  _e("Submitted from", 'hr_visual_feedback_source');
  echo '</label> ';
  echo '<input type="text" id="hr_visual_feedback_source" name="hr_visual_feedback_source" value="' . esc_attr(get_post_meta($post->ID, 'hr_visual_feedback_source', TRUE)) . '" size="25" />';
}

/**
 * Function to save the extra data.
 */
function hr_visual_feedback_save_post($post_id, $post) {
  // Verify the nonce before proceeding.
  if (!isset($_POST['hr_visual_feeback_nonce']) || !wp_verify_nonce($_POST['hr_visual_feeback_nonce'], 'hr_visual_feeback_source')) {
    return $post_id;
  }
  // Get the post type object.
  $post_type = get_post_type_object($post->post_type);

  // Check if the current user has permission to edit the post.
  if (!current_user_can($post_type->cap->edit_post, $post_id)) {
    return $post_id;
  }

  // Get the posted data and sanitize it for use as an HTML class.
  $new_source_url = (isset($_POST['hr_visual_feedback_source']) ? sanitize_html_class($_POST['hr_visual_feedback_source']) : '');

  // Get the meta key.
  $source_key = 'hr_visual_feedback_source';

  // Get the meta value of the custom field key.
  $source_url = get_post_meta($post_id, $source_key, TRUE);

  // If a new meta value was added and there was no previous value, add it.
  if ($new_source_url && '' == $source_url) {
    add_post_meta($post_id, $source_key, $new_source_url, TRUE);
  }
  // If the new meta value does not match the old value, update it.
  elseif ($new_source_url && $new_source_url != $source_url) {
    update_post_meta($post_id, $source_key, $new_source_url);
  }
  // If there is no new meta value but an old value exists, delete it.
  elseif ('' == $new_source_url && $source_url) {
    delete_post_meta($post_id, $source_key, $source_url);
  }
}

// Save action for our post.
add_action('add_meta_boxes', 'hr_visual_feedback_add_fields');
// Add our meta boxes.
add_action('save_post', 'hr_visual_feedback_save_post', 10, 2);
// Add jQuery.
wp_enqueue_script("jquery");
// Add the script to the footer.
add_action('wp_footer', 'hr_visual_feedback_get_tag');
// Init the plugin.
add_action('init', 'hr_visual_feedback', 0);
// Add the menu item.
add_action('admin_menu', 'hr_visual_feedback_menu');
// Add our action to accept the javascript request. The first one is for a
// registered user, the second one for anonymous.
add_action('wp_ajax_nopriv_hrvfb_submit_ticket', 'hr_visual_feedback_handle_feedback_request');
add_action('wp_ajax_hrvfb_submit_ticket', 'hr_visual_feedback_handle_feedback_request');
