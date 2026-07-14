$(function() {

  // ===================== CARREGAR PERMISSÕES =====================

  function loadPermissions() {
    $.getJSON('/get_all_permissions', function(data) {
      var tbody = '';
      if (data && data.length) {
        var modules = {};
        $.each(data, function(i, item) {
          if (!modules[item.ds_module]) {
            modules[item.ds_module] = [];
          }
          modules[item.ds_module].push(item);
        });
        $.each(modules, function(mod, perms) {
          $.each(perms, function(i, p) {
            tbody += '<tr' + (i === 0 ? ' class="module-row"' : '') + '>';
            if (i === 0) {
              tbody += '<td rowspan="' + perms.length + '" class="module-cell"><strong>' + escapeHtml(p.ds_module) + '</strong></td>';
            }
            tbody += '<td>' + escapeHtml(p.ds_description) + '</td>';
            tbody += '<td class="text-center">';
            tbody += '<button class="btn btn-default btn-xs edit-permission" data-id="' + p.id + '" title="Editar"><span class="glyphicon glyphicon-pencil"></span></button> ';
            tbody += '<button class="btn btn-danger btn-xs delete-permission" data-id="' + p.id + '" title="Excluir"><span class="glyphicon glyphicon-trash"></span></button>';
            tbody += '</td></tr>';
          });
        });
      }
      $('#tbpermissions tbody').html(tbody);
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  function loadModulesDatalist() {
    $.getJSON('/get_all_permissions', function(data) {
      var modules = [];
      if (data && data.length) {
        $.each(data, function(i, item) {
          if (modules.indexOf(item.ds_module) === -1) {
            modules.push(item.ds_module);
          }
        });
      }
      var list = $('#modulesList');
      list.empty();
      $.each(modules, function(i, m) {
        list.append('<option value="' + escapeHtml(m) + '">');
      });
    });
  }

  // ===================== ABRIR MODAL =====================

  $(document).on('click', '#menuPermissions', function(e) {
    e.preventDefault();
    $('#permissionAlert').hide();
    $('#formPermission')[0].reset();
    $('#edit_permission_id').val('');
    loadPermissions();
    loadModulesDatalist();
    $('#modalPermissions').modal('show');
  });

  // ===================== SALVAR PERMISSÃO =====================

  $('#btnSavePermission').on('click', function() {
    var form = $('#formPermission');
    var ds_module = form.find('[name="ds_module"]').val().trim();
    var ds_description = form.find('[name="ds_description"]').val().trim();

    if (!ds_module) {
      showPermAlert('Informe o nome do módulo.', 'error');
      return;
    }
    if (!ds_description) {
      showPermAlert('Informe a descrição da permissão.', 'error');
      return;
    }

    var editId = $('#edit_permission_id').val();
    var url = editId ? '/update_permission' : '/save_permission';
    var postData = form.serialize();
    if (editId) {
      postData += '&id=' + editId;
    }

    $.ajax({ url: url, method: 'POST', data: postData, dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        form[0].reset();
        $('#edit_permission_id').val('');
        $('#btnSavePermission').text('Salvar');
        $('#btnCancelEdit').hide();
        Notificacoes.showToast(res.message || 'Permissão salva com sucesso.', 'success');
        loadPermissions();
        loadModulesDatalist();
      } else {
        showPermAlert(res.message || 'Erro ao salvar permissão.', 'error');
      }
    }).fail(function(xhr) {
      console.error('Erro AJAX:', xhr.responseText || xhr.statusText);
      showPermAlert('Erro ao salvar permissão.', 'error');
    });
  });

  // ===================== EDITAR PERMISSÃO =====================

  $('#tbpermissions').on('click', '.edit-permission', function() {
    var id = $(this).data('id');
    $.getJSON('/get_permission?id=' + id, function(data) {
      if (!data || !data.id) {
        Notificacoes.showToast('Registro não encontrado.', 'error');
        return;
      }
      $('#edit_permission_id').val(data.id);
      $('#formPermission [name="ds_module"]').val(data.ds_module);
      $('#formPermission [name="ds_description"]').val(data.ds_description);
      $('#btnSavePermission').text('Atualizar');
      $('#btnCancelEdit').show();
    }).fail(function() {
      Notificacoes.showToast('Erro ao buscar permissão.', 'error');
    });
  });

  // ===================== EXCLUIR PERMISSÃO =====================

  var deletePermissionId = null;

  $('#tbpermissions').on('click', '.delete-permission', function() {
    deletePermissionId = $(this).data('id');
    $('#modalExcluirPermission').modal('show');
  });

  $('#confirmDeletePermissionBtn').on('click', function() {
    if (!deletePermissionId) return;
    $.post('/delete_permission', { id: deletePermissionId }, function(res) {
      $('#modalExcluirPermission').modal('hide');
      if (res.success) {
        Notificacoes.showToast(res.message || 'Permissão excluída com sucesso.', 'success');
        loadPermissions();
        loadModulesDatalist();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao excluir.', 'error');
      }
    }, 'json').fail(function() {
      $('#modalExcluirPermission').modal('hide');
      Notificacoes.showToast('Erro na requisição.', 'error');
    });
  });

  // ===================== CANCELAR EDIÇÃO =====================

  $('#btnCancelEdit').on('click', function() {
    $('#formPermission')[0].reset();
    $('#edit_permission_id').val('');
    $('#btnSavePermission').text('Salvar');
    $('#btnCancelEdit').hide();
    $('#permissionAlert').hide();
  });

  // ===================== HELPERS =====================

  function showPermAlert(message, type) {
    var alertEl = $('#permissionAlert');
    alertEl.removeClass('alert-success alert-danger')
           .addClass(type === 'success' ? 'alert-success' : 'alert-danger')
           .text(message)
           .show();
  }

  // Limpar alertas ao fechar modal
  $('#modalPermissions').on('hidden.bs.modal', function() {
    $(this).find('.alert').hide();
    $('#formPermission')[0].reset();
    $('#edit_permission_id').val('');
    $('#btnSavePermission').text('Salvar');
    $('#btnCancelEdit').hide();
  });
});
