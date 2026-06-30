$(function() {
  var dtConfig = { language: { url: '/plugins/datatables/Portuguese.json' } };
  $('#tbvehicles').DataTable(dtConfig);

  function refreshVehiclesTable(callback) {
    $.post('/listvehicles', function(html) {
      var tbody = $(html).find('#tbvehicles tbody');
      var table = $('#tbvehicles').DataTable();
      table.destroy();
      $('#tbvehicles tbody').html(tbody.html());
      $('#tbvehicles').DataTable(dtConfig);
      if (typeof callback === 'function') callback();
    });
  }

  Mascaras.aplicar('#nr_plate', Mascaras.placa);
  Mascaras.aplicar('#edit_nr_plate', Mascaras.placa);

  $('#btnSaveVehicle').on('click', function() {
    var form = $('#formVehicle');
    var hasError = false;

    var plate = $('#nr_plate').val().trim();
    if (!Validadores.required(plate)) {
      FormUtils.showFieldError($('#nr_plate'), 'Placa é obrigatória.');
      hasError = true;
    }

    var model = $('#id_model').val();
    if (!Validadores.required(model)) {
      FormUtils.showFieldError($('#id_model'), 'Modelo é obrigatório.');
      hasError = true;
    }

    var year = $('#nr_year').val().trim();
    if (!Validadores.required(year)) {
      FormUtils.showFieldError($('#nr_year'), 'Ano é obrigatório.');
      hasError = true;
    }

    if (hasError) return;

    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalRegVehicle').modal('hide');
        FormUtils.resetForm('#formVehicle');
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

  $('#tbvehicles').on('click', '.edit-vehicle', function() {
    var id = $(this).data('id');
    $.getJSON('/get_vehicle?id=' + id, function(data) {
      if (!data || !data.id_vehicle) {
        Notificacoes.showToast('Registro não encontrado', 'error');
        return;
      }
      $('#edit_vehicle_id').val(data.id_vehicle);
      $('#edit_nr_plate').val(data.nr_plate || '');
      $('#edit_id_model').val(data.id_model || '');
      $('#edit_id_mark').val(data.id_mark || '');
      $('#edit_id_typevehicle').val(data.id_typevehicle || '');
      $('#edit_nr_year').val(data.nr_year || '');
      $('#edit_nr_fabrication').val(data.nr_fabrication || '');
      $('#edit_ds_color').val(data.ds_color || '');
      $('#edit_nr_renavam').val(data.nr_renavam || '');
      $('#edit_nr_chassi').val(data.nr_chassi || '');
      $('#modalEditVehicle').modal('show');
    }).fail(function() {
      Notificacoes.showToast('Erro ao buscar veículo', 'error');
    });
  });

  $('#btnUpdateVehicle').on('click', function() {
    var form = $('#formEditVehicle');
    var hasError = false;

    var plate = $('#edit_nr_plate').val().trim();
    if (!Validadores.required(plate)) {
      FormUtils.showFieldError($('#edit_nr_plate'), 'Placa é obrigatória.');
      hasError = true;
    }

    if (hasError) return;

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