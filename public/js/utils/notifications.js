var Notificacoes = {
  showToast: function(message, type) {
    toastr.options = {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      timeOut: '3000'
    };
    if (type === 'success') {
      toastr.success(message);
    } else {
      toastr.error(message);
    }
  }
};