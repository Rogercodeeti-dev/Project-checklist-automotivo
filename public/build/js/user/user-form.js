
$(document).ready(() => {

    console.log('user-form.js carregado');

    // evento delegado (funciona com páginas carregadas via AJAX)
    $(document).on('click', '#btnSaveUser', (e) => {
        e.preventDefault(); // Prevent default form submission

        let formData = new FormData($('#insertUser')[0]);

        $.ajax({
            type: 'post',
            url: '/register_user',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: (response) => {
                if (response.success) {
                    // Create new row
                    var actionButtons = '';
                    actionButtons += '<button type="button" class="btn btn-default btn-xs edit-user" data-id="' + response.user.id + '" title="Editar usuário">' +
                                    '<span class="glyphicon glyphicon-pencil"></span>' +
                                  '</button> ';
                    actionButtons += '<button type="button" class="btn btn-default btn-xs info-user" data-id="' + response.user.id + '" title="Ver informações">' +
                                    '<span class="glyphicon glyphicon-info-sign"></span>' +
                                  '</button> ';
                    actionButtons += '<button type="button" class="btn btn-danger btn-xs btn-delete-user" data-id="' + response.user.id + '" title="Excluir usuário">' +
                                    '<span class="glyphicon glyphicon-trash"></span>' +
                                  '</button>';
                    if (response.user.ds_level != 1) {
                        actionButtons += ' <button type="button" class="btn btn-default btn-xs lock-user" data-id="' + response.user.id + '" title="Gerenciar permissões">' +
                                         '<span class="glyphicon glyphicon-lock"></span>' +
                                       '</button>';
                    }

                    var newRow = '<tr>' +
                        '<td class="text-center"><img src="' + (response.user.ds_photo || '/dist/img/sem-foto.jpg') + '" width="50" height="50" style="border-radius:50%; object-fit:cover; border:1px solid #ddd;"></td>' +
                        '<td><p>' + response.user.nm_name + '</p></td>' +
                        '<td><p>' + (response.user.nr_phone || '') + '</p></td>' +
                        '<td><p>' + response.user.ds_email + '</p></td>' +
                        '<td><p>' + (response.user.ds_level == 1 ? 'Administrador' : 'Usuário') + '</p></td>' +
                        '<td class="text-center"><input type="checkbox" class="toggle-active" data-id="' + response.user.id + '" checked title="Desativar usuário"></td>' +
                        '<td class="btn-actions text-center">' + actionButtons + '</td>' +
                    '</tr>';
                    
                    // Append to table body
                    $('#tbuser tbody').append(newRow);
                    
                    // Reset form and hide modal
                    $('#insertUser')[0].reset();
                    $('#modalRegUser').modal('hide');
                    
                    // Show success message
                    toastr.success('Usuário cadastrado com sucesso!');
                } else {
                    toastr.error(response.message);
                }
            },
            error: (erro) => {
                console.log(erro);
                toastr.error('Erro ao cadastrar usuário.');
            }
        });
    });
});
  //Fim de salvar os dados do usuário
