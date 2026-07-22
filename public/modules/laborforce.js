$(function() {
  var dtConfig = { language: { url: '/plugins/datatables/Portuguese.json' } };
  $('#tblaborforce').DataTable(dtConfig);

  function refreshLaborforceTable(callback) {
    $.post('/listlaborforce', function(html) {
      var tbody = $(html).find('#tblaborforce tbody');
      var table = $('#tblaborforce').DataTable();
      table.destroy();
      $('#tblaborforce tbody').html(tbody.html());
      $('#tblaborforce').DataTable(dtConfig);
      if (typeof callback === 'function') callback();
    });
  }

  // ===================== SALVAR MÃO DE OBRA =====================

  $('#btnSaveLaborforce').on('click', function() {
    var form = $('#formLaborforce');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalRegLaborforce').modal('hide');
        form[0].reset();
        Notificacoes.showToast(res.message || 'Mão de obra cadastrada com sucesso.', 'success');
        refreshLaborforceTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao salvar mão de obra', 'error');
      }
    }).fail(function(xhr) {
      console.error('Erro AJAX save_laborforce:', xhr.responseText || xhr.statusText);
      Notificacoes.showToast('Erro ao salvar mão de obra', 'error');
    });
  });

  // ===================== EDITAR MÃO DE OBRA =====================

  $('#tblaborforce').on('click', '.edit-laborforce', function() {
    var id = $(this).data('id');
    $.getJSON('/get_laborforce?id=' + id, function(data) {
      if (!data || !data.id) {
        Notificacoes.showToast('Registro não encontrado', 'error');
        return;
      }
      $('#edit_laborforce_id').val(data.id);
      $('#edit_ds_type').val(data.ds_type);
      $('#edit_vl_labor').val(parseFloat(data.vl_labor).toFixed(2));
      $('#modalEditLaborforce').modal('show');
    }).fail(function() {
      Notificacoes.showToast('Erro ao buscar mão de obra', 'error');
    });
  });

  // ===================== ATUALIZAR MÃO DE OBRA =====================

  $('#btnUpdateLaborforce').on('click', function() {
    var form = $('#formEditLaborforce');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalEditLaborforce').modal('hide');
        Notificacoes.showToast(res.message || 'Mão de obra atualizada com sucesso.', 'success');
        refreshLaborforceTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao atualizar mão de obra', 'error');
      }
    }).fail(function() {
      Notificacoes.showToast('Erro ao atualizar mão de obra', 'error');
    });
  });

  // ===================== EXCLUIR MÃO DE OBRA =====================

  var deleteLaborforceId = null;

  $('#tblaborforce').on('click', '.delete-laborforce', function() {
    deleteLaborforceId = $(this).data('id');
    $('#modalExcluirLaborforce').modal('show');
  });

  $('#confirmDeleteLaborforceBtn').click(function() {
    if (!deleteLaborforceId) return;
    $.post('/delete_laborforce', { id: deleteLaborforceId }, function(res) {
      if (res.success) {
        $('#modalExcluirLaborforce').modal('hide');
        Notificacoes.showToast(res.message || 'Mão de obra excluída com sucesso.', 'success');
        refreshLaborforceTable();
      } else {
        $('#modalExcluirLaborforce').modal('hide');
        Notificacoes.showToast(res.message || 'Erro ao excluir', 'error');
      }
    }, 'json').fail(function() {
      $('#modalExcluirLaborforce').modal('hide');
      Notificacoes.showToast('Erro na requisição', 'error');
    });
  });
});
