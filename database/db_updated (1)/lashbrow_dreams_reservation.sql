-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: lashbrow_dreams
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` varchar(100) NOT NULL,
  `storeId` int NOT NULL,
  `serviceId` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `admin` varchar(100) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reservation_store_idx` (`storeId`),
  KEY `fk_reservation_service_idx` (`serviceId`),
  KEY `fk_reservation_user_idx` (`customerId`),
  CONSTRAINT `fk_reservation_service` FOREIGN KEY (`serviceId`) REFERENCES `service` (`id`),
  CONSTRAINT `fk_reservation_store` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`),
  CONSTRAINT `fk_reservation_user` FOREIGN KEY (`customerId`) REFERENCES `user` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (1,'shakira@cosmeticos.com',1,1,'2024-03-15','08:00:00','lucas@test.com','Completado'),(2,'antorocuzzo@messi.com',1,1,'2024-05-02','08:00:00','lucas@test.com','Completado'),(3,'antorocuzzo@messi.com',2,3,'2024-08-14','10:00:00','messi@imiami.com','Pendiente'),(4,'kent@springfield',3,2,'2024-08-25','11:00:00','cr7@elbicho.com','Pendiente'),(5,'teressa@lashes.com',3,1,'2024-08-23','14:15:00','cr7@elbicho.com','Pendiente'),(6,'cr7@elbicho.com',3,2,'2024-08-14','13:00:00','cr7@elbicho.com','Pendiente'),(7,'messi@imiami.com',1,2,'2024-08-16','16:00:00','lucas@test.com','Pendiente'),(8,'messi@imiami.com',2,2,'2024-08-16','15:45:00','messi@imiami.com','Pendiente');
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-12 20:00:43
