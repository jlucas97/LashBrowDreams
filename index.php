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

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

/*--- Required frameworks and classes*/
require_once "models/MySqlConnect.php";
/***--- Add all models*/
require_once "models/CategoryModel.php";
require_once "models/SubCategoryModel.php";
require_once "models/ProviderModel.php";
require_once "models/ProductModel.php";
require_once "models/TypeModel.php";
require_once "models/ServiceModel.php";
require_once "models/UserModel.php";
require_once "models/StoreModel.php";
require_once "models/ScheduleModel.php";
require_once "models/ReservationModel.php";
require_once "models/InvoiceModel.php";
/***--- Add all controllers*/
require_once "controllers/CategoryController.php";
require_once "controllers/SubCategoryController.php";
require_once "controllers/ProviderController.php";
require_once "controllers/ProductController.php";
require_once "controllers/TypeController.php";
require_once "controllers/ServiceController.php";
require_once "controllers/UserController.php";
require_once "controllers/StoreController.php";
require_once "controllers/ScheduleController.php";
require_once "controllers/ReservationController.php";
require_once "controllers/InvoiceController.php";

//Routes
require_once "controllers/RoutesController.php";
$index = new RoutesController();
$index->index();
//agregar todos los modelos y controladores 