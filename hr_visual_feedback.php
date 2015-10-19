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

add_action('init', 'create_post_type');
/**
 * Function to create our post type.
 */
function create_post_type() {
  register_post_type(
    'hrvf_feedback',
    array(
      'labels' => array(
        'name' => __('Feedback'),
        'singular_name' => __('Feedback'),
      ),
      'public' => FALSE,
      'has_archive' => FALSE,
    )
  );
}
