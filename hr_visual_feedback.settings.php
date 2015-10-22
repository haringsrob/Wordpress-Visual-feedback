<?php
/**
 * @file
 * Holds all our admin functions.
 */

// Add the menu item.
add_action('admin_menu', 'hr_visual_feedback_menu');

// If our helper function is not yet available, we include the file containing
// it.
if (!function_exists('renderForm')) {
  // Load our required file.
  require_once plugin_dir_path(__FILE__) . 'includeS/adminfunctions.php';
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

  wp_enqueue_style('hr_visual_feedback_style', plugins_url('assets/css/hr_visual_feedback_admin_style.css', __FILE__));

  $form_data = _hr_visual_feedback_get_form_info();
  // If our form is submitted, we parse the data.
  if (form_is_submitted($form_data['fields'])) {
    // Update options.
    ?>
    <div class="updated">
        <p><strong>HR Visual feedback: </strong> <?php _e('Data has been saved.', 'hrvfb'); ?> </p>
    </div>
    <?php
  }

  // Get our default values.
  $fields = fields_set_default_values($form_data['fields']);
  // Open the form tag.
  ?>
  <form name="icecat_settings_form" method="post" action="<?php echo str_replace('%7E', '~', $_SERVER['REQUEST_URI']); ?>">
    <input type="hidden" name="icecat_hidden" id="icecat_hidden" value="Y" />
    <?php print renderForm($form_data['groups'], $form_data['fields']); ?>
  </form>
  <?php
}

/**
 * Function to get the form.
 */
function _hr_visual_feedback_get_form_info() {
  // Define our groups.
  $form['groups'] = array(
    array(
      'group' => 'group_basic_config',
      'title' => 'Basic settings',
    ),
    array(
      'group' => 'group_debugging',
      'title' => 'Debugging',
    ),
    array(
      'group' => 'actions',
      'title' => '',
    ),
  );

  // Define our fields.
  $form['fields'] = array(
    array(
      'field_group'   => 'group_basic_config',
      'field_title'   => 'Show help text?',
      'field_name'    => 'hrvfb_setting_show_help_text',
      'field_type'    => 'boolean',
      'field_length'  => 1,
      'field_required' => FALSE,
      'field_default' => 1,
      'field_info'    => 'Show the default help text to the user providing feedback.',
    ),
    array(
      'field_group'   => 'group_debugging',
      'field_title'   => 'Log debug info to the console',
      'field_name'    => 'hrvfb_setting_debug',
      'field_type'    => 'boolean',
      'field_length'  => 1,
      'field_required' => FALSE,
      'field_default' => 0,
      'field_info'    => 'Enabling this will show the debug information in the console.',
    ),
    array(
      'field_group'   => 'actions',
      'field_title'   => 'Save settings',
      'field_name'    => 'Submit',
      'field_default' => 'Save',
      'field_type'    => 'submit',
    ),
  );

  return $form;
}
