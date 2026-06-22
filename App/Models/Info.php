<?php

namespace App\Models;

use MF\Model\Model;

class Info extends Model {

	public function getInfo() {
		
		$query = "select * from tb_course";
		return $this->db->query($query)->fetchAll();
	}
}

?>