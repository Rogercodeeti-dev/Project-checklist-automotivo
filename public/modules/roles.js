$(function() {
  var dtConfig = { language: { url: '/plugins/datatables/Portuguese.json' } };
  $('#tbroles').DataTable(dtConfig);

  function refreshRolesTable(callback) {
    $.post('/listrole', function(html) {
      var tbody = $(html).find('#tbroles tbody');
      var table = $('#tbroles').DataTable();
      table.destroy();
      $('#tbroles tbody').html(tbody.html());
      $('#tbroles').DataTable(dtConfig);
      if (typeof callback === 'function') callback();
    });
  }

  // ===================== SALVAR PERFIL =====================

  $('#btnSaveRole').on('click', function() {
    var form = $('#formRole');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalRegRole').modal('hide');
        form[0].reset();
        Notificacoes.showToast(res.message || 'Perfil de acesso cadastrado com sucesso.', 'success');
        refreshRolesTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao salvar perfil de acesso', 'error');
      }
    }).fail(function(xhr) {
      console.error('Erro AJAX save_role:', xhr.responseText || xhr.statusText);
      Notificacoes.showToast('Erro ao salvar perfil de acesso', 'error');
    });
  });

  // ===================== EDITAR PERFIL =====================

  $('#tbroles').on('click', '.edit-role', function() {
    var id = $(this).data('id');
    $.getJSON('/get_role?id=' + id, function(data) {
      if (!data || !data.id) {
        Notificacoes.showToast('Registro não encontrado', 'error');
        return;
      }
      $('#edit_role_id').val(data.id);
      $('#edit_role_ds_description').val(data.ds_description);
      $('#modalEditRole').modal('show');
    }).fail(function() {
      Notificacoes.showToast('Erro ao buscar perfil de acesso', 'error');
    });
  });

  // ===================== ATUALIZAR PERFIL =====================

  $('#btnUpdateRole').on('click', function() {
    var form = $('#formEditRole');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalEditRole').modal('hide');
        Notificacoes.showToast(res.message || 'Perfil de acesso atualizado com sucesso.', 'success');
        refreshRolesTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao atualizar perfil de acesso', 'error');
      }
    }).fail(function() {
      Notificacoes.showToast('Erro ao atualizar perfil de acesso', 'error');
    });
  });

  // ===================== EXCLUIR PERFIL =====================

  var deleteRoleId = null;

  $('#tbroles').on('click', '.delete-role', function() {
    deleteRoleId = $(this).data('id');
    $('#modalExcluirRole').modal('show');
  });

  $('#confirmDeleteRoleBtn').click(function() {
    if (!deleteRoleId) return;
    $.post('/delete_role', { id: deleteRoleId }, function(res) {
      if (res.success) {
        $('#modalExcluirRole').modal('hide');
        Notificacoes.showToast(res.message || 'Perfil de acesso excluído com sucesso.', 'success');
        refreshRolesTable();
      } else {
        $('#modalExcluirRole').modal('hide');
        Notificacoes.showToast(res.message || 'Erro ao excluir', 'error');
      }
    }, 'json').fail(function() {
      $('#modalExcluirRole').modal('hide');
      Notificacoes.showToast('Erro na requisição', 'error');
    });
  });
});
