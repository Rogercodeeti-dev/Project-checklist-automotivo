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
		$this->view->services = $services;
		$this->render('services');
	}

	public function listposition() {
		$position = Container::getModel('Position');
		$positions = $position->getAllPositions();
		$this->view->positions = $positions;
		$this->render('positions');
	}

	public function listrole() {
		$role = Container::getModel('Role');
		$roles = $role->getAllRoles();
		$this->view->roles = $roles;
		$this->render('roles');
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