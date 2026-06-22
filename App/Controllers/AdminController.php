<?php

    /*
    Definição do namespace - Está no mesmo diretório
    App\Controller
    */

    namespace App\Controllers;

    //os recursos do miniframework
    /*
    Importação dos recursos -  
    action (Abstração do controlador)
    Container - Serve para instanciar modelos
    */

    use MF\Controller\Action;
    use MF\Model\Container;

    class AdminController extends Action{
        
        public function mainmenu()
        {            
            session_start();            
            if(['nm_login'] != '')                
            {                 
               $this->render('menu'); 
               
            } else {
                header('Location: /?login=erro');
                }
        }
 }
  

    