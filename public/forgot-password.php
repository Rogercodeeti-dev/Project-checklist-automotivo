<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Esqueci minha senha - AppChecklist</title>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="/dist/css/AdminLTE.min.css">
    <link rel="stylesheet" href="/dist/css/skins/skin-blue.min.css">
</head>
<body class="hold-transition login-page">
    <div class="login-box">
        <div class="login-logo">
            <a href="/"><b>App</b>Checklist</a>
        </div>
        <div class="login-box-body">
            <p class="login-box-msg">Digite seu e-mail para recuperar a senha</p>

            <?php if (isset($_GET['sent']) && $_GET['sent'] == '1'): ?>
                <div class="alert alert-info">
                    Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.
                </div>
            <?php endif; ?>

            <form action="send-reset.php" method="post">
                <div class="form-group has-feedback">
                    <input type="email" name="email" class="form-control" placeholder="E-mail" required>
                    <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                </div>
                <div class="row">
                    <div class="col-xs-6">
                        <button type="submit" class="btn btn-primary btn-block btn-flat">Link de recuperação</button>
                    </div>
                    <div class="col-xs-6">
                        <a href="/" class="btn btn-default btn-block btn-flat">Voltar para login</a>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <script src="/plugins/jQuery/jquery-2.2.3.min.js"></script>
    <script src="/bootstrap/js/bootstrap.min.js"></script>
</body>
</html>