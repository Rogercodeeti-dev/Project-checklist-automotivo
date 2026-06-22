$(function(){
  var dtConfig = { language: { url: '/plugins/datatables/Portuguese.json' } };
  $('#tbclients').DataTable(dtConfig);

  // ===================== UTILITÁRIOS =====================

  function showToast(message, type) {
    toastr.options = { closeButton: true, progressBar: true, positionClass: 'toast-top-right', timeOut: '3000' };
    if (type === 'success') { toastr.success(message); }
    else { toastr.error(message); }
  }

  function showFieldError($input, message) {
    var $group = $input.closest('.form-group');
    $group.addClass('has-error');
    var $err = $group.find('.field-error');
    if (!$err.length) {
      $err = $('<span class="field-error"></span>');
      $group.append($err);
    }
    $err.text(message).show();
  }

  function clearFieldError($input) {
    var $group = $input.closest('.form-group');
    $group.removeClass('has-error');
    $group.find('.field-error').hide();
  }

  // ===================== VALIDAÇÃO CPF =====================

  function validateCPF(cpf) {
    var digits = (cpf || '').replace(/\D/g, '');
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;

    var sum = 0;
    for (var i = 0; i < 9; i++) {
      sum += parseInt(digits.charAt(i)) * (10 - i);
    }
    var rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(digits.charAt(9))) return false;

    sum = 0;
    for (var i = 0; i < 10; i++) {
      sum += parseInt(digits.charAt(i)) * (11 - i);
    }
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    return rev === parseInt(digits.charAt(10));
  }

  // ===================== VALIDAÇÃO CNPJ =====================

  function validateCNPJ(cnpj) {
    var digits = (cnpj || '').replace(/\D/g, '');
    if (digits.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(digits)) return false;

    var weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    var weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    var sum = 0;
    for (var i = 0; i < 12; i++) {
      sum += parseInt(digits.charAt(i)) * weights1[i];
    }
    var mod = sum % 11;
    var dig1 = mod < 2 ? 0 : 11 - mod;
    if (parseInt(digits.charAt(12)) !== dig1) return false;

    sum = 0;
    for (var i = 0; i < 13; i++) {
      sum += parseInt(digits.charAt(i)) * weights2[i];
    }
    mod = sum % 11;
    var dig2 = mod < 2 ? 0 : 11 - mod;
    return parseInt(digits.charAt(13)) === dig2;
  }

  // ===================== MÁSCARAS =====================

  function maskCPF(v) {
    v = v.replace(/\D/g, '').substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return v;
  }

  function maskCNPJ(v) {
    v = v.replace(/\D/g, '').substring(0, 14);
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
    return v;
  }

  function maskPhone(v) {
    v = v.replace(/\D/g, '').substring(0, 11);
    if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d*)/, '($1) $2');
    } else if (v.length > 0) {
      v = v.replace(/^(\d*)/, '($1');
    }
    return v;
  }

  $('#nr_cpf').on('input', function(){ $(this).val(maskCPF($(this).val())); });
  $('#nr_cnpj').on('input', function(){ $(this).val(maskCNPJ($(this).val())); });
  $('#edit_nr_cpf').on('input', function(){ $(this).val(maskCPF($(this).val())); });
  $('#edit_nr_cnpj').on('input', function(){ $(this).val(maskCNPJ($(this).val())); });
  $('#nr_phone, #nr_cellphone').on('input', function(){ $(this).val(maskPhone($(this).val())); });
  $('#edit_nr_phone, #edit_nr_cellphone').on('input', function(){ $(this).val(maskPhone($(this).val())); });

  // ===================== VALIDAÇÃO EM TEMPO REAL =====================

  $('#nr_cpf').on('blur', function(){
    var val = $(this).val().trim();
    clearFieldError($(this));
    if (val !== '' && !validateCPF(val)) {
      showFieldError($(this), 'CPF inválido.');
    }
  });

  $('#nr_cnpj').on('blur', function(){
    var val = $(this).val().trim();
    clearFieldError($(this));
    if (val !== '' && !validateCNPJ(val)) {
      showFieldError($(this), 'CNPJ inválido.');
    }
  });

  $('#edit_nr_cpf').on('blur', function(){
    var val = $(this).val().trim();
    clearFieldError($(this));
    if (val !== '' && !validateCPF(val)) {
      showFieldError($(this), 'CPF inválido.');
    }
  });

  $('#edit_nr_cnpj').on('blur', function(){
    var val = $(this).val().trim();
    clearFieldError($(this));
    if (val !== '' && !validateCNPJ(val)) {
      showFieldError($(this), 'CNPJ inválido.');
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
    clearFieldError($('#nr_cpf'));
    clearFieldError($('#nr_cnpj'));
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
      var social = $('#formEditClient input[name="nm_socialreazon"]').val();
      var fantasy = $('#formEditClient input[name="nm_fantasy"]').val();
      $('#formEditClient input[name="nm_socialreazon"]').prop('disabled', true);
      $('#formEditClient input[name="nm_fantasy"]').prop('disabled', true);
    }
    clearFieldError($('#edit_nr_cpf'));
    clearFieldError($('#edit_nr_cnpj'));
  }

  // Toggle no cadastro
  $('input[name="tp_person"]').on('change', function(){
    togglePersonFields($(this).val());
  });

  // Toggle na edição
  $('#modalEditClient').on('change', 'input[name="tp_person"]', function(){
    toggleEditPersonFields($(this).val());
  });

  // Estado inicial ao abrir modal de cadastro
  $('#modalRegClient').on('shown.bs.modal', function(){
    var type = $(this).find('input[name="tp_person"]:checked').val() || 'PF';
    togglePersonFields(type);
  });

  // Estado inicial ao abrir modal de edição
  $('#modalEditClient').on('shown.bs.modal', function(){
    var type = $(this).find('input[name="tp_person"]:checked').val() || 'PF';
    toggleEditPersonFields(type);
  });

  // ===================== REFRESH TABELA =====================

  function refreshClientsTable(callback) {
    $.post('/listclient', function(html){
      var tbody = $(html).find('#tbclients tbody');
      var table = $('#tbclients').DataTable();
      table.destroy();
      $('#tbclients tbody').html(tbody.html());
      $('#tbclients').DataTable(dtConfig);
      if (typeof callback === 'function') callback();
    });
  }

  // ===================== BUSCA CEP =====================

  function fetchCep(cep, prefix) {
    var cepDigits = (cep || '').replace(/\D/g, '');
    if (cepDigits.length !== 8) return;
    $.ajax({
      url: 'https://viacep.com.br/ws/' + cepDigits + '/json/',
      method: 'GET', dataType: 'json', timeout: 10000
    }).done(function(data) {
      if (!data || data.erro) return;
      $('#' + prefix + 'ds_street').val(data.logradouro || '');
      $('#' + prefix + 'ds_neighborhood').val(data.bairro || '');
      $('#' + prefix + 'nm_city').val(data.localidade || '');
      $('#' + prefix + 'sg_state').val(data.uf || '');
    });
  }

  $('#nr_zipcode').on('blur', function(){ fetchCep($(this).val(), ''); });
  $('#edit_nr_zipcode').on('blur', function(){ fetchCep($(this).val(), 'edit_'); });

  // ===================== SALVAR CLIENTE =====================

  $('#btnSaveClient').on('click', function(){
    var form = $('#formClient');
    var personType = form.find('input[name="tp_person"]:checked').val() || 'F';
    var hasError = false;

    clearFieldError($('#nr_cpf'));
    clearFieldError($('#nr_cnpj'));

    if (personType === 'F') {
      var cpf = $('#nr_cpf').val().trim();
      if (cpf !== '' && !validateCPF(cpf)) {
        showFieldError($('#nr_cpf'), 'CPF inválido. Informe um CPF válido.');
        hasError = true;
      }
    } else {
      var cnpj = $('#nr_cnpj').val().trim();
      if (cnpj !== '' && !validateCNPJ(cnpj)) {
        showFieldError($('#nr_cnpj'), 'CNPJ inválido. Informe um CNPJ válido.');
        hasError = true;
      }
    }

    if (hasError) return;

    // Habilitar campos desabilitados antes de enviar
    $('#formClient input[name="nm_socialreazon"]').prop('disabled', false);
    $('#formClient input[name="nm_fantasy"]').prop('disabled', false);

    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res){
      if(res.success){
        $('#modalRegClient').modal('hide');
        form[0].reset();
        showToast(res.message || 'Cadastro realizado com sucesso.', 'success');
        refreshClientsTable();
      } else {
        showToast(res.message || 'Erro ao salvar cliente', 'error');
      }
    }).fail(function(xhr){
      console.error('Erro AJAX save_client:', xhr.responseText || xhr.statusText);
      showToast('Erro ao salvar cliente', 'error');
    });
  });

  // ===================== EDITAR CLIENTE =====================

  $('#tbclients').on('click', '.edit-client', function(){
    var id = $(this).data('id');
    $.getJSON('/get_client?id=' + id, function(data){
      if(!data || !data.id_client) { showToast('Registro não encontrado', 'error'); return; }
      $('#edit_client_id').val(data.id_client);
      $('#edit_nr_cpf').val(data.nr_cpf || '');
      $('#edit_nr_cnpj').val(data.nr_cnpj || '');
      $('#edit_nm_client').val(data.nm_client || '');
      $('#edit_nm_socialreazon').val(data.nm_socialreazon || '');
      $('#edit_nm_fantasy').val(data.nm_fantasy || '');
      var tpPersonValue = data.tp_person === 'J' ? 'PJ' : 'PF';
      $('#modalEditClient input[name="tp_person"][value="' + tpPersonValue + '"]').prop('checked', true).trigger('change');
      $('#edit_nr_phone').val(data.nr_phone || '');
      $('#edit_nr_cellphone').val(data.nr_cellphone || '');
      $('#edit_ds_email').val(data.ds_email || '');
      $('#edit_nr_zipcode').val(data.nr_zipcode || '');
      clearFieldError($('#edit_nr_cpf'));
      clearFieldError($('#edit_nr_cnpj'));
      $('#clientEditAlert').hide();
      $('#modalEditClient').modal('show');
    }).fail(function(){ showToast('Erro ao buscar cliente', 'error'); });
  });

  // ===================== ATUALIZAR CLIENTE =====================

  $('#btnUpdateClient').on('click', function(){
    var form = $('#formEditClient');
    var personType = form.find('input[name="tp_person"]:checked').val() || 'F';
    var hasError = false;

    clearFieldError($('#edit_nr_cpf'));
    clearFieldError($('#edit_nr_cnpj'));

    if (personType === 'F') {
      var cpf = $('#edit_nr_cpf').val().trim();
      if (cpf !== '' && !validateCPF(cpf)) {
        showFieldError($('#edit_nr_cpf'), 'CPF inválido. Informe um CPF válido.');
        hasError = true;
      }
    } else {
      var cnpj = $('#edit_nr_cnpj').val().trim();
      if (cnpj !== '' && !validateCNPJ(cnpj)) {
        showFieldError($('#edit_nr_cnpj'), 'CNPJ inválido. Informe um CNPJ válido.');
        hasError = true;
      }
    }

    if (hasError) return;

    // Habilitar campos desabilitados antes de enviar
    $('#formEditClient input[name="nm_socialreazon"]').prop('disabled', false);
    $('#formEditClient input[name="nm_fantasy"]').prop('disabled', false);

    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res){
      if(res.success){
        $('#modalEditClient').modal('hide');
        showToast(res.message || 'Alteração realizada com sucesso.', 'success');
        refreshClientsTable();
      } else { showToast(res.message || 'Erro ao atualizar cliente', 'error'); }
    }).fail(function(){ showToast('Erro ao atualizar cliente', 'error'); });
  });

  // ===================== EXCLUIR CLIENTE =====================

  var deleteClientId = null;

  $('#tbclients').on('click', '.delete-client', function(){
    deleteClientId = $(this).data('id');
    $('#modalExcluirClient').modal('show');
  });

  $('#confirmDeleteClientBtn').click(function(){
    if(!deleteClientId) return;
    $.post('/delete_client', { id: deleteClientId }, function(res){
      if(res.success){
        $('#modalExcluirClient').modal('hide');
        showToast(res.message || 'Exclusão realizada com sucesso.', 'success');
        refreshClientsTable();
      } else {
        $('#modalExcluirClient').modal('hide');
        showToast(res.message || 'Erro ao excluir', 'error');
      }
    }, 'json').fail(function(){
      $('#modalExcluirClient').modal('hide');
      showToast('Erro na requisição', 'error');
    });
  });
});
