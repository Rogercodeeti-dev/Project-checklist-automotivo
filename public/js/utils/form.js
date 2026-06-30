var FormUtils = {
  showFieldError: function($input, message) {
    var $group = $input.closest('.form-group');
    $group.addClass('has-error');
    var $err = $group.find('.field-error');
    if (!$err.length) {
      $err = $('<span class="field-error"></span>');
      $group.append($err);
    }
    $err.text(message).show();
  },

  clearFieldError: function($input) {
    var $group = $input.closest('.form-group');
    $group.removeClass('has-error');
    $group.find('.field-error').hide();
  },

  clearAllErrors: function(formSelector) {
    $(formSelector).find('.form-group').removeClass('has-error');
    $(formSelector).find('.field-error').hide();
  },

  getFormData: function(formSelector) {
    return $(formSelector).serialize();
  },

  resetForm: function(formSelector) {
    $(formSelector)[0].reset();
    FormUtils.clearAllErrors(formSelector);
  },

  habilitarCampos: function(formSelector, campos) {
    campos.forEach(function(campo) {
      $(formSelector + ' input[name="' + campo + '"]').prop('disabled', false);
    });
  },

  desabilitarCampos: function(formSelector, campos) {
    campos.forEach(function(campo) {
      $(formSelector + ' input[name="' + campo + '"]').prop('disabled', true).val('');
    });
  }
};