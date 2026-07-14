$(function() {
  var dtConfig = { language: { url: '/plugins/datatables/Portuguese.json' } };
  $('#tbmodels').DataTable(dtConfig);

  function refreshModelsTable(callback) {
    $.post('/listmodel', function(html) {
      var tbody = $(html).find('#tbmodels tbody');
      var table = $('#tbmodels').DataTable();
      table.destroy();
      $('#tbmodels tbody').html(tbody.html());
      $('#tbmodels').DataTable(dtConfig);
      if (typeof callback === 'function') callback();
    });
  }

  // ===================== SALVAR MODELO =====================

  $('#btnSaveModel').on('click', function() {
    var form = $('#formModel');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalRegModel').modal('hide');
        form[0].reset();
        Notificacoes.showToast(res.message || 'Modelo cadastrado com sucesso.', 'success');
        refreshModelsTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao salvar modelo', 'error');
      }
    }).fail(function() {
      Notificacoes.showToast('Erro ao salvar modelo', 'error');
    });
  });

  // ===================== EDITAR MODELO =====================

  $('#tbmodels').on('click', '.edit-model', function() {
    var id = $(this).data('id');
    $.getJSON('/get_model?id=' + id, function(data) {
      if (!data || !data.id) {
        Notificacoes.showToast('Registro não encontrado', 'error');
        return;
      }
      $('#edit_model_id').val(data.id);
      $('#edit_id_mark').val(data.id_mark);
      $('#edit_ds_model').val(data.ds_model);
      $('#edit_type_model').val(data.type_model);
      $('#modelEditAlert').hide();
      $('#modalEditModel').modal('show');
    }).fail(function() {
      Notificacoes.showToast('Erro ao buscar modelo', 'error');
    });
  });

  // ===================== ATUALIZAR MODELO =====================

  $('#btnUpdateModel').on('click', function() {
    var form = $('#formEditModel');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalEditModel').modal('hide');
        Notificacoes.showToast(res.message || 'Modelo atualizado com sucesso.', 'success');
        refreshModelsTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao atualizar modelo', 'error');
      }
    }).fail(function() {
      Notificacoes.showToast('Erro ao atualizar modelo', 'error');
    });
  });

  // ===================== EXCLUIR MODELO =====================

  var deleteModelId = null;

  $('#tbmodels').on('click', '.delete-model', function() {
    deleteModelId = $(this).data('id');
    $('#modalExcluirModelo').modal('show');
  });

  $('#confirmDeleteModelBtn').click(function() {
    if (!deleteModelId) return;
    $.post('/delete_model', { id: deleteModelId }, function(res) {
      if (res.success) {
        $('#modalExcluirModelo').modal('hide');
        Notificacoes.showToast(res.message || 'Exclusão realizada com sucesso.', 'success');
        refreshModelsTable();
      } else {
        $('#modalExcluirModelo').modal('hide');
        Notificacoes.showToast(res.message || 'Erro ao excluir', 'error');
      }
    }, 'json').fail(function() {
      $('#modalExcluirModelo').modal('hide');
      Notificacoes.showToast('Erro na requisição', 'error');
    });
  });
});
