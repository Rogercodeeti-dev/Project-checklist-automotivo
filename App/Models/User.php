<?php

namespace App\Models;

use MF\Model\Model;

class User extends Model{

    protected ?int $id = null;

    protected ?string $nm_name = null;
    protected ?string $nm_login = null;
    protected ?string $ds_email = null;
    protected ?string $ds_password = null;
    protected ?string $ds_password_crip = null;

    protected ?bool $ds_level = null;   // nível/perfil do usuário
    protected ?bool $ds_active = null;    // ativo/inativo (0 ou 1)

    protected ?string $nr_phone = null;
    protected ?string $ds_address = null;
    protected ?string $ds_photo = null;

    protected ?string $dt_date = null;    // data de cadastro (pode virar DateTime depois)


	public function __get($atributo) {
		return $this->$atributo;
	}

	public function __set($atributo, $valor) {
		$this->$atributo = $valor;
	}
    

	// =========================
	// SALVAR
	// =========================
	public function save()
{
    $query = "INSERT INTO tb_user 
    (
        nm_name,
        nm_login,
        ds_email,
        ds_password,        
        ds_level,
        ds_active,
        nr_phone,
        ds_address,
        ds_photo,
        dt_date
    )
    VALUES
    (
        :nm_name,
        :nm_login,
        :ds_email,
        :ds_password,      
        :ds_level,
        :ds_active,
        :nr_phone,
        :ds_address,
        :ds_photo,
        NOW()
    )";

    $stmt = $this->db->prepare($query);

    // dados básicos
    $stmt->bindValue(':nm_name', $this->__get('nm_name'));
    $stmt->bindValue(':nm_login', $this->__get('nm_login'));
    $stmt->bindValue(':ds_email', $this->__get('ds_email'));

    // senha hash
    $stmt->bindValue(
        ':ds_password',
        password_hash($this->__get('ds_password'), PASSWORD_DEFAULT)
    );

    

    // nível do usuário (ex: admin = 1, usuário comum = 0)
    $stmt->bindValue(':ds_level', $this->__get('ds_level') ?? 0);

    // ativo/inativo (default = ativo)
    $stmt->bindValue(':ds_active', $this->__get('ds_active') ?? 1);

    // opcionais
    $stmt->bindValue(':nr_phone', $this->__get('nr_phone'));
    $stmt->bindValue(':ds_address', $this->__get('ds_address'));
    $stmt->bindValue(':ds_photo', $this->__get('ds_photo') ?? '/dist/img/sem-foto.jpg');

    $stmt->execute();

    // Get the inserted ID
    $this->id = $this->db->lastInsertId();

    return $this;
}

	// =========================
	// ATUALIZAR
	// =========================
	// =========================
	public function update()
{
    $query = "UPDATE tb_user SET
                nm_name        = :nm_name,
                nm_login       = :nm_login,
                ds_email       = :ds_email,
                ds_level       = :ds_level,
                ds_active      = :ds_active,
                nr_phone       = :nr_phone,
                ds_address     = :ds_address,
                ds_photo       = :ds_photo
              WHERE id = :id";

    $stmt = $this->db->prepare($query);

    $stmt->bindValue(':nm_name', $this->__get('nm_name'));
    $stmt->bindValue(':nm_login', $this->__get('nm_login'));
    $stmt->bindValue(':ds_email', $this->__get('ds_email'));
    $stmt->bindValue(':ds_level', $this->__get('ds_level'));
    $stmt->bindValue(':ds_active', $this->__get('ds_active'));
    $stmt->bindValue(':nr_phone', $this->__get('nr_phone'));
    $stmt->bindValue(':ds_address', $this->__get('ds_address'));
    $stmt->bindValue(':ds_photo', $this->__get('ds_photo') ?? '/dist/img/sem-foto.jpg');
    $stmt->bindValue(':id', $this->__get('id'));

    $stmt->execute();

    // 🔐 Atualiza senha somente se foi enviada
    if ($this->__get('ds_password')) {
        $queryPass = "UPDATE tb_user 
                      SET ds_password = :ds_password 
                      WHERE id = :id";

        $stmt = $this->db->prepare($queryPass);
        $stmt->bindValue(
            ':ds_password',
            password_hash($this->__get('ds_password'), PASSWORD_DEFAULT)
        );
        $stmt->bindValue(':id', $this->__get('id'));
        $stmt->execute();
    }

    return $this;
}

	// =========================
	// ATUALIZAR SENHA (separado - boa prática)
	// =========================
	public function updatePassword() {

		$query = "UPDATE tb_user 
				  SET ds_password = :ds_password
				  WHERE id_user = :id_user";

		$stmt = $this->db->prepare($query);

		$stmt->bindValue(':ds_password', password_hash($this->__get('ds_password'), PASSWORD_DEFAULT));
		$stmt->bindValue(':id_user', $this->__get('id_user'));

		$stmt->execute();

		return $this;
	}

	// =========================
	// VALIDAÇÃO
	// =========================
	public function validateRegistration(): bool {

		if (
			strlen($this->__get('nm_user')) < 3 ||
			strlen($this->__get('nm_login')) < 3 ||
			strlen($this->__get('ds_password')) < 6 ||
			strlen($this->__get('ds_email')) < 5
		) {
			return false;
		}

		return true;
	}

	// =========================
	// LISTAR TODOS
	// =========================
	public function getAllUsers() {

		$query = "SELECT 
					id,
					nm_name,
					nm_login,
					ds_email,
				nr_phone,
				ds_level,
				ds_active,
				ds_photo
			  FROM tb_user";

		$stmt = $this->db->prepare($query);
		$stmt->execute();

		return $stmt->fetchAll(\PDO::FETCH_ASSOC);
	}

	// =========================
	// PAGINAÇÃO
	// =========================
	public function getPerPage($limit, $offset) {

		$query = "SELECT 
				id_user,
				nm_user,
				nm_login,
					id_company
				  FROM tb_user
				  LIMIT :limit OFFSET :offset";

		$stmt = $this->db->prepare($query);
		$stmt->bindValue(':limit', (int)$limit, \PDO::PARAM_INT);
		$stmt->bindValue(':offset', (int)$offset, \PDO::PARAM_INT);

		$stmt->execute();

		return $stmt->fetchAll(\PDO::FETCH_ASSOC);
	}

	// =========================
	// TOTAL REGISTROS
	// =========================
	public function getTotalRecord() {

		$query = "SELECT COUNT(*) as total FROM tb_user";

		$stmt = $this->db->prepare($query);
		$stmt->execute();

		return $stmt->fetch(\PDO::FETCH_ASSOC);
	}

	// =========================
	// AUTENTICAÇÃO
	// =========================
	public function authenticate(): bool
{
    // validação básica
    if (empty($this->__get('nm_login')) || empty($this->__get('ds_password'))) {
        return false;
    }

    $query = "SELECT id, nm_login, ds_password
              FROM tb_user
              WHERE nm_login = :nm_login
              LIMIT 1";

    $stmt = $this->db->prepare($query);
    $stmt->bindValue(':nm_login', $this->__get('nm_login'));
    $stmt->execute();

    $user = $stmt->fetch(\PDO::FETCH_ASSOC);

    // usuário não encontrado
    if (!$user) {
        return false;
    }

    // verifica senha com hash
    if (!password_verify($this->__get('ds_password'), $user['ds_password'])) {
        return false;
    }

    // sucesso → salva dados no objeto
    $this->__set('id', $user['id']);
    $this->__set('nm_login', $user['nm_login']);

    return true;
}
	
// =========================
	// BUSCAR POR ID
	// =========================
	public function getById() {

		$query = "SELECT *
				  FROM tb_user
				  WHERE id = :id";

		$stmt = $this->db->prepare($query);
		$stmt->bindValue(':id', $this->__get('id'));
		$stmt->execute();

		return $stmt->fetch(\PDO::FETCH_ASSOC);
	}

	// =========================
	// DELETE
	// =========================
	public function delete() {

		$query = "DELETE FROM tb_user WHERE id = :id";

		$stmt = $this->db->prepare($query);
		$stmt->bindValue(':id', $this->__get('id'));
		$stmt->execute();

		return true;
	}
}