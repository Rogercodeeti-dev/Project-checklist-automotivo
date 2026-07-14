$(function() {
  var dtConfig = { language: { url: '/plugins/datatables/Portuguese.json' } };
  $('#tbvehicles').DataTable(dtConfig);

  function refreshVehiclesTable(callback) {
    $.post('/listvehicle', function(html) {
      var tbody = $(html).find('#tbvehicles tbody');
      var table = $('#tbvehicles').DataTable();
      table.destroy();
      $('#tbvehicles tbody').html(tbody.html());
      $('#tbvehicles').DataTable(dtConfig);
      if (typeof callback === 'function') callback();
    });
  }

  function populateSelect($select, data, valueField, labelFields, selectedVal) {
    $select.find('option:gt(0)').remove();
    $.each(data, function(i, item) {
      var label = [];
      for (var j = 0; j < labelFields.length; j++) {
        if (item[labelFields[j]]) label.push(item[labelFields[j]]);
      }
      var opt = $('<option>').val(item[valueField]).text(label.join(' - '));
      if (selectedVal && String(item[valueField]) === String(selectedVal)) opt.attr('selected', true);
      $select.append(opt);
    });
  }

  // ===================== MODAL CADASTRO: abrir e limpar =====================

  $('#modalRegVehicle').on('show.bs.modal', function() {
    $('#formVehicle')[0].reset();
    $('#formVehicle select').val('');
  });

  // ===================== BOTÃO + MODELO (CADASTRO) =====================

  $('#btnAddModelFromVehicle').on('click', function() {
    $('#quickModelAlert').hide();
    $('#formQuickModel')[0].reset();
    $('#formQuickModel select[name="id_mark"]').val('');
    $('#modalQuickModel').modal('show');
  });

  $('#btnSaveQuickModel').on('click', function() {
    var form = $('#formQuickModel');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalQuickModel').modal('hide');
        var newId = res.id;
        $.getJSON('/get_all_models', function(models) {
          populateSelect($('#vehicle_id_model'), models, 'id', ['ds_model', 'mark_name'], newId);
        });
        Notificacoes.showToast('Modelo cadastrado com sucesso.', 'success');
      } else {
        $('#quickModelAlert').removeClass('alert-success').addClass('alert-danger').text(res.message || 'Erro ao salvar modelo').show();
      }
    }).fail(function() {
      $('#quickModelAlert').removeClass('alert-success').addClass('alert-danger').text('Erro ao salvar modelo').show();
    });
  });

  // ===================== BOTÃO + CLIENTE (CADASTRO) =====================

  $('#btnAddClientFromVehicle').on('click', function() {
    $('#quickClientAlert').hide();
    $('#formQuickClient')[0].reset();
    $('#formQuickClient input[name="tp_person"][value="PF"]').prop('checked', true).trigger('change');
    $('#modalQuickClient').modal('show');
  });

  $('#btnSaveQuickClient').on('click', function() {
    var form = $('#formQuickClient');
    form.find('input[name="nm_socialreazon"]').prop('disabled', false);
    form.find('input[name="nm_fantasy"]').prop('disabled', false);
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalQuickClient').modal('hide');
        $.getJSON('/get_all_clients', function(clients) {
          populateSelect($('#vehicle_id_client'), clients, 'id_client', ['nm_client'], null);
        });
        Notificacoes.showToast(res.message || 'Cliente cadastrado com sucesso.', 'success');
      } else {
        $('#quickClientAlert').removeClass('alert-success').addClass('alert-danger').text(res.message || 'Erro ao salvar cliente').show();
      }
    }).fail(function() {
      $('#quickClientAlert').removeClass('alert-success').addClass('alert-danger').text('Erro ao salvar cliente').show();
    });
  });

  // Toggle PF/PJ no modal rápido de cliente
  $('#formQuickClient input[name="tp_person"]').on('change', function() {
    if ($(this).val() === 'PJ') {
      $('#quick-field-cpf').hide();
      $('#quick-field-cnpj').show();
      $('#formQuickClient input[name="nm_socialreazon"]').prop('disabled', false);
      $('#formQuickClient input[name="nm_fantasy"]').prop('disabled', false);
    } else {
      $('#quick-field-cpf').show();
      $('#quick-field-cnpj').hide();
      $('#formQuickClient input[name="nm_socialreazon"]').prop('disabled', true).val('');
      $('#formQuickClient input[name="nm_fantasy"]').prop('disabled', true).val('');
    }
  });

  // ===================== BOTÃO + MODELO (EDIÇÃO) =====================

  $('#btnAddModelFromVehicleEdit').on('click', function() {
    $('#quickModelAlert').hide();
    $('#formQuickModel')[0].reset();
    $('#formQuickModel select[name="id_mark"]').val('');
    $('#modalQuickModel').modal('show');
  });

  // ===================== BOTÃO + CLIENTE (EDIÇÃO) =====================

  $('#btnAddClientFromVehicleEdit').on('click', function() {
    $('#quickClientAlert').hide();
    $('#formQuickClient')[0].reset();
    $('#formQuickClient input[name="tp_person"][value="PF"]').prop('checked', true).trigger('change');
    $('#modalQuickClient').modal('show');
  });

  // ===================== SALVAR VEÍCULO =====================

  $('#btnSaveVehicle').on('click', function() {
    var form = $('#formVehicle');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalRegVehicle').modal('hide');
        form[0].reset();
        Notificacoes.showToast(res.message || 'Veículo cadastrado com sucesso.', 'success');
        refreshVehiclesTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao salvar veículo', 'error');
      }
    }).fail(function(xhr) {
      console.error('Erro AJAX save_vehicle:', xhr.responseText || xhr.statusText);
      Notificacoes.showToast('Erro ao salvar veículo', 'error');
    });
  });

  // ===================== EDITAR VEÍCULO =====================

  $('#tbvehicles').on('click', '.edit-vehicle', function() {
    var id = $(this).data('id');
    $.getJSON('/get_vehicle?id=' + id, function(data) {
      if (!data || !data.id_vehicle) {
        Notificacoes.showToast('Registro não encontrado', 'error');
        return;
      }
      $('#edit_vehicle_id').val(data.id_vehicle);
      $('#edit_vehicle_id_client').val(data.id_client);
      $('#edit_vehicle_id_model').val(data.id_model);
      $('#edit_vehicle_id_typevehicle').val(data.id_typevehicle);
      $('#edit_nr_platevehicle').val(data.nr_platevehicle || '');
      $('#edit_nr_chassis').val(data.nr_chassis || '');
      $('#edit_ds_color').val(data.ds_color || '');
      $('#edit_ds_fuel').val(data.ds_fuel || '');
      $('#edit_nr_currentkm').val(data.nr_currentkm || '0');
      $('#edit_ds_observation').val(data.ds_observation || '');
      $('#vehicleEditAlert').hide();
      $('#modalEditVehicle').modal('show');
    }).fail(function() {
      Notificacoes.showToast('Erro ao buscar veículo', 'error');
    });
  });

  // ===================== ATUALIZAR VEÍCULO =====================

  $('#btnUpdateVehicle').on('click', function() {
    var form = $('#formEditVehicle');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalEditVehicle').modal('hide');
        Notificacoes.showToast(res.message || 'Veículo atualizado com sucesso.', 'success');
        refreshVehiclesTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao atualizar veículo', 'error');
      }
    }).fail(function() {
      Notificacoes.showToast('Erro ao atualizar veículo', 'error');
    });
  });

  // ===================== EXCLUIR VEÍCULO =====================

  var deleteVehicleId = null;

  $('#tbvehicles').on('click', '.delete-vehicle', function() {
    deleteVehicleId = $(this).data('id');
    $('#modalExcluirVehicle').modal('show');
  });

  $('#confirmDeleteVehicleBtn').click(function() {
    if (!deleteVehicleId) return;
    $.post('/delete_vehicle', { id: deleteVehicleId }, function(res) {
      if (res.success) {
        $('#modalExcluirVehicle').modal('hide');
        Notificacoes.showToast(res.message || 'Veículo excluído com sucesso.', 'success');
        refreshVehiclesTable();
      } else {
        $('#modalExcluirVehicle').modal('hide');
        Notificacoes.showToast(res.message || 'Erro ao excluir', 'error');
      }
    }, 'json').fail(function() {
      $('#modalExcluirVehicle').modal('hide');
      Notificacoes.showToast('Erro na requisição', 'error');
    });
  });
});
