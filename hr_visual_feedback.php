<?php
/**
 * @file
 * Visual Feedback main file. Contains includes and front end.
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

// Include our settings page functions.
require_once plugin_dir_path(__FILE__) . 'hr_visual_feedback.settings.php';
// Include our settings page functions.
require_once plugin_dir_path(__FILE__) . 'hr_visual_feedback.install.php';
// Include our settings page functions.
require_once plugin_dir_path(__FILE__) . 'hr_visual_feedback.ctt.php';
// Include our settings page functions.
require_once plugin_dir_path(__FILE__) . 'hr_visual_feedback.ajax.php';

/**
 * Generate the script we have to add.
 */
function hr_visual_feedback_init() {
  // Add jquery.
  wp_enqueue_script('jquery');
  // Add the style.
  wp_enqueue_style(
    'hr_visual_feedback_style',
    plugins_url('assets/css/hr_visual_feedback_style.css', __FILE__)
  );
  // Add html2canvas.
  wp_enqueue_script(
    'hr_visual_feedback_html2canvas',
    plugins_url('assets/js/html2canvas.min.js', __FILE__)
  );
  // Add the remote script.
  wp_enqueue_script(
    'hr_visual_feedback_remote',
    plugins_url('assets/js/hr_visual_feedback_remote.js', __FILE__)
  );

  // Add our variables.
  wp_localize_script(
    'hr_visual_feedback_remote',
    'hrvfb_wp_data',
    array(
      'site_post_url' => admin_url('admin-ajax.php'),
      // Options.
      'hrvfb_show_navigator' => 0,
      // Add real value here.
      'hrvfb_debug' => 0,
      // Help text.
      'hrvfb_help_text_step_1' => 'Now you can on something you want to give feedback about.',
      'hrvfb_help_text_step_2' => 'Good, Now you can navigate using the buttons on the left.',
      // Some general strings.
      'hrvfb_action_up' => __('Up'),
      'hrvfb_action_down' => __('Down'),
      'hrvfb_action_prev' => __('Previous'),
      'hrvfb_action_next' => __('Next'),
      'hrvfb_action_send' => __('Send'),
      'hrvfb_action_ready' => __('Ready'),
      'hrvfb_action_cancel' => __('Cancel'),
      'hrvfb_action_feedback' => __('Feedback'),
      'hrvfb_string_message' => __('Add some additional information'),
    )
  );
}

// Add the script to the footer, and other frontend actions.
add_action('wp_footer', 'hr_visual_feedback_init');
