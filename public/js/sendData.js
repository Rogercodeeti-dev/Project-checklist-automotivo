$(document).ready(function() {
    //Cadastro de cursos
    $("#frmcourse").on("submit", function(e) {
        e.preventDefault(); // Impede o envio tradicional do form
         toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-center",
        "timeOut": "3000"
        };
        $.ajax({
            url: "/register_course",
            type: "POST",
            data: $(this).serialize(),
            dataType: "json",
            success: function(response) {
                console.log("Resposta do servidor:", response);
                if (response.success) {
                  
                    toastr.success(response.message);
                    setTimeout(() => {
                        $('#modalDescricaoCurso').modal('hide');
                        location.reload();
                    }, 2000);
                } else {
                    toastr.error(response.message);
                }
                   
                
            },
            error: function(xhr, status, error) {
                alert('Erro de requisiçao!');
                console.log("Erro AJAX:", xhr.responseText, status, error);
                $("#message").removeClass("success").addClass("error")
                    .text("Erro ao processar a requisição!").fadeIn().delay(3000).fadeOut();
            }
        });
    });//Fim do cadastro de cursos


    // Edição de cursos
    // Evento de submit do formulário de edição
  $('#frmEditarCurso').on('submit', function(e) {
    e.preventDefault();

    // const id = $('#edit_id').val();
    // const ds_course = $('#edit_ds_course').val();
    const id_course = $('#id_course').val();
    const ds_course = $('#ds_course-edit').val();
   
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-center",
        "timeOut": "3000"
    };

    $.ajax({
        type: 'POST',
        url: '/update_course',
        data: {
           
                id_course: id_course,
                ds_course: ds_course
        },
        dataType: 'json', 
        success: function(response) {
            if (response.success) {
                toastr.success(response.message);
                 // Atualiza o botão "Editar" com o novo valor
                $('#row-' + id).find('.course-name').data('ds_course', ds_course);
                // Atualiza o botão "Editar" com o novo valor
                $('#row-' + id).find('.editCourse').data('ds_course', ds_course);
                

            } else {
                toastr.error(response.message);
            }
        },
        error: function(xhr) {
            toastr.error("Erro ao atualizar o curso.");
            console.log(xhr.responseText);
        }
    });
});


        //Exclusão de cursos
        // Quando clica no botão de excluir    
       let itemIdToDelete = null;

        $('.btn-delete').on('click', function() {
            itemIdToDelete = $(this).data('id');
          
            $('#modalExcluirCurso').modal('show');
        });

        $('#confirmDeleteBtn').off('click').on('click', function() {
            if (itemIdToDelete !== null) {
                toastr.options = {
                    closeButton: true,
                    progressBar: true,
                    positionClass: "toast-top-center",
                    timeOut: "3000"
                };

                $.ajax({
                    url: '/delete_course?recordId=' + itemIdToDelete,
                    type: 'GET',
                    success: function(response) {
                        if (response.success) {
                            toastr.success(response.message);
                            setTimeout(() => {
                                $('#modalExcluirCurso').modal('hide');
                                location.reload();
                            }, 2000);
                        } else {
                            toastr.error(response.message);
                        }
                    }
                });
            }
        });


    //Cadastro de disciplina
    $("#frmmodule").on("submit", function(e) {
        e.preventDefault(); // Impede o envio tradicional do form
         toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-center",
        "timeOut": "3000"
        };
        $.ajax({
            url: "/register_module",
            type: "POST",
            data: $(this).serialize(),
            dataType: "json",
            success: function(response) {
                console.log("Resposta do servidor:", response);
                if (response.success) {
                  
                    toastr.success(response.message);
                    setTimeout(() => {
                        $('#modalDescricaoModule').modal('hide');
                        location.reload();
                    }, 2000);
                } else {
                    toastr.error(response.message);
                }
                   
                
            },
            error: function(xhr, status, error) {
                alert('Erro de requisiçao!');
                console.log("Erro AJAX:", xhr.responseText, status, error);
                $("#message").removeClass("success").addClass("error")
                    .text("Erro ao processar a requisição!").fadeIn().delay(3000).fadeOut();
            }
        });
    });//Fim do cadastro de disciplina

    //Editar a disciplina
      $('#frmeditmodule').on('submit', function(e) {
         e.preventDefault();
           
           const idcourse   = $('#frmeditmodule #id_course').val();
           const dsmodule   = $('#frmeditmodule #ds_module').val();
           const vlworkload = $('#frmeditmodule #vl_workload').val();
           const idmodule   = $('#frmeditmodule #edit_id_module').val();
           
            toastr.options = {
                "closeButton": true,
                "progressBar": true,
                "positionClass": "toast-top-center",
                "timeOut": "3000"
            };

            $.ajax({
                type: 'POST',
                url: '/update_module',
                data: {
                    edit_id_module: idmodule,                    
                    ds_module: dsmodule,
                    vl_workload:vlworkload,
                    id_course:idcourse
                },
                dataType: 'json', 
                success: function(response) {
                    if (response.success) {
                        toastr.success(response.message);
                        // Atualiza o botão "Editar" com o novo valor
                        $('#row-' + id).find('.course-name').data('ds_course', ds_course);
                        // Atualiza o botão "Editar" com o novo valor
                        $('#row-' + id).find('.editCourse').data('ds_course', ds_course);
                        
                    } else {
                        toastr.error(response.message);
                    }
                },
                error: function(xhr) {
                    toastr.error("Erro ao atualizar a disciplina.");
                    console.log(xhr.responseText);
                }
            });

    });

    //Fim da edição da disciplina

     //Exclusão da disciplina
          
    // Quando clica no botão de excluir    
    let itemIdToDeleteModule  = null;
    $('.btn-delete').on('click', function() {
        itemIdToDeleteModule = $(this).data('id');
        console.log('confirma exclusao ' + itemIdToDeleteModule)
        $('#modalDeleteModule').modal('show');
    });

    $('#confirmDeleteBtnModule').on('click', function() {
    if (itemIdToDeleteModule !== null) {

        toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-center",
        "timeOut": "3000"
        };

        $.ajax({
        url: '/delete_module?recordId=' + itemIdToDeleteModule,
        type: 'GET',
        data: { id: itemIdToDeleteModule },
        success: function(response) {
        if (response.success) {
            toastr.success(response.message);
            setTimeout(() => {
                $('#modalDeleteModule').modal('hide');
                location.reload();
            }, 2000);
        } else {
            toastr.error(response.message);
        }
    }
    });    
    //Fim do modal de exclusão

    };
})

    //Fim da exclusão da disciplina

    //Cadastro de turma
    $("#frmclassroom").on("submit", function(e) {
        e.preventDefault(); // Impede o envio tradicional do form

            $('#frmEditClassroom #edit_ds_classroom').val(ds_class);
            $('#frmEditClassroom #edit_id').val(recordId);

         const idclassroom   = $('#frmclassroom #edit_id').val();
         const dsclassroom   = $('#frmclassroom #edit_ds_classroom').val();
         
         toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-center",
        "timeOut": "3000"
        };
        $.ajax({
            url: "/register_classroom",
            type: "POST",
            data: $(this).serialize(),
            dataType: "json",
            success: function(response) {
                console.log("Resposta do servidor:", response);
                if (response.success) {
                  
                    toastr.success(response.message);
                    setTimeout(() => {
                        $('#modalDescriptionClassroom').modal('hide');
                        location.reload();
                    }, 2000);
                } else {
                    toastr.error(response.message);
                } 
                
            },
            error: function(xhr, status, error) {
                alert('Erro de requisiçao!');
                console.log("Erro AJAX:", xhr.responseText, status, error);
                $("#message").removeClass("success").addClass("error")
                    .text("Erro ao processar a requisição!").fadeIn().delay(3000).fadeOut();
            }
        });
    });

    //Fim do cadastro de turma

    //Edição de turma
       
  $('#frmEditClassroom').on('submit', function(e) {
    e.preventDefault();
                       
    const id = $('#edit_id1').val();
    const ds_classroom = $('#edit_ds_classroom').val();
     
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-center",
        "timeOut": "3000"
    };

    $.ajax({
        type: 'POST',
        url: '/update_classroom',
        data: {
            id: id,
            ds_classroom: ds_classroom
        },
        dataType: 'json', 
        success: function(response) {
            if (response.success) {
                toastr.success(response.message);
                 // Atualiza o botão "Editar" com o novo valor
                $('#row-' + id).find('.course-name').data('ds_course', ds_course);
                // Atualiza o botão "Editar" com o novo valor
                $('#row-' + id).find('.editCourse').data('ds_course', ds_course);
                

            } else {
                toastr.error(response.message);
            }
        },
        error: function(xhr) {
            toastr.error("Erro ao atualizar o curso.");
            console.log(xhr.responseText);
        }
    });
});

    //Fim de edição de turma


})
    





