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
 * @return [type] [description]
 */
function hr_visual_feedback() {
  $labels = array(
    'name'                => _x( 'Visual Feedback', 'Post Type General Name', 'hrvfb' ),
    'singular_name'       => _x( 'Visual Feedback', 'Post Type Singular Name', 'hrvfb' ),
    'menu_name'           => __( 'Feedback', 'hrvfb' ),
    'name_admin_bar'      => __( 'Feedback', 'hrvfb' ),
    'parent_item_colon'   => __( 'Parent Item:', 'hrvfb' ),
    'all_items'           => __( 'All Submissions', 'hrvfb' ),
    'add_new_item'        => __( 'Add Feedback', 'hrvfb' ),
    'add_new'             => __( 'Add Feedback', 'hrvfb' ),
    'new_item'            => __( 'New Item', 'hrvfb' ),
    'edit_item'           => __( 'Edit Item', 'hrvfb' ),
    'update_item'         => __( 'Update Item', 'hrvfb' ),
    'view_item'           => __( 'View Item', 'hrvfb' ),
    'search_items'        => __( 'Search Item', 'hrvfb' ),
    'not_found'           => __( 'Not found', 'hrvfb' ),
    'not_found_in_trash'  => __( 'Not found in Trash', 'hrvfb' ),
  );
  $args = array(
    'label'               => __( 'Visual Feedback', 'hrvfb' ),
    'description'         => __( 'HR Visual Feedback item', 'hrvfb' ),
    'labels'              => $labels,
    'supports'            => array( 'title', 'editor', 'thumbnail', ),
    'hierarchical'        => false,
    'public'              => false,
    'show_ui'             => true,
    'show_in_menu'        => true,
    'menu_position'       => 5,
    'show_in_admin_bar'   => true,
    'show_in_nav_menus'   => false,
    'can_export'          => true,
    'has_archive'         => false,
    'exclude_from_search' => true,
    'publicly_queryable'  => false,
    'rewrite'             => false,
    'capability_type'     => 'post',
  );
  register_post_type( 'hrvfb_feedback', $args );
}

/**
 * Function to add the settings page.
 * @return [type] [description]
 */
function hr_visual_feedback_menu() {
	add_submenu_page( 'edit.php?post_type=hrvfb_feedback', 'HR Visual Feedback settings', 'Configuration', 'manage_options', 'hr_visual_feedback_options', 'hr_visual_feedback_options' );
}

/**
 * Our settings function.
 */
function hr_visual_feedback_options() {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
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
  $custom_script .= 'adminurl = "' . plugins_url('', __FILE__) . '";';
  $custom_script .= 'scriptObject .type = \'text/javascript\';';
  $custom_script .= 'scriptObject .async = true;';
  $custom_script .= 'scriptObject .src = "' .  plugins_url('assets/js/hr_visual_feedback_remote.js', __FILE__ ) . '";';
  $custom_script .= 'headTag.appendChild(scriptObject);';
  $custom_script .= '</script>';
  // To bad we have to echo this..
  echo $custom_script;
}

/**
 * Function to handle the ajax request.
 */
function hr_visual_feedback_handle_feedback_request() {

}

// Add jQuery.
wp_enqueue_script("jquery");
// Add the script to the footer.
add_action('wp_footer', 'hr_visual_feedback_get_tag');
// Init the plugin.
add_action('init', 'hr_visual_feedback', 0);
// Add the menu item.
add_action('admin_menu', 'hr_visual_feedback_menu');
// Add our action to accept the javascript request.
add_action('hrvfb_ajax_handler', 'hr_visual_feedback_handle_feedback_request');
