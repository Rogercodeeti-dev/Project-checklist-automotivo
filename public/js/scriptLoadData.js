       // $(document).ready(() => {
            //Edição dos cursos
           
         $('.editCourse').on('click', function(e) {
            e.preventDefault();
          
            // Recupera os dados do botão
            const recordId = $(this).data('id'); 
            const ds_course = $(this).data('ds_course-edit'); 
            alert('ds_course ' + ds_course )
          
            // Preenche os campos da modal
            $('#frmEditarCurso #ds_course-edit').val(ds_course);
            $('#frmEditarCurso #id_course').val(recordId);

            // Exibe a modal
            $('#modalEditarCurso').modal('show');
           // $('#modalEditarClassroom').modal('show');
        });


    //Edição das disciplinas
     $('.editModule').on('click', function(e) {
                   
        const id_module = $(this).data('id');
        const id_course = $(this).data('id_course');
        const ds_module = $(this).data('ds_module');
        const vl_workload = $(this).data('vl_workload');

        // Preenche os campos da modal
        $('#frmeditmodule #id_course').val(id_course);
        $('#frmeditmodule #ds_module').val(ds_module);
        $('#frmeditmodule #vl_workload').val(vl_workload);

        // Guarda o ID do módulo para o update
       if ($('#frmeditmodule #edit_id_module').length === 0) {
            $('#frmeditmodule').append('<input type="hidden" name="id_module" id="edit_id_module">');
        }
        $('#frmeditmodule #edit_id_module').val(id_module);

    });

    //Edição das turmas
      $(document).ready(() => {
            //Edição dos cursos
            $('.editClassroom').on('click', function(e) {
            e.preventDefault();
          
            // Recupera os dados do botão
            const recordId = $(this).data('id'); 
            const ds_class = $(this).data('ds_class');
                     
                               
            // Preenche os campos da modal
            $('#frmEditClassroom #edit_ds_classroom').val(ds_class);
            $('#frmEditClassroom #edit_id1').val(recordId);

            // Exibe a modal
            $('#modalEditClassroom').modal('show');
        });
    });
    
   
    //Fim da edição das turmas
    
//});
