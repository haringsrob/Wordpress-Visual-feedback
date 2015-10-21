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
  wp_enqueue_style('hr_visual_feedback_style', plugins_url('assets/css/hr_visual_feedback_style.css', __FILE__));
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

// Add jQuery.
wp_enqueue_script("jquery");
// Add the script to the footer, and other frontend actions.
add_action('wp_footer', 'hr_visual_feedback_init');
