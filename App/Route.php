<?php

namespace App;

use MF\Init\Bootstrap;

class Route extends Bootstrap {

	protected function initRoutes() {

		$routes['index'] = array(
			'route' => '/',
			'controller' => 'indexController',
			'action' => 'index'
		);
		
		//Rota de autenticação
		$routes['authenticate'] = array(
			'route' => '/authenticate',
			'controller' => 'AuthController',
			'action' => 'authenticate'
		);

		$routes['logout'] = array(
			'route' => '/logout',
			'controller' => 'AuthController',
			'action' => 'logout'
		);

		//Rota de menu
		$routes['mainmenu'] = array(
			'route' => '/mainmenu',
			'controller' => 'AdminController',
			'action' => 'mainmenu'
		);

		//Listagem de usuários
		$routes['listuser'] = array(
			'route' => '/listuser',
			'controller' => 'IndexController',
			'action' => 'listuser'
		);

		//Listagem de marcas
		$routes['listmark'] = array(
			'route' => '/listmark',
			'controller' => 'IndexController',
			'action' => 'listmark'
		);

		//Listagem de modelos
		$routes['listmodel'] = array(
			'route' => '/listmodel',
			'controller' => 'IndexController',
			'action' => 'listmodel'
		);

		//Listagem de clientes
		$routes['listclient'] = array(
			'route' => '/listclient',
			'controller' => 'IndexController',
			'action' => 'listclient'
		);

		/*register_user - Cadastro de usuários*/
		$routes['register_user'] = array(
			'route' => '/register_user',
			'controller' => 'AppController',
			'action' => 'register_user'
		);

		$routes['update_settings'] = array(
			'route' => '/update_settings',
			'controller' => 'AppController',
			'action' => 'update_settings'
		);

		$routes['save_mark'] = array(
			'route' => '/save_mark',
			'controller' => 'AppController',
			'action' => 'save_mark'
		);

		$routes['get_mark'] = array(
			'route' => '/get_mark',
			'controller' => 'AppController',
			'action' => 'get_mark'
		);

		$routes['update_mark'] = array(
			'route' => '/update_mark',
			'controller' => 'AppController',
			'action' => 'update_mark'
		);

		$routes['delete_mark'] = array(
			'route' => '/delete_mark',
			'controller' => 'AppController',
			'action' => 'delete_mark'
		);

		$routes['save_model'] = array(
			'route' => '/save_model',
			'controller' => 'AppController',
			'action' => 'save_model'
		);

		$routes['get_model'] = array(
			'route' => '/get_model',
			'controller' => 'AppController',
			'action' => 'get_model'
		);

		$routes['update_model'] = array(
			'route' => '/update_model',
			'controller' => 'AppController',
			'action' => 'update_model'
		);

		$routes['delete_model'] = array(
			'route' => '/delete_model',
			'controller' => 'AppController',
			'action' => 'delete_model'
		);

		$routes['update_profile'] = array(
			'route' => '/update_profile',
			'controller' => 'AppController',
			'action' => 'update_profile'
		);

		$routes['get_user'] = array(
			'route' => '/get_user',
			'controller' => 'AppController',
			'action' => 'get_user'
		);

		$routes['update_user'] = array(
			'route' => '/update_user',
			'controller' => 'AppController',
			'action' => 'update_user'
		);

		$routes['delete_user'] = array(
			'route' => '/delete_user',
			'controller' => 'AppController',
			'action' => 'delete_user'
		);

		$routes['toggle_user_active'] = array(
			'route' => '/toggle_user_active',
			'controller' => 'AppController',
			'action' => 'toggle_user_active'
		);

		//Clientes
		$routes['save_client'] = array(
			'route' => '/save_client',
			'controller' => 'AppController',
			'action' => 'save_client'
		);

		$routes['get_client'] = array(
			'route' => '/get_client',
			'controller' => 'AppController',
			'action' => 'get_client'
		);

		$routes['update_client'] = array(
			'route' => '/update_client',
			'controller' => 'AppController',
			'action' => 'update_client'
		);

		$routes['delete_client'] = array(
			'route' => '/delete_client',
			'controller' => 'AppController',
			'action' => 'delete_client'
		);

		//Tipo de Veículo
		$routes['listtypevehicle'] = array(
			'route' => '/listtypevehicle',
			'controller' => 'IndexController',
			'action' => 'listtypevehicle'
		);

		$routes['save_typevehicle'] = array(
			'route' => '/save_typevehicle',
			'controller' => 'AppController',
			'action' => 'save_typevehicle'
		);

		$routes['get_typevehicle'] = array(
			'route' => '/get_typevehicle',
			'controller' => 'AppController',
			'action' => 'get_typevehicle'
		);

		$routes['update_typevehicle'] = array(
			'route' => '/update_typevehicle',
			'controller' => 'AppController',
			'action' => 'update_typevehicle'
		);

		$routes['delete_typevehicle'] = array(
			'route' => '/delete_typevehicle',
			'controller' => 'AppController',
			'action' => 'delete_typevehicle'
		);

		//Serviço
		$routes['listservice'] = array(
			'route' => '/listservice',
			'controller' => 'IndexController',
			'action' => 'listservice'
		);

		$routes['save_service'] = array(
			'route' => '/save_service',
			'controller' => 'AppController',
			'action' => 'save_service'
		);

		$routes['get_service'] = array(
			'route' => '/get_service',
			'controller' => 'AppController',
			'action' => 'get_service'
		);

		$routes['update_service'] = array(
			'route' => '/update_service',
			'controller' => 'AppController',
			'action' => 'update_service'
		);

		$routes['delete_service'] = array(
			'route' => '/delete_service',
			'controller' => 'AppController',
			'action' => 'delete_service'
		);

		$routes['get_all_services'] = array(
			'route' => '/get_all_services',
			'controller' => 'AppController',
			'action' => 'get_all_services'
		);

		//Cargo
		$routes['listposition'] = array(
			'route' => '/listposition',
			'controller' => 'IndexController',
			'action' => 'listposition'
		);

		$routes['save_position'] = array(
			'route' => '/save_position',
			'controller' => 'AppController',
			'action' => 'save_position'
		);

		$routes['get_position'] = array(
			'route' => '/get_position',
			'controller' => 'AppController',
			'action' => 'get_position'
		);

		$routes['update_position'] = array(
			'route' => '/update_position',
			'controller' => 'AppController',
			'action' => 'update_position'
		);

		$routes['delete_position'] = array(
			'route' => '/delete_position',
			'controller' => 'AppController',
			'action' => 'delete_position'
		);

		$routes['get_all_positions'] = array(
			'route' => '/get_all_positions',
			'controller' => 'AppController',
			'action' => 'get_all_positions'
		);

		//Perfil de Acesso
		$routes['listrole'] = array(
			'route' => '/listrole',
			'controller' => 'IndexController',
			'action' => 'listrole'
		);

		$routes['save_role'] = array(
			'route' => '/save_role',
			'controller' => 'AppController',
			'action' => 'save_role'
		);

		$routes['get_role'] = array(
			'route' => '/get_role',
			'controller' => 'AppController',
			'action' => 'get_role'
		);

		$routes['update_role'] = array(
			'route' => '/update_role',
			'controller' => 'AppController',
			'action' => 'update_role'
		);

		$routes['delete_role'] = array(
			'route' => '/delete_role',
			'controller' => 'AppController',
			'action' => 'delete_role'
		);

		$routes['get_all_roles'] = array(
			'route' => '/get_all_roles',
			'controller' => 'AppController',
			'action' => 'get_all_roles'
		);

		//Veículos
		$routes['listvehicle'] = array(
			'route' => '/listvehicle',
			'controller' => 'IndexController',
			'action' => 'listvehicle'
		);

		$routes['save_vehicle'] = array(
			'route' => '/save_vehicle',
			'controller' => 'AppController',
			'action' => 'save_vehicle'
		);

		$routes['get_vehicle'] = array(
			'route' => '/get_vehicle',
			'controller' => 'AppController',
			'action' => 'get_vehicle'
		);

		$routes['update_vehicle'] = array(
			'route' => '/update_vehicle',
			'controller' => 'AppController',
			'action' => 'update_vehicle'
		);

		$routes['delete_vehicle'] = array(
			'route' => '/delete_vehicle',
			'controller' => 'AppController',
			'action' => 'delete_vehicle'
		);

		$routes['get_all_models'] = array(
			'route' => '/get_all_models',
			'controller' => 'AppController',
			'action' => 'get_all_models'
		);

		$routes['get_all_clients'] = array(
			'route' => '/get_all_clients',
			'controller' => 'AppController',
			'action' => 'get_all_clients'
		);

		$routes['get_all_typevehicles'] = array(
			'route' => '/get_all_typevehicles',
			'controller' => 'AppController',
			'action' => 'get_all_typevehicles'
		);

		//Permissões
		$routes['save_permission'] = array(
			'route' => '/save_permission',
			'controller' => 'AppController',
			'action' => 'save_permission'
		);

		$routes['get_permission'] = array(
			'route' => '/get_permission',
			'controller' => 'AppController',
			'action' => 'get_permission'
		);

		$routes['update_permission'] = array(
			'route' => '/update_permission',
			'controller' => 'AppController',
			'action' => 'update_permission'
		);

		$routes['delete_permission'] = array(
			'route' => '/delete_permission',
			'controller' => 'AppController',
			'action' => 'delete_permission'
		);

		$routes['get_all_permissions'] = array(
			'route' => '/get_all_permissions',
			'controller' => 'AppController',
			'action' => 'get_all_permissions'
		);

		$routes['get_permissions_grouped'] = array(
			'route' => '/get_permissions_grouped',
			'controller' => 'AppController',
			'action' => 'get_permissions_grouped'
		);

		$this->setRoutes($routes);
	}

}

?>