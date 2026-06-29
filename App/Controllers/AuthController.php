<?php

namespace App\Controllers;

use MF\Controller\Action;
use MF\Model\Container;

class AuthController extends Action {

    public function authenticate() {

        session_start();

        // Validação básica
        if (!isset($_POST['nm_login']) || !isset($_POST['ds_password'])) {
            header('Location: /?login=erro');
            return;
        }

        $user = Container::getModel('User');

        // Agora usando os campos corretos da tabela
        $user->__set('nm_login', trim($_POST['nm_login']));
        $user->__set('ds_password', $_POST['ds_password']);

        $auth = $user->authenticate();

        if ($auth) {

            // Regenera sessão (proteção contra session fixation)
            session_regenerate_id(true);

            $_SESSION['id']   = $user->__get('id');
            $_SESSION['nm_login']   = $user->__get('nm_login');
            $_SESSION['id_position'] = $user->__get('id_position');

            header('Location: /mainmenu');
            exit;

        } else {

            header('Location: /?login=erro');
            exit;
        }
    }

    public function logout() {

        session_start();

        // Limpa tudo
        $_SESSION = [];

        // Destroi sessão corretamente
        session_destroy();

        header('Location: /');
        exit;
    }
}