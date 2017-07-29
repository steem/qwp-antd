-- MySQL dump 10.13  Distrib 5.7.9, for Win32 (AMD64)
--
-- Host: localhost    Database: qwp_adminlte
-- ------------------------------------------------------
-- Server version	5.6.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sys_modules`
--

DROP TABLE IF EXISTS `sys_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_modules` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `identity` varchar(48) NOT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `parent` varchar(255) NOT NULL,
  `type` enum('m','p','op') NOT NULL DEFAULT 'm',
  `seq` int(11) DEFAULT NULL,
  `enabled` enum('y','n') NOT NULL DEFAULT 'y',
  `name` varchar(64) NOT NULL,
  `required` enum('y','n') DEFAULT 'n',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Unique_identity` (`identity`,`parent`),
  KEY `Index_name` (`identity`),
  KEY `Index_op` (`type`),
  KEY `Index_parent` (`parent`),
  KEY `Index_seq` (`seq`),
  KEY `Index_enabled` (`enabled`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_modules`
--

LOCK TABLES `sys_modules` WRITE;
/*!40000 ALTER TABLE `sys_modules` DISABLE KEYS */;
INSERT INTO `sys_modules` VALUES (1,'dashboard','','0-','m',1,'y','Dashboard','n'),(2,'system',NULL,'0-','m',2,'y','System','n'),(3,'ou',NULL,'0-2-','m',2,'y','Organization','n'),(4,'settings',NULL,'0-2-','m',2,'y','Settings','n'),(6,'roles',NULL,'0-2-','m',1,'y','Roles','n'),(8,'list_user',NULL,'0-2-3-','op',1,'y','View','n'),(9,'add_user',NULL,'0-2-3-','op',1,'y','Add','n'),(10,'edit_user',NULL,'0-2-3-','op',1,'y','Edit','n'),(11,'del_user',NULL,'0-2-3-','op',1,'y','Delete','n'),(12,'role',NULL,'0-2-3-','p',1,'y','','y'),(13,'list',NULL,'0-2-3-','op',1,'y','View','y');
/*!40000 ALTER TABLE `sys_modules` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-09-27 16:29:42
