<?php
require_once "../vendor/autoload.php";


use App\Connection;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['email'])) {
    header('Location: forgot-password.php');
    exit;
}

$email = trim($_POST['email']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: forgot-password.php');
    exit;
}

$db = Connection::getDb();

$stmt = $db->prepare("SELECT id FROM tb_user WHERE ds_email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user) {
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+30 minutes'));

    $stmt = $db->prepare("UPDATE tb_user SET reset_token = ?, reset_expires = ? WHERE id = ?");
    $stmt->execute([$token, $expires, $user['id']]);

    // Enviar email
    $mail = new PHPMailer(true);
    try {
        // Configurações SMTP - ajustar conforme necessário
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Substituir pelo seu servidor SMTP
        $mail->SMTPAuth = true;
        $mail->Username = 'rogercodedev@gmail.com'; // Substituir
        $mail->Password = 'behd saqs zetp zybi'; // Substituir
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('rogercodedev@gmail.com', 'appchecklist');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'Recuperação de senha – Checklist Automotivo';
        $resetUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/reset-password.php?token=' . $token;
        $mail->Body = "
            <h2>Recuperação de Senha</h2>
            <p>Olá,</p>
            <p>Recebemos uma solicitação para redefinir sua senha.</p>
            <p>Clique no botão abaixo para gerar uma nova senha:</p>
            <a href='$resetUrl' style='background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Gerar Nova Senha</a>
            <p>Este link expira em 30 minutos.</p>
            <p>Se você não solicitou isso, ignore este e-mail.</p>
        ";

        //Para evitar erros de SSL em ambientes de desenvolvimento, 
        // descomente a linha abaixo. Em produção,
        //  certifique-se de ter um certificado válido.
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ];

        $mail->SMTPDebug = 0; 
        $mail->send();
       
      } catch (Exception $e) {
         // Log error, but don't show to user
      }
}
header('Location: forgot-password.php?sent=1');
exit;
?>