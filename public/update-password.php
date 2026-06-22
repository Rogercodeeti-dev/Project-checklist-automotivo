<?php
require_once "../vendor/autoload.php";

use App\Connection;

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['token']) || !isset($_POST['password']) || !isset($_POST['confirm_password'])) {
    header('Location: /');
    exit;
}

$token = $_POST['token'];
$password = $_POST['password'];
$confirmPassword = $_POST['confirm_password'];

if (strlen($password) < 6) {
    header('Location: reset-password.php?token=' . urlencode($token) . '&error=short');
    exit;
}

if ($password !== $confirmPassword) {
    header('Location: reset-password.php?token=' . urlencode($token) . '&error=mismatch');
    exit;
}

$db = Connection::getDb();

$stmt = $db->prepare("SELECT id FROM tb_user WHERE reset_token = ? AND reset_expires > NOW()");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    header('Location: reset-password.php?token=' . urlencode($token) . '&error=invalid');
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $db->prepare("UPDATE tb_user SET ds_password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?");
$stmt->execute([$hashedPassword, $user['id']]);

header('Location: /?reset=success');
exit;
?>