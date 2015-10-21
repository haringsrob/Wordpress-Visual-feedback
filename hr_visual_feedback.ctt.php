<?php
/**
 * @file
 * Holds our content type save functions and extra fields.
 */
// Save action for our post.
add_action('add_meta_boxes', 'hr_visual_feedback_add_fields');
// Add our meta boxes.
add_action('save_post', 'hr_visual_feedback_save_post', 10, 2);


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
