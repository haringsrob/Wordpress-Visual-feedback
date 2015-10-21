<?php
/**
 * @file
 * Holds our installation functions.
 */

// Init the plugin.
add_action('init', 'hr_visual_feedback', 0);

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
