$(function() {
  var dtConfig = { language: { url: '/plugins/datatables/Portuguese.json' } };
  $('#tbtypevehicles').DataTable(dtConfig);

  function refreshTypeVehiclesTable(callback) {
    $.post('/listtypevehicle', function(html) {
      var tbody = $(html).find('#tbtypevehicles tbody');
      var table = $('#tbtypevehicles').DataTable();
      table.destroy();
      $('#tbtypevehicles tbody').html(tbody.html());
      $('#tbtypevehicles').DataTable(dtConfig);
      if (typeof callback === 'function') callback();
    });
  }

  // ===================== SALVAR TIPO DE VEÍCULO =====================

  $('#btnSaveTypeVehicle').on('click', function() {
    var form = $('#formTypeVehicle');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalRegTypeVehicle').modal('hide');
        form[0].reset();
        Notificacoes.showToast(res.message || 'Tipo de veículo cadastrado com sucesso.', 'success');
        refreshTypeVehiclesTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao salvar tipo de veículo', 'error');
      }
    }).fail(function(xhr) {
      console.error('Erro AJAX save_typevehicle:', xhr.responseText || xhr.statusText);
      Notificacoes.showToast('Erro ao salvar tipo de veículo', 'error');
    });
  });

  // ===================== EDITAR TIPO DE VEÍCULO =====================

  $('#tbtypevehicles').on('click', '.edit-typevehicle', function() {
    var id = $(this).data('id');
    $.getJSON('/get_typevehicle?id=' + id, function(data) {
      if (!data || !data.id) {
        Notificacoes.showToast('Registro não encontrado', 'error');
        return;
      }
      $('#edit_typevehicle_id').val(data.id);
      $('#edit_ds_type').val(data.ds_type);
      $('#modalEditTypeVehicle').modal('show');
    }).fail(function() {
      Notificacoes.showToast('Erro ao buscar tipo de veículo', 'error');
    });
  });

  // ===================== ATUALIZAR TIPO DE VEÍCULO =====================

  $('#btnUpdateTypeVehicle').on('click', function() {
    var form = $('#formEditTypeVehicle');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalEditTypeVehicle').modal('hide');
        Notificacoes.showToast(res.message || 'Tipo de veículo atualizado com sucesso.', 'success');
        refreshTypeVehiclesTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao atualizar tipo de veículo', 'error');
      }
    }).fail(function() {
      Notificacoes.showToast('Erro ao atualizar tipo de veículo', 'error');
    });
  });

  // ===================== EXCLUIR TIPO DE VEÍCULO =====================

  var deleteTypeVehicleId = null;

  $('#tbtypevehicles').on('click', '.delete-typevehicle', function() {
    deleteTypeVehicleId = $(this).data('id');
    $('#modalExcluirTypeVehicle').modal('show');
  });

  $('#confirmDeleteTypeVehicleBtn').click(function() {
    if (!deleteTypeVehicleId) return;
    $.post('/delete_typevehicle', { id: deleteTypeVehicleId }, function(res) {
      if (res.success) {
        $('#modalExcluirTypeVehicle').modal('hide');
        Notificacoes.showToast(res.message || 'Tipo de veículo excluído com sucesso.', 'success');
        refreshTypeVehiclesTable();
      } else {
        $('#modalExcluirTypeVehicle').modal('hide');
        Notificacoes.showToast(res.message || 'Erro ao excluir', 'error');
      }
    }, 'json').fail(function() {
      $('#modalExcluirTypeVehicle').modal('hide');
      Notificacoes.showToast('Erro na requisição', 'error');
    });
  });
});
