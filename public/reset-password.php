<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Senha - AppChecklist</title>
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
            <?php
            require_once "../vendor/autoload.php";
            use App\Connection;

            $token = $_GET['token'] ?? '';
            $valid = false;
            $newPassword = '';
            $error = '';

            if ($token) {
                $db = Connection::getDb();
                if ($db) {
                    $stmt = $db->prepare("SELECT id FROM tb_user WHERE reset_token = ? AND reset_expires > NOW()");
                    $stmt->execute([$token]);
                    $user = $stmt->fetch();
                    if ($user) {
                        $valid = true;
                        // Generate new password
                        $newPassword = bin2hex(random_bytes(4)); // 8 characters
                        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
                        $stmt = $db->prepare("UPDATE tb_user SET ds_password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?");
                        if ($stmt->execute([$hashedPassword, $user['id']])) {
                            // Success
                        } else {
                            $valid = false;
                            $error = 'Erro ao atualizar a senha.';
                        }
                    } else {
                        $error = 'Token inválido ou expirado.';
                    }
                } else {
                    $error = 'Erro de conexão com o banco de dados.';
                }
            } else {
                $error = 'Token não fornecido.';
            }

            if (!$valid): ?>
                <p class="login-box-msg"><?php echo htmlspecialchars($error ?: 'Este link de recuperação é inválido ou expirou.'); ?></p>
                <a href="forgot-password.php" class="btn btn-primary btn-block btn-flat">Solicitar nova recuperação</a>
            <?php else: ?>
                <p class="login-box-msg">Sua nova senha foi gerada com sucesso!</p>
                <div class="alert alert-success">
                    <strong>Nova Senha:</strong> <?php echo htmlspecialchars($newPassword); ?>
                </div>
                <p>Use esta senha para fazer login. Você pode alterá-la no seu perfil após o login.</p>
                <a href="/" class="btn btn-primary btn-block btn-flat">Ir para Login</a>
            <?php endif; ?>
        </div>
    </div>

    <script src="/plugins/jQuery/jquery-2.2.3.min.js"></script>
    <script src="/bootstrap/js/bootstrap.min.js"></script>
</body>
</html>