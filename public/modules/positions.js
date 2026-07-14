$(function() {
  var dtConfig = { language: { url: '/plugins/datatables/Portuguese.json' } };
  $('#tbpositions').DataTable(dtConfig);

  function refreshPositionsTable(callback) {
    $.post('/listposition', function(html) {
      var tbody = $(html).find('#tbpositions tbody');
      var table = $('#tbpositions').DataTable();
      table.destroy();
      $('#tbpositions tbody').html(tbody.html());
      $('#tbpositions').DataTable(dtConfig);
      if (typeof callback === 'function') callback();
    });
  }

  // ===================== SALVAR CARGO =====================

  $('#btnSavePosition').on('click', function() {
    var form = $('#formPosition');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalRegPosition').modal('hide');
        form[0].reset();
        Notificacoes.showToast(res.message || 'Cargo cadastrado com sucesso.', 'success');
        refreshPositionsTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao salvar cargo', 'error');
      }
    }).fail(function(xhr) {
      console.error('Erro AJAX save_position:', xhr.responseText || xhr.statusText);
      Notificacoes.showToast('Erro ao salvar cargo', 'error');
    });
  });

  // ===================== EDITAR CARGO =====================

  $('#tbpositions').on('click', '.edit-position', function() {
    var id = $(this).data('id');
    $.getJSON('/get_position?id=' + id, function(data) {
      if (!data || !data.id) {
        Notificacoes.showToast('Registro não encontrado', 'error');
        return;
      }
      $('#edit_position_id').val(data.id);
      $('#edit_ds_description').val(data.ds_description);
      $('#modalEditPosition').modal('show');
    }).fail(function() {
      Notificacoes.showToast('Erro ao buscar cargo', 'error');
    });
  });

  // ===================== ATUALIZAR CARGO =====================

  $('#btnUpdatePosition').on('click', function() {
    var form = $('#formEditPosition');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalEditPosition').modal('hide');
        Notificacoes.showToast(res.message || 'Cargo atualizado com sucesso.', 'success');
        refreshPositionsTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao atualizar cargo', 'error');
      }
    }).fail(function() {
      Notificacoes.showToast('Erro ao atualizar cargo', 'error');
    });
  });

  // ===================== EXCLUIR CARGO =====================

  var deletePositionId = null;

  $('#tbpositions').on('click', '.delete-position', function() {
    deletePositionId = $(this).data('id');
    $('#modalExcluirPosition').modal('show');
  });

  $('#confirmDeletePositionBtn').click(function() {
    if (!deletePositionId) return;
    $.post('/delete_position', { id: deletePositionId }, function(res) {
      if (res.success) {
        $('#modalExcluirPosition').modal('hide');
        Notificacoes.showToast(res.message || 'Cargo excluído com sucesso.', 'success');
        refreshPositionsTable();
      } else {
        $('#modalExcluirPosition').modal('hide');
        Notificacoes.showToast(res.message || 'Erro ao excluir', 'error');
      }
    }, 'json').fail(function() {
      $('#modalExcluirPosition').modal('hide');
      Notificacoes.showToast('Erro na requisição', 'error');
    });
  });
});
