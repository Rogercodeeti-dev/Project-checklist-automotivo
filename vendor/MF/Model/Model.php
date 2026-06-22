<?php


namespace MF\Model;

abstract class Model {

	protected $db;

	public function __construct(\PDO $db) {
		$this->db = $db;
	}

	public function deleteRecord($table, $primaryKey, $id, $msgRestrict = null)
    {
        header("Content-Type: application/json");

        try {
            $query = "DELETE FROM {$table} WHERE {$primaryKey} = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':id', $id);
            $stmt->execute();

            echo json_encode([
                'success' => true,
                'message' => 'Registro excluído com sucesso!'
            ]);
        } catch (\PDOException $e) {
            if ($e->getCode() == '23000') { // chave estrangeira
                echo json_encode([
                    'success' => false,
                    'message' => $msgRestrict ?: 'Não é possível excluir este registro. Existem dados vinculados a ele.'
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Erro: ' . $e->getMessage()
                ]);
            }
        }
    }
}










?>