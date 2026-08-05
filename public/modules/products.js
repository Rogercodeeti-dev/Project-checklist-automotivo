$(function() {
  var dtConfig = { language: { url: '/plugins/datatables/Portuguese.json' } };
  $('#tbproducts').DataTable(dtConfig);

  function refreshProductsTable(callback) {
    $.post('/listproduct', function(html) {
      var tbody = $(html).find('#tbproducts tbody');
      var table = $('#tbproducts').DataTable();
      table.destroy();
      $('#tbproducts tbody').html(tbody.html());
      $('#tbproducts').DataTable(dtConfig);
      if (typeof callback === 'function') callback();
    });
  }

  // ===================== SALVAR PRODUTO =====================

  $('#btnSaveProduct').on('click', function() {
    var form = $('#formProduct');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalRegProduct').modal('hide');
        form[0].reset();
        Notificacoes.showToast(res.message || 'Produto cadastrado com sucesso.', 'success');
        refreshProductsTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao salvar produto', 'error');
      }
    }).fail(function(xhr) {
      console.error('Erro AJAX save_product:', xhr.responseText || xhr.statusText);
      Notificacoes.showToast('Erro ao salvar produto', 'error');
    });
  });

  // ===================== EDITAR PRODUTO =====================

  $('#tbproducts').on('click', '.edit-product', function() {
    var id = $(this).data('id');
    $.getJSON('/get_product?id=' + id, function(data) {
      if (!data || !data.id) {
        Notificacoes.showToast('Registro não encontrado', 'error');
        return;
      }
      $('#edit_product_id').val(data.id);
      $('#edit_ds_product').val(data.ds_product);
      $('#edit_unit').val(data.unit || 'UN');
      $('#edit_sale_price').val(data.sale_price ? parseFloat(data.sale_price).toFixed(2).replace('.', ',') : '0,00');
      $('#edit_stock_quantity').val(data.stock_quantity || 0);
      $('#edit_minimum_stock').val(data.minimum_stock || 0);
      $('#edit_is_active').prop('checked', parseInt(data.is_active) === 1);
      $('#modalEditProduct').modal('show');
    }).fail(function() {
      Notificacoes.showToast('Erro ao buscar produto', 'error');
    });
  });

  // ===================== ATUALIZAR PRODUTO =====================

  $('#btnUpdateProduct').on('click', function() {
    var form = $('#formEditProduct');
    $.ajax({ url: form.attr('action'), method: 'POST', data: form.serialize(), dataType: 'json' })
    .done(function(res) {
      if (res.success) {
        $('#modalEditProduct').modal('hide');
        Notificacoes.showToast(res.message || 'Produto atualizado com sucesso.', 'success');
        refreshProductsTable();
      } else {
        Notificacoes.showToast(res.message || 'Erro ao atualizar produto', 'error');
      }
    }).fail(function() {
      Notificacoes.showToast('Erro ao atualizar produto', 'error');
    });
  });

  // ===================== EXCLUIR PRODUTO =====================

  var deleteProductId = null;

  $('#tbproducts').on('click', '.delete-product', function() {
    deleteProductId = $(this).data('id');
    $('#modalExcluirProduct').modal('show');
  });

  $('#confirmDeleteProductBtn').click(function() {
    if (!deleteProductId) return;
    $.post('/delete_product', { id: deleteProductId }, function(res) {
      if (res.success) {
        $('#modalExcluirProduct').modal('hide');
        Notificacoes.showToast(res.message || 'Produto excluído com sucesso.', 'success');
        refreshProductsTable();
      } else {
        $('#modalExcluirProduct').modal('hide');
        Notificacoes.showToast(res.message || 'Erro ao excluir', 'error');
      }
    }, 'json').fail(function() {
      $('#modalExcluirProduct').modal('hide');
      Notificacoes.showToast('Erro na requisição', 'error');
    });
  });
});
