$(function() {
  var dtConfig = { language: { url: '/plugins/datatables/Portuguese.json' } };
  $('#tbusers').DataTable(dtConfig);

  function refreshUsersTable(callback) {
    $.post('/listusers', function(html) {
      var tbody = $(html).find('#tbusers tbody');
      var table = $('#tbusers').DataTable();
      table.destroy();
      $('#tbusers tbody').html(tbody.html());
      $('#tbusers').DataTable(dtConfig);
      if (typeof callback === 'function') callback();
    });
  }

  $('#btnSaveUser').on('click', function() {
    var form = $('#formUser');
    var hasError = false;

    var name = $('#nm_user').val().trim();
    if (!Validadores.required(name)) {
      FormUtils.showFieldError($('#nm_user'), 'Nome é obrigatório.');
      hasError = true;
    }

    var email = $('#ds_email').val().trim();
    if (!Validadores.required(email)) {
      FormUtils.showFieldError($('#ds_email'), 'E-mail é obrigatório.');
      hasError = true;
    } else if (!Validadores.email(email)) {
      FormUtils.showFieldError($('#ds_email'), 'E-mail inválido.');
      hasError = true;
    }

    var password = $('#ds_password').val();
    if (!Validadores.required(password)) {
      FormUtils.showFieldError($('#ds_password'), 'Senha é obrigatória.');
      hasError = true;
    }

    if (hasError) return;

    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalRegUser').modal('hide');
        FormUtils.resetForm('#formUser');
        Notificacoes.showToast(res.message || 'Usuário cadastrado com sucesso.', 'success');
        refreshUsersTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao salvar usuário', 'error');
      }
    }).fail(function(xhr) {
      console.error('Erro AJAX save_user:', xhr.responseText || xhr.statusText);
      Notificacoes.showToast('Erro ao salvar usuário', 'error');
    });
  });

  $('#tbusers').on('click', '.edit-user', function() {
    var id = $(this).data('id');
    $.getJSON('/get_user?id=' + id, function(data) {
      if (!data || !data.id_user) {
        Notificacoes.showToast('Registro não encontrado', 'error');
        return;
      }
      $('#edit_user_id').val(data.id_user);
      $('#edit_nm_user').val(data.nm_user || '');
      $('#edit_ds_email').val(data.ds_email || '');
      $('#edit_id_role').val(data.id_role || '');
      $('#modalEditUser').modal('show');
    }).fail(function() {
      Notificacoes.showToast('Erro ao buscar usuário', 'error');
    });
  });

  $('#btnUpdateUser').on('click', function() {
    var form = $('#formEditUser');
    var hasError = false;

    var name = $('#edit_nm_user').val().trim();
    if (!Validadores.required(name)) {
      FormUtils.showFieldError($('#edit_nm_user'), 'Nome é obrigatório.');
      hasError = true;
    }

    var email = $('#edit_ds_email').val().trim();
    if (!Validadores.required(email)) {
      FormUtils.showFieldError($('#edit_ds_email'), 'E-mail é obrigatório.');
      hasError = true;
    } else if (!Validadores.email(email)) {
      FormUtils.showFieldError($('#edit_ds_email'), 'E-mail inválido.');
      hasError = true;
    }

    if (hasError) return;

    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalEditUser').modal('hide');
        Notificacoes.showToast(res.message || 'Usuário atualizado com sucesso.', 'success');
        refreshUsersTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao atualizar usuário', 'error');
      }
    }).fail(function() {
      Notificacoes.showToast('Erro ao atualizar usuário', 'error');
    });
  });

  var deleteUserId = null;

  $('#tbusers').on('click', '.delete-user', function() {
    deleteUserId = $(this).data('id');
    $('#modalExcluirUser').modal('show');
  });

  $('#confirmDeleteUserBtn').click(function() {
    if (!deleteUserId) return;
    $.post('/delete_user', { id: deleteUserId }, function(res) {
      if (res.success) {
        $('#modalExcluirUser').modal('hide');
        Notificacoes.showToast(res.message || 'Usuário excluído com sucesso.', 'success');
        refreshUsersTable();
      } else {
        $('#modalExcluirUser').modal('hide');
        Notificacoes.showToast(res.message || 'Erro ao excluir', 'error');
      }
    }, 'json').fail(function() {
      $('#modalExcluirUser').modal('hide');
      Notificacoes.showToast('Erro na requisição', 'error');
    });
  });
});