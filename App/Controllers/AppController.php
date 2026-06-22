<?php
 
namespace App\Controllers;

//os recursos do miniframework
use MF\Controller\Action;
use MF\Model\Container;

class AppController extends Action {
	
    /*
	 Função register_course
	 Objetivo: Atribuição dos valores no método set do objeto course
	*/

	public function register_user()
{
    try {
        $user = Container::getModel('User');

        // checkbox → se não vier no POST = 0
        $ds_level  = isset($_POST['ds_level']) ? 1 : 0;   // admin
        $ds_active = isset($_POST['ds_active']) ? 1 : 0;  // ativo

        // data atual do cadastro
        $dataCadastro = date('Y-m-d H:i:s');

        $user->__set('nm_name',    trim($_POST['nm_name']));
        $user->__set('nm_login',   trim($_POST['nm_login']));
        $user->__set('ds_email',   trim($_POST['ds_email']));
        $user->__set('ds_password', trim($_POST['ds_password']));
        $user->__set('ds_level',   $ds_level);
        $user->__set('ds_active',  $ds_active);
        $user->__set('nr_phone',   trim($_POST['nr_phone']));
        $user->__set('ds_address', trim($_POST['ds_address']));

        $photoPath = '/dist/img/sem-foto.jpg';
        if (!empty($_FILES['ds_photo']['name']) && $_FILES['ds_photo']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = dirname(__DIR__, 2) . '/public/dist/img/users/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $fileName = uniqid('user_') . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', basename($_FILES['ds_photo']['name']));
            $targetPath = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['ds_photo']['tmp_name'], $targetPath)) {
                $photoPath = '/dist/img/users/' . $fileName;
            }
        }

        $user->__set('ds_photo', $photoPath);

        $user->save();

        // Prepare user data for response
        $userData = [
            'id' => $user->id,
            'nm_name' => $user->__get('nm_name'),
            'ds_email' => $user->__get('ds_email'),
            'nr_phone' => $user->__get('nr_phone'),
            'ds_level' => $user->__get('ds_level'),
            'ds_active' => $user->__get('ds_active') ? 'Sim' : 'Não',
            'ds_photo' => $user->__get('ds_photo')
        ];

        echo json_encode(['success' => true, 'user' => $userData]);
    } 
    catch (\Exception $e) {

		$errorMessage = "Erro ao cadastrar usuário.";

		$errorTechnical = $e->getMessage();

		// Verifica se é erro de duplicidade (UNIQUE)
		if (strpos($errorTechnical, '1062') !== false) {

			// Descobrir qual campo duplicou
			if (strpos($errorTechnical, 'nm_login') !== false) {
				$errorMessage = "Erro de cadastro: este login já está sendo utilizado.";
			} 
			elseif (strpos($errorTechnical, 'ds_email') !== false) {
				$errorMessage = "Erro de cadastro: este e-mail já está cadastrado.";
			} 
			elseif (strpos($errorTechnical, 'ds_password') !== false) {
				$errorMessage = "Erro de cadastro: esta senha já está cadastrado.";
			}elseif (strpos($errorTechnical, 'nr_phone') !== false) {
				$errorMessage = "Erro de cadastro: est telefone já está cadastrado.";
			}
		}

		echo json_encode([
			'success' => false,
			'message' => $errorMessage
		]);
	}	
}

	public function get_user() {
		$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
		$user = Container::getModel('User');
		$user->__set('id', $id);
		$dadosUsuario = $user->getById();

		header('Content-Type: application/json');
		echo json_encode($dadosUsuario ?: []);
		exit;
	}

	public function update_profile()
	{
		try {
			if (session_status() !== PHP_SESSION_ACTIVE) {
				session_start();
			}

			$user = Container::getModel('User');
			$id = isset($_SESSION['id']) ? (int) $_SESSION['id'] : (int) ($_POST['id'] ?? 0);
			if ($id <= 0) {
				throw new \Exception('Usuário não identificado.');
			}

			$user->__set('id', $id);
			$existingUser = $user->getById();
			if (!$existingUser) {
				throw new \Exception('Usuário não encontrado.');
			}

			$user->__set('nm_name', trim($_POST['nm_name'] ?? $existingUser['nm_name']));
			$user->__set('nm_login', trim($_POST['nm_login'] ?? $existingUser['nm_login']));
			$user->__set('ds_email', trim($_POST['ds_email'] ?? $existingUser['ds_email']));
			$user->__set('nr_phone', trim($_POST['nr_phone'] ?? $existingUser['nr_phone']));
			$user->__set('ds_address', trim($_POST['ds_address'] ?? $existingUser['ds_address']));
			$user->__set('ds_level', $existingUser['ds_level'] ?? 0);
			$user->__set('ds_active', $existingUser['ds_active'] ?? 0);

			if (!empty($_POST['ds_password'])) {
				$user->__set('ds_password', trim($_POST['ds_password']));
			}

			$photoPath = $existingUser['ds_photo'] ?? '/dist/img/sem-foto.jpg';
			if (!empty($_FILES['ds_photo']['name']) && $_FILES['ds_photo']['error'] === UPLOAD_ERR_OK) {
				$uploadDir = dirname(__DIR__, 2) . '/public/dist/img/users/';
				if (!is_dir($uploadDir)) {
					mkdir($uploadDir, 0755, true);
				}

				$fileName = uniqid('user_') . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', basename($_FILES['ds_photo']['name']));
				$targetPath = $uploadDir . $fileName;

				if (move_uploaded_file($_FILES['ds_photo']['tmp_name'], $targetPath)) {
					$photoPath = '/dist/img/users/' . $fileName;
				}
			}

			$user->__set('ds_photo', $photoPath);
			$user->update();

			echo json_encode([
				'success' => true,
				'message' => 'Perfil atualizado com sucesso.',
				'user' => [
					'nm_name' => $user->__get('nm_name'),
					'nm_login' => $user->__get('nm_login'),
					'ds_email' => $user->__get('ds_email'),
					'nr_phone' => $user->__get('nr_phone'),
					'ds_photo' => $photoPath,
				],
			]);
		} catch (\Exception $e) {
			$message = 'Erro ao atualizar perfil.';
			if (strpos($e->getMessage(), '1062') !== false) {
				if (strpos($e->getMessage(), 'nm_login') !== false) {
					$message = 'Este login já está em uso.';
				} elseif (strpos($e->getMessage(), 'ds_email') !== false) {
					$message = 'Este e-mail já está em uso.';
				} elseif (strpos($e->getMessage(), 'nr_phone') !== false) {
					$message = 'Este telefone já está em uso.';
				}
			}

			echo json_encode(['success' => false, 'message' => $message]);
		}
	}

	public function update_user() {
		try {
			$user = Container::getModel('User');
			$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;

			$user->__set('id', $id);
			$existingUser = $user->getById();
			if (!$existingUser) {
				throw new \Exception('Usuário não encontrado.');
			}

			$ds_level  = isset($_POST['ds_level']) ? 1 : ($existingUser['ds_level'] ?? 0);
			$ds_active = isset($_POST['ds_active']) ? 1 : ($existingUser['ds_active'] ?? 0);

			$user->__set('nm_name', trim($_POST['nm_name']));
			$user->__set('nm_login', trim($_POST['nm_login']));
			$user->__set('ds_email', trim($_POST['ds_email']));
			$user->__set('ds_level', $ds_level);
			$user->__set('ds_active', $ds_active);
			$user->__set('nr_phone', trim($_POST['nr_phone']));
			$user->__set('ds_address', trim($_POST['ds_address']));

			if (!empty($_POST['ds_password'])) {
				$user->__set('ds_password', trim($_POST['ds_password']));
			}

			$photoPath = $existingUser['ds_photo'] ?? '/dist/img/sem-foto.jpg';
			if (!empty($_FILES['ds_photo']['name']) && $_FILES['ds_photo']['error'] === UPLOAD_ERR_OK) {
				$uploadDir = dirname(__DIR__, 2) . '/public/dist/img/users/';
				if (!is_dir($uploadDir)) {
					mkdir($uploadDir, 0755, true);
				}

				$fileName = uniqid('user_') . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', basename($_FILES['ds_photo']['name']));
				$targetPath = $uploadDir . $fileName;

				if (move_uploaded_file($_FILES['ds_photo']['tmp_name'], $targetPath)) {
					$photoPath = '/dist/img/users/' . $fileName;
				}
			}

			$user->__set('ds_photo', $photoPath);
			$user->update();

			echo json_encode(['success' => true]);
		} catch (\Exception $e) {
			$errorMessage = 'Erro ao atualizar usuário.';
			if (strpos($e->getMessage(), '1062') !== false) {
				if (strpos($e->getMessage(), 'nm_login') !== false) {
					$errorMessage = 'Este login já está em uso.';
				} elseif (strpos($e->getMessage(), 'ds_email') !== false) {
					$errorMessage = 'Este e-mail já está em uso.';
				} elseif (strpos($e->getMessage(), 'nr_phone') !== false) {
					$errorMessage = 'Este telefone já está em uso.';
				}
			}

			echo json_encode(['success' => false, 'message' => $errorMessage]);
		}
	}

	public function update_settings()
	{
		try {
			$setting = new \App\Models\Setting();
			$currentSettings = $setting->getSettings();

			$uploadDir = dirname(__DIR__, 2) . '/public/dist/img/settings/';
			if (!is_dir($uploadDir)) {
				mkdir($uploadDir, 0755, true);
			}

			$systemLogo = trim($_POST['ds_system_logo'] ?? $currentSettings['ds_system_logo'] ?? '');
			if (!empty($_FILES['ds_system_logo_file']['name']) && $_FILES['ds_system_logo_file']['error'] === UPLOAD_ERR_OK) {
				$fileName = uniqid('settings_logo_') . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', basename($_FILES['ds_system_logo_file']['name']));
				$targetPath = $uploadDir . $fileName;
				if (move_uploaded_file($_FILES['ds_system_logo_file']['tmp_name'], $targetPath)) {
					$systemLogo = '/dist/img/settings/' . $fileName;
				}
			} elseif (!empty($systemLogo) && strpos($systemLogo, '/') !== 0) {
				$systemLogo = '/dist/img/logo/' . $systemLogo;
			}

			$reportIcon = trim($_POST['ds_reporticon'] ?? $currentSettings['ds_reporticon'] ?? '');
			if (!empty($_FILES['ds_reporticon_file']['name']) && $_FILES['ds_reporticon_file']['error'] === UPLOAD_ERR_OK) {
				$fileName = uniqid('settings_reporticon_') . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', basename($_FILES['ds_reporticon_file']['name']));
				$targetPath = $uploadDir . $fileName;
				if (move_uploaded_file($_FILES['ds_reporticon_file']['tmp_name'], $targetPath)) {
					$reportIcon = '/dist/img/settings/' . $fileName;
				}
			} elseif (!empty($reportIcon) && strpos($reportIcon, '/') !== 0) {
				$reportIcon = '/dist/img/logo/' . $reportIcon;
			}

			$systemIcon = trim($_POST['ds_icon'] ?? $currentSettings['ds_icon'] ?? '');
			if (!empty($_FILES['ds_icon_file']['name']) && $_FILES['ds_icon_file']['error'] === UPLOAD_ERR_OK) {
				$fileName = uniqid('settings_icon_') . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', basename($_FILES['ds_icon_file']['name']));
				$targetPath = $uploadDir . $fileName;
				if (move_uploaded_file($_FILES['ds_icon_file']['tmp_name'], $targetPath)) {
					$systemIcon = '/dist/img/settings/' . $fileName;
				}
			} elseif (!empty($systemIcon) && strpos($systemIcon, '/') !== 0) {
				$systemIcon = '/dist/img/logo/' . $systemIcon;
			}

			$setting->updateSettings([
				'nm_systemname' => trim($_POST['nm_systemname'] ?? ''),
				'nm_socialreazon' => trim($_POST['nm_socialreazon'] ?? ''),
				'nm_fantasyname' => trim($_POST['nm_fantasyname'] ?? ''),
				'nr_cnpj' => trim($_POST['nr_cnpj'] ?? ''),
				'nr_zipcode' => trim($_POST['nr_zipcode'] ?? ''),
				'ds_email' => trim($_POST['ds_email'] ?? ''),
				'ds_url' => trim($_POST['ds_url'] ?? ''),
				'ds_instagram' => trim($_POST['ds_instagram'] ?? ''),
				'nr_phone' => trim($_POST['nr_phone'] ?? ''),
				'ds_system_logo' => $systemLogo,
				'ds_reporticon' => $reportIcon,
				'ds_icon' => $systemIcon,
				'ds_active' => isset($_POST['ds_active']) ? 1 : 0,
			]);

			header('Content-Type: application/json');
			echo json_encode([
				'success' => true,
				'message' => 'Configurações salvas com sucesso.',
				'settings' => [
					'ds_system_logo' => $systemLogo,
					'ds_reporticon' => $reportIcon,
					'ds_icon' => $systemIcon,
				],
			]);
		} catch (\Exception $e) {
			header('Content-Type: application/json');
			echo json_encode(['success' => false, 'message' => 'Erro ao atualizar configurações.']);
		}
	}

	public function delete_user() {
		$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
		$user = Container::getModel('User');
		$user->__set('id', $id);
		$user->delete();
		echo json_encode(['success' => true]);
	}

	public function toggle_user_active() {
		$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
		$active = isset($_POST['active']) && $_POST['active'] == 1 ? 1 : 0;
		$user = Container::getModel('User');
		$user->__set('id', $id);
		$existingUser = $user->getById();

		if (!$existingUser) {
			echo json_encode(['success' => false]);
			return;
		}

		$user->__set('nm_name', $existingUser['nm_name']);
		$user->__set('nm_login', $existingUser['nm_login']);
		$user->__set('ds_email', $existingUser['ds_email']);
		$user->__set('ds_level', $existingUser['ds_level']);
		$user->__set('nr_phone', $existingUser['nr_phone']);
		$user->__set('ds_address', $existingUser['ds_address']);
		$user->__set('ds_active', $active);
		$user->__set('ds_photo', $existingUser['ds_photo'] ?? '/dist/img/sem-foto.jpg');
		$user->update();
		echo json_encode(['success' => true, 'active' => $active]);
	}

	public function save_mark() {
		try {
			$nm_name = trim($_POST['nm_name'] ?? '');
			$cartype = trim($_POST['cartype'] ?? 'outro');
			$ds_soon = trim($_POST['ds_soon'] ?? '');
			if ($nm_name === '') {
			    header('Content-Type: application/json');
				echo json_encode(['success' => false, 'message' => 'O nome da marca é obrigatório.']);
				return;
			}

			$mark = Container::getModel('Mark');
			$mark->__set('nm_name', $nm_name);
			$mark->__set('cartype', $cartype);
			$mark->__set('ds_soon', $ds_soon);
			$id = $mark->save();
			header('Content-Type: application/json');
			echo json_encode(['success' => true, 'message' => 'Registro salvo com sucesso.']);
		} catch (\Exception $e) {
			header('Content-Type: application/json');
			echo json_encode(['success' => false, 'message' => 'Erro ao salvar marca.'.$e->getMessage()]);
		}
		exit;
	}

	public function get_mark() {
		$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
		$mark = Container::getModel('Mark');
		$data = $mark->getById($id);
		header('Content-Type: application/json');
		echo json_encode($data ?: []);
		exit;
	}

	public function update_mark() {
		try {
			$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
			$nm_name = trim($_POST['nm_name'] ?? '');
			$cartype = trim($_POST['cartype'] ?? 'outro');
			$ds_soon = trim($_POST['ds_soon'] ?? '');
			if ($id <= 0) { echo json_encode(['success' => false, 'message' => 'ID inválido.']); return; }
			if ($nm_name === '') { echo json_encode(['success' => false, 'message' => 'O nome da marca é obrigatório.']); return; }
			$mark = Container::getModel('Mark');
			$mark->__set('id', $id);
			$mark->__set('nm_name', $nm_name);
			$mark->__set('cartype', $cartype);
			$mark->__set('ds_soon', $ds_soon);
			$ok = $mark->update();
			echo json_encode(['success' => (bool)$ok]);
		} catch (\Exception $e) { echo json_encode(['success' => false, 'message' => 'Erro ao atualizar marca.']); }
	}

	public function delete_mark() {
		try {
			$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
			if ($id <= 0) { echo json_encode(['success' => false]); return; }
			$mark = Container::getModel('Mark');
			// Verifica integridade: existem modelos vinculados?
			if ($mark->hasModels($id)) {
				echo json_encode(['success' => false, 'message' => 'Não é possível excluir esta marca pois existem modelos vinculados.']);
				return;
			}

			$ok = $mark->deleteById($id);
			echo json_encode(['success' => (bool)$ok]);
		} catch (\Exception $e) { echo json_encode(['success' => false]); }
	}

	public function save_model() {
		try {
			$id_mark = isset($_POST['id_mark']) ? (int) $_POST['id_mark'] : 0;
			$ds_model = trim($_POST['ds_model'] ?? '');
			$type_model = trim($_POST['type_model'] ?? 'outro');
			if ($id_mark <= 0) { echo json_encode(['success' => false, 'message' => 'Selecione a marca.']); return; }
			if ($ds_model === '') { echo json_encode(['success' => false, 'message' => 'Nome do modelo é obrigatório.']); return; }
			
			$model = Container::getModel('VehicleModel');
			$model->__set('id_mark', $id_mark);
			$model->__set('ds_model', $ds_model);
			$model->__set('type_model', $type_model);
			$id = $model->save();
			echo json_encode(['success' => true, 'id' => $id]);
		} catch (\Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Erro ao salvar modelo.']);
		}
	}

	public function get_model() {
		$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
		$model = Container::getModel('VehicleModel');
		$data = $model->getById($id);
		header('Content-Type: application/json');
		echo json_encode($data ?: []);
		exit;
	}

	public function update_model() {
		try {
			$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
			$id_mark = isset($_POST['id_mark']) ? (int) $_POST['id_mark'] : 0;
			$ds_model = trim($_POST['ds_model'] ?? '');
			$type_model = trim($_POST['type_model'] ?? 'outro');
			if ($id <= 0) { echo json_encode(['success' => false, 'message' => 'ID inválido.']); return; }
			if ($id_mark <= 0) { echo json_encode(['success' => false, 'message' => 'Selecione a marca.']); return; }
			if ($ds_model === '') { echo json_encode(['success' => false, 'message' => 'Nome do modelo é obrigatório.']); return; }
			$model = Container::getModel('VehicleModel');
			$model->__set('id', $id);
			$model->__set('id_mark', $id_mark);
			$model->__set('ds_model', $ds_model);
			$model->__set('type_model', $type_model);
			$ok = $model->update();
			echo json_encode(['success' => (bool)$ok]);
		} catch (\Exception $e) { echo json_encode(['success' => false, 'message' => 'Erro ao atualizar modelo.']); }
	}

	public function delete_model() {
		try {
			$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
			if ($id <= 0) { echo json_encode(['success' => false]); return; }
			$model = Container::getModel('VehicleModel');
			$ok = $model->deleteById($id);
			echo json_encode(['success' => (bool)$ok]);
		} catch (\Exception $e) { echo json_encode(['success' => false]); }
	}

	// ===================== CLIENTES =====================

	public function save_client() {
		try {
			$nm_client = trim($_POST['nm_client'] ?? '');
			$tp_person = trim($_POST['tp_person']);

			// Log temporário para debug
			file_put_contents(
				dirname(__DIR__, 2) . '/tmp_debug.log',
				date('H:i:s') . ' POST=' . json_encode($_POST) . ' tp_person=[' . $tp_person . ']' . PHP_EOL,
				FILE_APPEND
			);

			if ($nm_client === '') {
				header('Content-Type: application/json');
				echo json_encode(['success' => false, 'message' => 'O nome do cliente é obrigatório.']);
				return;
			}
			if ($tp_person !== 'PF' && $tp_person !== 'PJ') {
				header('Content-Type: application/json');
				echo json_encode(['success' => false, 'message' => 'Tipo de pessoa inválido.']);
				return;
			}

			$client = Container::getModel('Client');
			$client->__set('tp_person', $tp_person === 'PJ' ? 'PJ' : 'PF');
			$client->__set('nr_cpf', trim($_POST['nr_cpf'] ?? ''));
			$client->__set('nr_cnpj', trim($_POST['nr_cnpj'] ?? ''));
			$client->__set('nm_client', $nm_client);
			$client->__set('nm_socialreazon', trim($_POST['nm_socialreazon'] ?? ''));
			$client->__set('nm_fantasy', trim($_POST['nm_fantasy'] ?? ''));
			$client->__set('nr_phone', trim($_POST['nr_phone'] ?? ''));
			$client->__set('nr_cellphone', trim($_POST['nr_cellphone'] ?? ''));
			$client->__set('ds_email', trim($_POST['ds_email'] ?? ''));
			$client->__set('nr_zipcode', trim($_POST['nr_zipcode'] ?? ''));

			$client->save();
			header('Content-Type: application/json');
			echo json_encode(['success' => true, 'message' => 'Cadastro realizado com sucesso.']);
		} catch (\Exception $e) {
			$errorMessage = 'Erro ao salvar cliente: '.$e->getMessage();
			if (strpos($e->getMessage(), '1062') !== false) {
				if (strpos($e->getMessage(), 'nr_cpf') !== false) {
					$errorMessage = 'Este CPF já está cadastrado.';
				} elseif (strpos($e->getMessage(), 'nr_cnpj') !== false) {
					$errorMessage = 'Este CNPJ já está cadastrado.';
				} elseif (strpos($e->getMessage(), 'nm_socialreazon') !== false) {
					$errorMessage = 'Esta Razão Social já está cadastrada.';
				} elseif (strpos($e->getMessage(), 'nm_fantasy') !== false) {
					$errorMessage = 'Este Nome Fantasia já está cadastrado.';
				} elseif (strpos($e->getMessage(), 'ds_email') !== false) {
					$errorMessage = 'Este E-mail já está cadastrado.';
				} elseif (strpos($e->getMessage(), 'nr_phone') !== false) {
					$errorMessage = 'Este Telefone já está cadastrado.';
				} elseif (strpos($e->getMessage(), 'nr_cellphone') !== false) {
					$errorMessage = 'Este Celular já está cadastrado.';
				}
			}
			header('Content-Type: application/json');
			echo json_encode(['success' => false, 'message' => $errorMessage]);
		}
		exit;
	}

	public function get_client() {
		$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
		$client = Container::getModel('Client');
		$client->__set('id_client', $id);
		$data = $client->getById($id);
		header('Content-Type: application/json');
		echo json_encode($data ?: []);
		exit;
	}

	public function update_client() {
		try {
			$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
			$nm_client = trim($_POST['nm_client'] ?? '');
			if ($id <= 0) { echo json_encode(['success' => false, 'message' => 'ID inválido.']); return; }
			if ($nm_client === '') { echo json_encode(['success' => false, 'message' => 'O nome do cliente é obrigatório.']); return; }

			$client = Container::getModel('Client');
			$client->__set('id_client', $id);
			$client->__set('tp_person', (trim($_POST['tp_person'] ?? 'PF') === 'PJ') ? 'J' : 'F');
			$client->__set('nr_cpf', trim($_POST['nr_cpf'] ?? ''));
			$client->__set('nr_cnpj', trim($_POST['nr_cnpj'] ?? ''));
			$client->__set('nm_client', $nm_client);
			$client->__set('nm_socialreazon', trim($_POST['nm_socialreazon'] ?? ''));
			$client->__set('nm_fantasy', trim($_POST['nm_fantasy'] ?? ''));
			$client->__set('nr_phone', trim($_POST['nr_phone'] ?? ''));
			$client->__set('nr_cellphone', trim($_POST['nr_cellphone'] ?? ''));
			$client->__set('ds_email', trim($_POST['ds_email'] ?? ''));
			$client->__set('nr_zipcode', trim($_POST['nr_zipcode'] ?? ''));

			$ok = $client->update();
			header('Content-Type: application/json');
			echo json_encode(['success' => (bool)$ok, 'message' => 'Alteração realizada com sucesso.']);
		} catch (\Exception $e) {
			$errorMessage = 'Erro ao atualizar cliente.';
			if (strpos($e->getMessage(), '1062') !== false) {
				if (strpos($e->getMessage(), 'nr_cpf') !== false) {
					$errorMessage = 'Este CPF já está cadastrado.';
				} elseif (strpos($e->getMessage(), 'nr_cnpj') !== false) {
					$errorMessage = 'Este CNPJ já está cadastrado.';
				} elseif (strpos($e->getMessage(), 'nm_socialreazon') !== false) {
					$errorMessage = 'Esta Razão Social já está cadastrada.';
				} elseif (strpos($e->getMessage(), 'nm_fantasy') !== false) {
					$errorMessage = 'Este Nome Fantasia já está cadastrado.';
				} elseif (strpos($e->getMessage(), 'ds_email') !== false) {
					$errorMessage = 'Este E-mail já está cadastrado.';
				} elseif (strpos($e->getMessage(), 'nr_phone') !== false) {
					$errorMessage = 'Este Telefone já está cadastrado.';
				} elseif (strpos($e->getMessage(), 'nr_cellphone') !== false) {
					$errorMessage = 'Este Celular já está cadastrado.';
				}
			}
			header('Content-Type: application/json');
			echo json_encode(['success' => false, 'message' => $errorMessage]);
		}
	}

	public function delete_client() {
		try {
			$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
			if ($id <= 0) { echo json_encode(['success' => false]); return; }
			$client = Container::getModel('Client');
			$ok = $client->deleteById($id);
			header('Content-Type: application/json');
			echo json_encode(['success' => (bool)$ok, 'message' => 'Exclusão realizada com sucesso.']);
		} catch (\Exception $e) {
			header('Content-Type: application/json');
			echo json_encode(['success' => false, 'message' => 'Erro ao excluir cliente.']);
		}
	}

	// ===================== TIPO DE VEÍCULO =====================

	public function save_typevehicle() {
		try {
			$ds_type = trim($_POST['ds_type'] ?? '');
			if ($ds_type === '') {
				header('Content-Type: application/json');
				echo json_encode(['success' => false, 'message' => 'O tipo de veículo é obrigatório.']);
				return;
			}

			$typevehicle = Container::getModel('TypeVehicle');
			$typevehicle->__set('ds_type', $ds_type);
			$id = $typevehicle->save();
			header('Content-Type: application/json');
			echo json_encode(['success' => true, 'message' => 'Tipo de veículo cadastrado com sucesso.']);
		} catch (\Exception $e) {
			header('Content-Type: application/json');
			if (strpos($e->getMessage(), '1062') !== false) {
				echo json_encode(['success' => false, 'message' => 'Este tipo de veículo já está cadastrado.']);
			} else {
				echo json_encode(['success' => false, 'message' => 'Erro ao salvar tipo de veículo.']);
			}
		}
		exit;
	}

	public function get_typevehicle() {
		$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
		$typevehicle = Container::getModel('TypeVehicle');
		$data = $typevehicle->getById($id);
		header('Content-Type: application/json');
		echo json_encode($data ?: []);
		exit;
	}

	public function update_typevehicle() {
		try {
			$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
			$ds_type = trim($_POST['ds_type'] ?? '');
			if ($id <= 0) { echo json_encode(['success' => false, 'message' => 'ID inválido.']); return; }
			if ($ds_type === '') { echo json_encode(['success' => false, 'message' => 'O tipo de veículo é obrigatório.']); return; }
			$typevehicle = Container::getModel('TypeVehicle');
			$typevehicle->__set('id', $id);
			$typevehicle->__set('ds_type', $ds_type);
			$ok = $typevehicle->update();
			header('Content-Type: application/json');
			echo json_encode(['success' => (bool)$ok, 'message' => 'Tipo de veículo atualizado com sucesso.']);
		} catch (\Exception $e) {
			header('Content-Type: application/json');
			if (strpos($e->getMessage(), '1062') !== false) {
				echo json_encode(['success' => false, 'message' => 'Este tipo de veículo já está cadastrado.']);
			} else {
				echo json_encode(['success' => false, 'message' => 'Erro ao atualizar tipo de veículo.']);
			}
		}
	}

	public function delete_typevehicle() {
		try {
			$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
			if ($id <= 0) { echo json_encode(['success' => false]); return; }
			$typevehicle = Container::getModel('TypeVehicle');
			$ok = $typevehicle->deleteById($id);
			header('Content-Type: application/json');
			echo json_encode(['success' => (bool)$ok, 'message' => 'Tipo de veículo excluído com sucesso.']);
		} catch (\Exception $e) {
			header('Content-Type: application/json');
			echo json_encode(['success' => false, 'message' => 'Erro ao excluir tipo de veículo.']);
		}
	}

	// ===================== VEÍCULOS =====================

	public function save_vehicle() {
		try {
			$id_client = isset($_POST['id_client']) ? (int) $_POST['id_client'] : 0;
			$id_model = isset($_POST['id_model']) ? (int) $_POST['id_model'] : 0;
			$id_typevehicle = isset($_POST['id_typevehicle']) ? (int) $_POST['id_typevehicle'] : 0;
			$nr_platevehicle = trim($_POST['nr_platevehicle'] ?? '');
			$nr_chassis = trim($_POST['nr_chassis'] ?? '');

			if ($id_client <= 0) { header('Content-Type: application/json'); echo json_encode(['success' => false, 'message' => 'Selecione o cliente.']); return; }
			if ($id_model <= 0) { header('Content-Type: application/json'); echo json_encode(['success' => false, 'message' => 'Selecione o modelo.']); return; }
			if ($id_typevehicle <= 0) { header('Content-Type: application/json'); echo json_encode(['success' => false, 'message' => 'Selecione o tipo de veículo.']); return; }
			if ($nr_platevehicle === '') { header('Content-Type: application/json'); echo json_encode(['success' => false, 'message' => 'A placa do veículo é obrigatória.']); return; }
			if ($nr_chassis === '') { header('Content-Type: application/json'); echo json_encode(['success' => false, 'message' => 'O número do chassi é obrigatório.']); return; }

			$vehicle = Container::getModel('Vehicle');
			$vehicle->__set('id_client', $id_client);
			$vehicle->__set('id_model', $id_model);
			$vehicle->__set('nr_platevehicle', $nr_platevehicle);
			$vehicle->__set('nr_chassis', $nr_chassis);
			$vehicle->__set('id_typevehicle', $id_typevehicle);
			$vehicle->__set('ds_color', trim($_POST['ds_color'] ?? ''));
			$vehicle->__set('ds_fuel', trim($_POST['ds_fuel'] ?? ''));
			$vehicle->__set('nr_currentkm', isset($_POST['nr_currentkm']) ? (int) $_POST['nr_currentkm'] : 0);
			$vehicle->__set('ds_observation', trim($_POST['ds_observation'] ?? ''));

			$id = $vehicle->save();
			header('Content-Type: application/json');
			echo json_encode(['success' => true, 'message' => 'Veículo cadastrado com sucesso.']);
		} catch (\Exception $e) {
			$errorMessage = 'Erro ao salvar veículo.';
			if (strpos($e->getMessage(), '1062') !== false) {
				if (strpos($e->getMessage(), 'nr_platevehicle') !== false) {
					$errorMessage = 'Esta placa de veículo já está cadastrada.';
				} elseif (strpos($e->getMessage(), 'nr_chassis') !== false) {
					$errorMessage = 'Este número de chassi já está cadastrado.';
				}
			}
			header('Content-Type: application/json');
			echo json_encode(['success' => false, 'message' => $errorMessage]);
		}
		exit;
	}

	public function get_vehicle() {
		$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
		$vehicle = Container::getModel('Vehicle');
		$data = $vehicle->getById($id);
		header('Content-Type: application/json');
		echo json_encode($data ?: []);
		exit;
	}

	public function update_vehicle() {
		try {
			$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
			$id_client = isset($_POST['id_client']) ? (int) $_POST['id_client'] : 0;
			$id_model = isset($_POST['id_model']) ? (int) $_POST['id_model'] : 0;
			$id_typevehicle = isset($_POST['id_typevehicle']) ? (int) $_POST['id_typevehicle'] : 0;
			$nr_platevehicle = trim($_POST['nr_platevehicle'] ?? '');
			$nr_chassis = trim($_POST['nr_chassis'] ?? '');

			if ($id <= 0) { header('Content-Type: application/json'); echo json_encode(['success' => false, 'message' => 'ID inválido.']); return; }
			if ($id_client <= 0) { header('Content-Type: application/json'); echo json_encode(['success' => false, 'message' => 'Selecione o cliente.']); return; }
			if ($id_model <= 0) { header('Content-Type: application/json'); echo json_encode(['success' => false, 'message' => 'Selecione o modelo.']); return; }
			if ($id_typevehicle <= 0) { header('Content-Type: application/json'); echo json_encode(['success' => false, 'message' => 'Selecione o tipo de veículo.']); return; }
			if ($nr_platevehicle === '') { header('Content-Type: application/json'); echo json_encode(['success' => false, 'message' => 'A placa do veículo é obrigatória.']); return; }
			if ($nr_chassis === '') { header('Content-Type: application/json'); echo json_encode(['success' => false, 'message' => 'O número do chassi é obrigatório.']); return; }

			$vehicle = Container::getModel('Vehicle');
			$vehicle->__set('id_vehicle', $id);
			$vehicle->__set('id_client', $id_client);
			$vehicle->__set('id_model', $id_model);
			$vehicle->__set('nr_platevehicle', $nr_platevehicle);
			$vehicle->__set('nr_chassis', $nr_chassis);
			$vehicle->__set('id_typevehicle', $id_typevehicle);
			$vehicle->__set('ds_color', trim($_POST['ds_color'] ?? ''));
			$vehicle->__set('ds_fuel', trim($_POST['ds_fuel'] ?? ''));
			$vehicle->__set('nr_currentkm', isset($_POST['nr_currentkm']) ? (int) $_POST['nr_currentkm'] : 0);
			$vehicle->__set('ds_observation', trim($_POST['ds_observation'] ?? ''));

			$ok = $vehicle->update();
			header('Content-Type: application/json');
			echo json_encode(['success' => (bool)$ok, 'message' => 'Veículo atualizado com sucesso.']);
		} catch (\Exception $e) {
			$errorMessage = 'Erro ao atualizar veículo.';
			if (strpos($e->getMessage(), '1062') !== false) {
				if (strpos($e->getMessage(), 'nr_platevehicle') !== false) {
					$errorMessage = 'Esta placa de veículo já está cadastrada.';
				} elseif (strpos($e->getMessage(), 'nr_chassis') !== false) {
					$errorMessage = 'Este número de chassi já está cadastrado.';
				}
			}
			header('Content-Type: application/json');
			echo json_encode(['success' => false, 'message' => $errorMessage]);
		}
	}

	public function delete_vehicle() {
		try {
			$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
			if ($id <= 0) { header('Content-Type: application/json'); echo json_encode(['success' => false]); return; }
			$vehicle = Container::getModel('Vehicle');
			$ok = $vehicle->deleteById($id);
			header('Content-Type: application/json');
			echo json_encode(['success' => (bool)$ok, 'message' => 'Veículo excluído com sucesso.']);
		} catch (\Exception $e) {
			header('Content-Type: application/json');
			echo json_encode(['success' => false, 'message' => 'Erro ao excluir veículo.']);
		}
	}

	public function get_all_models() {
		$model = Container::getModel('VehicleModel');
		$models = $model->getAllModels();
		header('Content-Type: application/json');
		echo json_encode($models ?: []);
		exit;
	}

	public function get_all_clients() {
		$client = Container::getModel('Client');
		$clients = $client->getAllClients();
		header('Content-Type: application/json');
		echo json_encode($clients ?: []);
		exit;
	}

	public function get_all_typevehicles() {
		$typevehicle = Container::getModel('TypeVehicle');
		$typevehicles = $typevehicle->getAllTypeVehicles();
		header('Content-Type: application/json');
		echo json_encode($typevehicles ?: []);
		exit;
	}
}
?>