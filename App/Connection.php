<?php

namespace App;

class Connection {

	public static function getDb() {
		try {

			date_default_timezone_set('America/Sao_Paulo');

			$conn = new \PDO(
				"mysql:host=localhost;dbname=dbautomotivo;charset=utf8",
				"root",
				""
			);
			$conn->exec("SET time_zone = '-03:00'");
			self::seedDefaultUser($conn);
			return $conn;

		} catch (\PDOException $e) {
			echo "Erro de conexão: " . $e->getMessage();
			//.. tratar de alguma forma ..//
		}
		
	}

	public static function seedDefaultUser($db){

    $sql = "SELECT COUNT(*) as total FROM tb_user";
    $stmt = $db->query($sql);
    $result = $stmt->fetch();

    if ($result['total'] > 0) {
        return;
    }

    $passwordHash = password_hash("123456", PASSWORD_DEFAULT);

    $sql = "INSERT INTO tb_user
            (nm_name, nm_login, ds_email, ds_password, ds_active, ds_photo, dt_date)
            VALUES
            (:name, :login, :email, :password, :active, :photo, NOW())";

    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':name' => 'Administrador',
        ':login' => 'admin',
        ':email' => 'admin@admin.com',
        ':password' => $passwordHash,        
        ':active' => 1,
        ':photo' => '/dist/img/sem-foto.jpg'
    ]);
}
}
?>