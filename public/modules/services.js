$(function() {
  var dtConfig = { language: { url: '/plugins/datatables/Portuguese.json' } };
  $('#tbservices').DataTable(dtConfig);

  function refreshServicesTable(callback) {
    $.post('/listservice', function(html) {
      var tbody = $(html).find('#tbservices tbody');
      var table = $('#tbservices').DataTable();
      table.destroy();
      $('#tbservices tbody').html(tbody.html());
      $('#tbservices').DataTable(dtConfig);
      if (typeof callback === 'function') callback();
    });
  }

  // ===================== SALVAR SERVIÇO =====================

  $('#btnSaveService').on('click', function() {
    var form = $('#formService');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalRegService').modal('hide');
        form[0].reset();
        Notificacoes.showToast(res.message || 'Serviço cadastrado com sucesso.', 'success');
        refreshServicesTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao salvar serviço', 'error');
      }
    }).fail(function(xhr) {
      console.error('Erro AJAX save_service:', xhr.responseText || xhr.statusText);
      Notificacoes.showToast('Erro ao salvar serviço', 'error');
    });
  });

  // ===================== EDITAR SERVIÇO =====================

  $('#tbservices').on('click', '.edit-service', function() {
    var id = $(this).data('id');
    $.getJSON('/get_service?id=' + id, function(data) {
      if (!data || !data.id) {
        Notificacoes.showToast('Registro não encontrado', 'error');
        return;
      }
      $('#edit_service_id').val(data.id);
      $('#edit_ds_service').val(data.ds_service);
      $('#edit_estimated_time').val(data.estimated_time || '');
      $('#edit_id_labor').val(data.id_labor || '');
      $('#edit_is_active').prop('checked', parseInt(data.is_active) === 1);
      $('#modalEditService').modal('show');
    }).fail(function() {
      Notificacoes.showToast('Erro ao buscar serviço', 'error');
    });
  });

  // ===================== ATUALIZAR SERVIÇO =====================

  $('#btnUpdateService').on('click', function() {
    var form = $('#formEditService');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalEditService').modal('hide');
        Notificacoes.showToast(res.message || 'Serviço atualizado com sucesso.', 'success');
        refreshServicesTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao atualizar serviço', 'error');
      }
    }).fail(function() {
      Notificacoes.showToast('Erro ao atualizar serviço', 'error');
    });
  });

  // ===================== EXCLUIR SERVIÇO =====================

  var deleteServiceId = null;

  $('#tbservices').on('click', '.delete-service', function() {
    deleteServiceId = $(this).data('id');
    $('#modalExcluirService').modal('show');
  });

  $('#confirmDeleteServiceBtn').click(function() {
    if (!deleteServiceId) return;
    $.post('/delete_service', { id: deleteServiceId }, function(res) {
      if (res.success) {
        $('#modalExcluirService').modal('hide');
        Notificacoes.showToast(res.message || 'Serviço excluído com sucesso.', 'success');
        refreshServicesTable();
      } else {
        $('#modalExcluirService').modal('hide');
        Notificacoes.showToast(res.message || 'Erro ao excluir', 'error');
      }
    }, 'json').fail(function() {
      $('#modalExcluirService').modal('hide');
      Notificacoes.showToast('Erro na requisição', 'error');
    });
  });
});
