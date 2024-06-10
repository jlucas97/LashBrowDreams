<?php
/* Show errors */
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', "C:/xampp/htdocs/lashbrowdreams/php_error_log");
/*CORS*/
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
//header('Content-Type: application/json');
/*--- Required frameworks and classes*/
require_once "models/MySqlConnect.php";
/***--- Add all models*/
require_once "models/CategoryModel.php";
/***--- Add all controllers*/
require_once "controllers/CategoryController.php";
//Routes
require_once "controllers/RoutesController.php";
$index = new RoutesController();
$index->index();
//agregar todos los modelos y controladores 