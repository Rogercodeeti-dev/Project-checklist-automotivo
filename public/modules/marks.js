$(function() {
  var dtConfig = { language: { url: '/plugins/datatables/Portuguese.json' } };
  $('#tbmarks').DataTable(dtConfig);

  function refreshMarksTable(callback) {
    $.post('/listmark', function(html) {
      var tbody = $(html).find('#tbmarks tbody');
      var table = $('#tbmarks').DataTable();
      table.destroy();
      $('#tbmarks tbody').html(tbody.html());
      $('#tbmarks').DataTable(dtConfig);
      if (typeof callback === 'function') callback();
    });
  }

  // ===================== SALVAR MARCA =====================

  $('#btnSaveMark').on('click', function() {
    var form = $('#formMark');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalRegMark').modal('hide');
        form[0].reset();
        Notificacoes.showToast(res.message || 'Marca cadastrada com sucesso.', 'success');
        refreshMarksTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao salvar marca', 'error');
      }
    }).fail(function(xhr) {
      console.error('Erro AJAX save_mark:', xhr.responseText || xhr.statusText);
      Notificacoes.showToast('Erro ao salvar marca', 'error');
    });
  });

  // ===================== EDITAR MARCA =====================

  $('#tbmarks').on('click', '.edit-mark', function() {
    var id = $(this).data('id');
    $.getJSON('/get_mark?id=' + id, function(data) {
      if (!data || !data.id) {
        Notificacoes.showToast('Registro não encontrado', 'error');
        return;
      }
      $('#edit_mark_id').val(data.id);
      $('#edit_nm_name').val(data.nm_name);
      $('#edit_cartype').val(data.cartype);
      $('#edit_ds_soon').val(data.ds_soon);
      $('#markEditAlert').hide();
      $('#modalEditMark').modal('show');
    }).fail(function() {
      Notificacoes.showToast('Erro ao buscar marca', 'error');
    });
  });

  // ===================== ATUALIZAR MARCA =====================

  $('#btnUpdateMark').on('click', function() {
    var form = $('#formEditMark');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalEditMark').modal('hide');
        Notificacoes.showToast(res.message || 'Marca atualizada com sucesso.', 'success');
        refreshMarksTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao atualizar marca', 'error');
      }
    }).fail(function() {
      Notificacoes.showToast('Erro ao atualizar marca', 'error');
    });
  });

  // ===================== EXCLUIR MARCA =====================

  var deleteMarkId = null;

  $('#tbmarks').on('click', '.delete-mark', function() {
    deleteMarkId = $(this).data('id');
    $('#modalExcluirMarca').modal('show');
  });

  $('#confirmDeleteMarkBtn').click(function() {
    if (!deleteMarkId) return;
    $.post('/delete_mark', { id: deleteMarkId }, function(res) {
      if (res.success) {
        $('#modalExcluirMarca').modal('hide');
        Notificacoes.showToast(res.message || 'Exclusão realizada com sucesso.', 'success');
        refreshMarksTable();
      } else {
        $('#modalExcluirMarca').modal('hide');
        Notificacoes.showToast(res.message || 'Erro ao excluir', 'error');
      }
    }, 'json').fail(function() {
      $('#modalExcluirMarca').modal('hide');
      Notificacoes.showToast('Erro na requisição', 'error');
    });
  });
});
