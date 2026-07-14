$(function() {
  var dtConfig = { language: { url: '/plugins/datatables/Portuguese.json' } };
  $('#tbclients').DataTable(dtConfig);

  function refreshClientsTable(callback) {
    $.post('/listclient', function(html) {
      var tbody = $(html).find('#tbclients tbody');
      var table = $('#tbclients').DataTable();
      table.destroy();
      $('#tbclients tbody').html(tbody.html());
      $('#tbclients').DataTable(dtConfig);
      if (typeof callback === 'function') callback();
    });
  }

  Mascaras.aplicar('#nr_cpf', Mascaras.cpf);
  Mascaras.aplicar('#nr_cnpj', Mascaras.cnpj);
  Mascaras.aplicar('#edit_nr_cpf', Mascaras.cpf);
  Mascaras.aplicar('#edit_nr_cnpj', Mascaras.cnpj);
  Mascaras.aplicar('#nr_phone, #nr_cellphone', Mascaras.phone);
  Mascaras.aplicar('#edit_nr_phone, #edit_nr_cellphone', Mascaras.phone);

  $('#nr_cpf').on('blur', function() {
    var val = $(this).val().trim();
    FormUtils.clearFieldError($(this));
    if (val !== '' && !Validadores.cpf(val)) {
      FormUtils.showFieldError($(this), 'CPF inválido.');
    }
  });

  $('#nr_cnpj').on('blur', function() {
    var val = $(this).val().trim();
    FormUtils.clearFieldError($(this));
    if (val !== '' && !Validadores.cnpj(val)) {
      FormUtils.showFieldError($(this), 'CNPJ inválido.');
    }
  });

  $('#edit_nr_cpf').on('blur', function() {
    var val = $(this).val().trim();
    FormUtils.clearFieldError($(this));
    if (val !== '' && !Validadores.cpf(val)) {
      FormUtils.showFieldError($(this), 'CPF inválido.');
    }
  });

  $('#edit_nr_cnpj').on('blur', function() {
    var val = $(this).val().trim();
    FormUtils.clearFieldError($(this));
    if (val !== '' && !Validadores.cnpj(val)) {
      FormUtils.showFieldError($(this), 'CNPJ inválido.');
    }
  });

  // ===================== TOGGLE PF / PJ =====================

  function togglePersonFields(type) {
    if (type === 'PJ') {
      $('#field-cpf').hide();
      $('#field-cnpj').show();
      $('#formClient input[name="nm_socialreazon"]').prop('disabled', false);
      $('#formClient input[name="nm_fantasy"]').prop('disabled', false);
    } else {
      $('#field-cpf').show();
      $('#field-cnpj').hide();
      $('#formClient input[name="nm_socialreazon"]').prop('disabled', true).val('');
      $('#formClient input[name="nm_fantasy"]').prop('disabled', true).val('');
    }
    FormUtils.clearFieldError($('#nr_cpf'));
    FormUtils.clearFieldError($('#nr_cnpj'));
  }

  function toggleEditPersonFields(type) {
    if (type === 'PJ') {
      $('#edit-field-cpf').hide();
      $('#edit-field-cnpj').show();
      $('#formEditClient input[name="nm_socialreazon"]').prop('disabled', false);
      $('#formEditClient input[name="nm_fantasy"]').prop('disabled', false);
    } else {
      $('#edit-field-cpf').show();
      $('#edit-field-cnpj').hide();
      $('#formEditClient input[name="nm_socialreazon"]').prop('disabled', true).val('');
      $('#formEditClient input[name="nm_fantasy"]').prop('disabled', true).val('');
    }
    FormUtils.clearFieldError($('#edit_nr_cpf'));
    FormUtils.clearFieldError($('#edit_nr_cnpj'));
  }

  $('#modalRegClient input[name="tp_person"]').on('change', function() {
    togglePersonFields($(this).val());
  });

  $('#modalEditClient input[name="tp_person"]').on('change', function() {
    toggleEditPersonFields($(this).val());
  });

  $('#modalRegClient').on('shown.bs.modal', function() {
    var type = $(this).find('input[name="tp_person"]:checked').val() || 'PF';
    togglePersonFields(type);
  });

  // ===================== BUSCA CEP =====================

  CepUtils.aplicar('#nr_zipcode', '');
  CepUtils.aplicar('#edit_nr_zipcode', 'edit_');

  // ===================== SALVAR CLIENTE =====================

  $('#btnSaveClient').on('click', function() {
    var form = $('#formClient');
    var personType = form.find('input[name="tp_person"]:checked').val() || 'F';
    var hasError = false;

    FormUtils.clearFieldError($('#nr_cpf'));
    FormUtils.clearFieldError($('#nr_cnpj'));

    if (personType === 'PF') {
      var cpf = $('#nr_cpf').val().trim();
      if (cpf !== '' && !Validadores.cpf(cpf)) {
        FormUtils.showFieldError($('#nr_cpf'), 'CPF inválido. Informe um CPF válido.');
        hasError = true;
      }
    } else {
      var cnpj = $('#nr_cnpj').val().trim();
      if (cnpj !== '' && !Validadores.cnpj(cnpj)) {
        FormUtils.showFieldError($('#nr_cnpj'), 'CNPJ inválido. Informe um CNPJ válido.');
        hasError = true;
      }
    }

    if (hasError) return;

    FormUtils.habilitarCampos('#formClient', ['nm_socialreazon', 'nm_fantasy']);

    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalRegClient').modal('hide');
        FormUtils.resetForm('#formClient');
        Notificacoes.showToast(res.message || 'Cadastro realizado com sucesso.', 'success');
        refreshClientsTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao salvar cliente', 'error');
      }
    }).fail(function(xhr) {
      console.error('Erro AJAX save_client:', xhr.responseText || xhr.statusText);
      Notificacoes.showToast('Erro ao salvar cliente', 'error');
    });
  });

  // ===================== EDITAR CLIENTE =====================

  $('#tbclients').on('click', '.edit-client', function() {
    var id = $(this).data('id');
    $.getJSON('/get_client?id=' + id, function(data) {
      if (!data || !data.id_client) {
        Notificacoes.showToast('Registro não encontrado', 'error');
        return;
      }

      $('#edit_client_id').val(data.id_client);
      $('#edit_nm_client').val(data.nm_client || '');
      $('#edit_nr_phone').val(data.nr_phone || '');
      $('#edit_nr_cellphone').val(data.nr_cellphone || '');
      $('#edit_ds_email').val(data.ds_email || '');
      $('#edit_nr_zipcode').val(data.nr_zipcode || '');
      $('#edit_nr_address').val(data.nr_address || '');

      // Define tipo de pessoa

      var tpPersonValue = data.tp_person === 'PJ' ? 'PJ' : 'PF';
      $('#modalEditClient input[name="tp_person"][value="' + tpPersonValue + '"]').prop('checked', true);

      // Mostra/esconde campos conforme tipo
      toggleEditPersonFields(tpPersonValue);

      // Preenche todos os campos
      $('#edit_nr_cpf').val(data.nr_cpf || '');
      $('#edit_nr_cnpj').val(data.nr_cnpj || '');
      $('#edit_nm_socialreazon').prop('disabled', tpPersonValue !== 'PJ').val(data.nm_socialreazon || '');
      $('#edit_nm_fantasy').prop('disabled', tpPersonValue !== 'PJ').val(data.nm_fantasy || '');

      // Busca endereço via CEP se houver zipcode
      if (data.nr_zipcode) {
        CepUtils.buscar(data.nr_zipcode, 'edit_');
      }

      FormUtils.clearFieldError($('#edit_nr_cpf'));
      FormUtils.clearFieldError($('#edit_nr_cnpj'));
      $('#clientEditAlert').hide();
      $('#modalEditClient').modal('show');
    }).fail(function() {
      Notificacoes.showToast('Erro ao buscar cliente', 'error');
    });
  });

  // ===================== ATUALIZAR CLIENTE =====================

  $('#btnUpdateClient').on('click', function() {
    var form = $('#formEditClient');
    var personType = form.find('input[name="tp_person"]:checked').val() || 'F';
    var hasError = false;

    FormUtils.clearFieldError($('#edit_nr_cpf'));
    FormUtils.clearFieldError($('#edit_nr_cnpj'));

    if (personType === 'PF') {
      var cpf = $('#edit_nr_cpf').val().trim();
      if (cpf !== '' && !Validadores.cpf(cpf)) {
        FormUtils.showFieldError($('#edit_nr_cpf'), 'CPF inválido. Informe um CPF válido.');
        hasError = true;
      }
    } else {
      var cnpj = $('#edit_nr_cnpj').val().trim();
      if (cnpj !== '' && !Validadores.cnpj(cnpj)) {
        FormUtils.showFieldError($('#edit_nr_cnpj'), 'CNPJ inválido. Informe um CNPJ válido.');
        hasError = true;
      }
    }

    if (hasError) return;

    FormUtils.habilitarCampos('#formEditClient', ['nm_socialreazon', 'nm_fantasy']);

    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalEditClient').modal('hide');
        Notificacoes.showToast(res.message || 'Alteração realizada com sucesso.', 'success');
        refreshClientsTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao atualizar cliente', 'error');
      }
    }).fail(function() {
      Notificacoes.showToast('Erro ao atualizar cliente', 'error');
    });
  });

  // ===================== EXCLUIR CLIENTE =====================

  var deleteClientId = null;

  $('#tbclients').on('click', '.delete-client', function() {
    deleteClientId = $(this).data('id');
    $('#modalExcluirClient').modal('show');
  });

  $('#confirmDeleteClientBtn').click(function() {
    if (!deleteClientId) return;
    $.post('/delete_client', { id: deleteClientId }, function(res) {
      if (res.success) {
        $('#modalExcluirClient').modal('hide');
        Notificacoes.showToast(res.message || 'Exclusão realizada com sucesso.', 'success');
        refreshClientsTable();
      } else {
        $('#modalExcluirClient').modal('hide');
        Notificacoes.showToast(res.message || 'Erro ao excluir', 'error');
      }
    }, 'json').fail(function() {
      $('#modalExcluirClient').modal('hide');
      Notificacoes.showToast('Erro na requisição', 'error');
    });
  });
});