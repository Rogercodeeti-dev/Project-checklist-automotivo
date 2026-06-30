var CepUtils = {
  buscar: function(cep, prefix, callback) {
    var cepDigits = (cep || '').replace(/\D/g, '');
    if (cepDigits.length !== 8) return;

    $.ajax({
      url: 'https://viacep.com.br/ws/' + cepDigits + '/json/',
      method: 'GET',
      dataType: 'json',
      timeout: 10000
    }).done(function(data) {
      if (!data || data.erro) return;
      $('#' + prefix + 'ds_street').val(data.logradouro || '');
      $('#' + prefix + 'ds_neighborhood').val(data.bairro || '');
      $('#' + prefix + 'nm_city').val(data.localidade || '');
      $('#' + prefix + 'sg_state').val(data.uf || '');
      if (typeof callback === 'function') callback(data);
    }).fail(function() {
      Notificacoes.showToast('Erro ao consultar CEP', 'error');
    });
  },

  aplicar: function(selector, prefix) {
    $(selector).on('blur', function() {
      CepUtils.buscar($(this).val(), prefix);
    });
  }
};