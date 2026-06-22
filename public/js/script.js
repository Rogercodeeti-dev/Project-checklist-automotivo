
$(document).ready(function () {
    var $ajaxContent = $('#ajax-content');

    function loadAjaxContent(url) {
        if (!$ajaxContent.length) {
            console.error('AJAX target #ajax-content não encontrado.');
            return;
        }

        $.ajax({
            url: url,
            method: 'POST',
            dataType: 'html'
        }).done(function (data) {
            $ajaxContent.html(data);
        }).fail(function (xhr, status, error) {
            console.error('Falha ao carregar conteúdo AJAX:', status, error);
            $ajaxContent.html('<div class="alert alert-danger">Erro ao carregar a página. Tente novamente.</div>');
        });
    }

    // Generic handler: any sidebar link with `data-url` will be loaded via AJAX
    $('.sidebar-menu').on('click', 'a[data-url]', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var url = $(this).data('url') || $(this).attr('href');
        if (!url || url === '#') {
            console.error('URL inválida para carregamento AJAX:', url);
            return;
        }

        loadAjaxContent(url);
    });
});