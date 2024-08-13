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
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idStore` int NOT NULL,
  `dayOfWeek` tinyint NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `type` enum('horario','bloqueo') NOT NULL,
  `recurrence` tinyint(1) NOT NULL DEFAULT '1',
  `status` enum('disponible','ocupado') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_store` (`idStore`),
  CONSTRAINT `fk_store` FOREIGN KEY (`idStore`) REFERENCES `store` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,1,2,'08:00:00','16:30:00','horario',1,'disponible'),(2,1,3,'08:00:00','16:30:00','horario',1,'disponible'),(3,1,4,'08:00:00','16:30:00','horario',1,'disponible'),(4,1,5,'08:00:00','16:30:00','horario',1,'disponible'),(5,2,1,'08:00:00','16:00:00','horario',1,'disponible'),(6,2,2,'08:00:00','16:00:00','horario',1,'disponible'),(7,2,3,'08:00:00','16:00:00','horario',1,'disponible'),(8,2,4,'08:00:00','16:00:00','horario',1,'disponible'),(9,2,5,'08:00:00','12:00:00','horario',1,'disponible'),(10,3,1,'13:00:00','18:00:00','horario',1,'disponible'),(11,3,2,'13:00:00','18:00:00','horario',1,'disponible'),(12,3,3,'13:00:00','18:00:00','horario',1,'disponible'),(13,3,4,'13:00:00','18:00:00','horario',1,'disponible'),(14,3,5,'13:00:00','18:00:00','horario',1,'disponible');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-12 20:00:44
