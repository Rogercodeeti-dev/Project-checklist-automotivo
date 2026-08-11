<?php

namespace App\Controllers;

//os recursos do miniframework
use MF\Controller\Action;
use MF\Model\Container;


class IndexController extends Action {

	public function index() {
		
		$this->view->login = isset($_GET['login']) ?  $_GET['login'] : '';
		$this->view->reset = isset($_GET['reset']) ?  $_GET['reset'] : '';
	
		$this->render('index');
	}
	
	public function listuser() {
        $user = Container::getModel('User');
		$users= $user->getAllUsers();
		$position = Container::getModel('Position');
		$positions = $position->getAllPositions();
		$role = Container::getModel('Role');
		$roles = $role->getAllRoles();
		$this->view->user = $users;
		$this->view->positions = $positions;
		$this->view->roles = $roles;
		$this->render('users');
	}

	
	public function edit_course(){
		$id = isset($_GET['recordId']) ? $_GET['recordId'] : '';
		$course = Container::getModel('Course');
		$course->__set('id', $id);
		$dadosCurso = $course->getCourse();

		// Retorna como JSON
		header('Content-Type: application/json');
		echo json_encode($dadosCurso);
		exit;
				
	 }

	 public function update_course() {
		
		$id = $_POST['id_course'];
		$ds_course = $_POST['ds_course'];

		$course = Container::getModel('Course');
		$course->__set('id', $id);
		$course->__set('ds_course', $ds_course);

		$resultado = $course->updateCourse();

		echo json_encode(['status' => $resultado ? 'success' : 'fail']);
	}

	public function listmodule() {
        $module = Container::getModel('Module');
		$modules= $module->getAllModules();

		$course = Container::getModel('Course');
		$courses= $course->getAllCourses();

		$this->view->module = $modules; 
		$this->view->course = $courses;
		$this->render('modules');
	}

	public function listmark() {
		$mark = Container::getModel('Mark');
		$marks = $mark->getAllMarks();
		$this->view->marks = $marks;
		$this->render('marks');
	}

	public function listmodel() {
		$model = Container::getModel('VehicleModel');
		$models = $model->getAllModels();
		$mark = Container::getModel('Mark');
		$marks = $mark->getAllMarks();
		$this->view->models = $models;
		$this->view->marks = $marks; // para select de marcas
		$this->render('models');
	}

	public function listclient() {
		$client = Container::getModel('Client');
		$clients = $client->getAllClients();
		$this->view->clients = $clients;
		$this->render('clients');
	}

	public function listtypevehicle() {
		$typevehicle = Container::getModel('TypeVehicle');
		$typevehicles = $typevehicle->getAllTypeVehicles();
		$this->view->typevehicles = $typevehicles;
		$this->render('typevehicles');
	}

	public function listvehicle() {
		$vehicle = Container::getModel('Vehicle');
		$vehicles = $vehicle->getAllVehicles();
		$client = Container::getModel('Client');
		$clients = $client->getAllClients();
		$model = Container::getModel('VehicleModel');
		$models = $model->getAllModels();
		$typevehicle = Container::getModel('TypeVehicle');
		$typevehicles = $typevehicle->getAllTypeVehicles();
		$mark = Container::getModel('Mark');
		$marks = $mark->getAllMarks();
		$this->view->vehicles = $vehicles;
		$this->view->clients = $clients;
		$this->view->models = $models;
		$this->view->typevehicles = $typevehicles;
		$this->view->marks = $marks;
		$this->render('vehicles');
	}

	public function listservice() {
		$service = Container::getModel('Service');
		$services = $service->getAllServices();
		$laborforce = Container::getModel('Laborforce');
		$laborforces = $laborforce->getAllLaborforces();
		$this->view->services = $services;
		$this->view->laborforces = $laborforces;
		$this->render('services');
	}

	public function listlaborforce() {
		$laborforce = Container::getModel('Laborforce');
		$laborforces = $laborforce->getAllLaborforces();
		$this->view->laborforces = $laborforces;
		$this->render('laborforce');
	}

	public function listposition() {
		$position = Container::getModel('Position');
		$positions = $position->getAllPositions();
		$this->view->positions = $positions;
		$this->render('positions');
	}

	public function listproduct() {
		$product = Container::getModel('Product');
		$products = $product->getAllProducts();
		$this->view->products = $products;
		$this->render('products');
	}

	public function listrole() {
		$role = Container::getModel('Role');
		$roles = $role->getAllRoles();
		$this->view->roles = $roles;
		$this->render('roles');
	}

	public function newchecklist() {
		session_start();
		$this->render('newchecklist');
	}

	public function saveChecklistAttendance() {
		session_start();
		header('Content-Type: application/json');

		try {
			if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
				echo json_encode(['success' => false, 'message' => 'Método inválido']);
				return;
			}

			$nr_workorder = $_POST['nr_workorder'] ?? '';
			if (empty($nr_workorder)) {
				echo json_encode(['success' => false, 'message' => 'nr_workorder é obrigatório']);
				return;
			}

			$checklist = Container::getModel('Checklist');
			$checklist->__set('nr_workorder', $nr_workorder);

			$existing = $checklist->getByWorkorder();

			$checklist->__set('id_user', $_SESSION['id'] ?? 1);

			if (isset($_POST['id_status']) && $_POST['id_status'] !== '') {
				$checklist->__set('id_status', (int)$_POST['id_status']);
			}

			if (isset($_POST['nm_customer']) && $_POST['nm_customer'] !== '') {
				$checklist->__set('nm_customer', trim($_POST['nm_customer']));
			}
			if (isset($_POST['nr_phone']) && $_POST['nr_phone'] !== '') {
				$checklist->__set('nr_phone', trim($_POST['nr_phone']));
			}
			if (isset($_POST['ds_email']) && $_POST['ds_email'] !== '') {
				$checklist->__set('ds_email', trim($_POST['ds_email']));
			}
			if (isset($_POST['ds_testimonialcustomer']) && $_POST['ds_testimonialcustomer'] !== '') {
				$checklist->__set('ds_testimonialcustomer', trim($_POST['ds_testimonialcustomer']));
			}
			if (isset($_POST['id_laborforce']) && $_POST['id_laborforce'] !== '') {
				$checklist->__set('id_laborforce', (int)$_POST['id_laborforce']);
			}
			if (isset($_POST['dt_servicedate']) && $_POST['dt_servicedate'] !== '') {
				$checklist->__set('dt_servicedate', $_POST['dt_servicedate']);
			}
			if (isset($_POST['hr_servicehours']) && $_POST['hr_servicehours'] !== '') {
				$checklist->__set('hr_servicehours', $_POST['hr_servicehours']);
			}

			if ($existing) {
				$result = $checklist->update();
				echo json_encode(['success' => true, 'message' => 'Dados atualizados com sucesso', 'id' => $existing['id'], 'nr_workorder' => $nr_workorder]);
			} else {
				$id = $checklist->save();
				echo json_encode(['success' => true, 'message' => 'Dados salvos com sucesso', 'id' => $id, 'nr_workorder' => $nr_workorder]);
			}
		} catch (\Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Erro ao salvar: ' . $e->getMessage()]);
		}
	}

	public function saveChecklistVehicle() {
		session_start();
		header('Content-Type: application/json');

		try {
			if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
				echo json_encode(['success' => false, 'message' => 'Método inválido']);
				return;
			}

			$nr_workorder = $_POST['nr_workorder'] ?? '';
			if (empty($nr_workorder)) {
				echo json_encode(['success' => false, 'message' => 'nr_workorder é obrigatório']);
				return;
			}

			$checklist = Container::getModel('Checklist');
			$checklist->__set('nr_workorder', $nr_workorder);

			$existing = $checklist->getByWorkorder();
			if (!$existing) {
				echo json_encode(['success' => false, 'message' => 'Checklist não encontrado. Salve primeiro os dados do atendimento.']);
				return;
			}

			if (isset($_POST['nr_vehiclelicenseplate']) && $_POST['nr_vehiclelicenseplate'] !== '') {
				$checklist->__set('nr_vehiclelicenseplate', trim($_POST['nr_vehiclelicenseplate']));
			}
			if (isset($_POST['ds_vehicle']) && $_POST['ds_vehicle'] !== '') {
				$checklist->__set('ds_vehicle', trim($_POST['ds_vehicle']));
			}
			if (isset($_POST['ds_color']) && $_POST['ds_color'] !== '') {
				$checklist->__set('ds_color', trim($_POST['ds_color']));
			}
			if (isset($_POST['nr_year']) && $_POST['nr_year'] !== '') {
				$checklist->__set('nr_year', (int)$_POST['nr_year']);
			}
			if (isset($_POST['nrKilometer']) && $_POST['nrKilometer'] !== '') {
				$checklist->__set('nrKilometer', (int)$_POST['nrKilometer']);
			}
			if (isset($_POST['nr_fuellevel']) && $_POST['nr_fuellevel'] !== '') {
				$checklist->__set('nr_fuellevel', (int)$_POST['nr_fuellevel']);
			}

			$result = $checklist->update();
			echo json_encode(['success' => true, 'message' => 'Dados do veículo salvos com sucesso']);
		} catch (\Exception $e) {
			echo json_encode(['success' => false, 'message' => 'Erro ao salvar: ' . $e->getMessage()]);
		}
	}

	public function checklistprogress() {
		$this->render('checklistprogress');
	}

	public function checklistfinished() {
		$this->render('checklistfinished');
	}

	//Update module
	public function update_module() {
		
		$id = $_POST['edit_id_module'];
		$idcourse = $_POST['id_course'];
		$dsmodule = $_POST['ds_module'];
		$vlworkload = $_POST['vl_workload'];

		$module = Container::getModel('Module');
		$module->__set('id', $id);
		$module->__set('ds_module', $dsmodule);
		$module->__set('vl_workload', $vlworkload);
		$module->__set('id_course', $idcourse);

		$resultado = $module->updateModule();

		echo json_encode(['status' => $resultado ? 'success' : 'fail']);
	}

	public function listclassroom() {
        $classroom = Container::getModel('Classroom');
		$classrooms= $classroom->getAllClassrooms();
		
		$this->view->classroom = $classrooms; 
		$this->render('classroom');
	}

	//Update classroom
	public function update_classroom() {
		
		$id = $_POST['id'];
		$edit_ds_classroom = $_POST['ds_classroom'];
		
		$classroom = Container::getModel('Classroom');
		$classroom->__set('id', $id);
		$classroom->__set('ds_class', $edit_ds_classroom);
		
		$resultado = $classroom->updateClassroom();

		echo json_encode(['status' => $resultado ? 'success' : 'fail']);
	}

}



?>