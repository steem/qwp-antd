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
-- Table structure for table `sys_user`
--

DROP TABLE IF EXISTS `sys_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account` varchar(32) NOT NULL,
  `pwd` varchar(48) NOT NULL,
  `role` int(3) NOT NULL DEFAULT '1',
  `cust_role` int(10) DEFAULT NULL,
  `create_time` int(10) DEFAULT NULL,
  `last_login_time` int(10) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `status` enum('ok','lock','disable','del') NOT NULL DEFAULT 'ok',
  `first_login` enum('y','n') NOT NULL DEFAULT 'y',
  `del_time` int(10) unsigned NOT NULL DEFAULT '0',
  `phone` varchar(16) DEFAULT NULL,
  `online` enum('y','n') NOT NULL DEFAULT 'n',
  `last_heartbit_time` int(10) unsigned NOT NULL DEFAULT '0',
  `parent` varchar(255) NOT NULL DEFAULT '0',
  `level` enum('1','2','3') NOT NULL DEFAULT '1',
  `sys_group` int(10) unsigned NOT NULL DEFAULT '0',
  `region` int(10) DEFAULT NULL,
  `ukey` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index_account_unique` (`account`) USING BTREE,
  UNIQUE KEY `Index_nick_name_group_unique` (`name`,`sys_group`) USING BTREE,
  KEY `Index_account` (`account`),
  KEY `Index_pwd` (`pwd`),
  KEY `Index_role` (`role`),
  KEY `Index_create_time` (`create_time`),
  KEY `Index_last_login_time` (`last_login_time`),
  KEY `Index_name` (`name`),
  KEY `Index_status` (`status`),
  KEY `Index_first_login` (`first_login`),
  KEY `Index_del_time` (`del_time`),
  KEY `Index_online` (`online`),
  KEY `Index_last_heartbit_time` (`last_heartbit_time`),
  KEY `Index_level` (`level`),
  KEY `Index_parent` (`parent`),
  KEY `Index_sys_group` (`sys_group`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_user`
--

LOCK TABLES `sys_user` WRITE;
/*!40000 ALTER TABLE `sys_user` DISABLE KEYS */;
INSERT INTO `sys_user` VALUES (1,'admin','7946e795e44db67be4c74219def41e2e',1,NULL,1361171257,1421893162,'Admin','ok','n',0,NULL,'y',1421893162,'','1',0,NULL,NULL);
/*!40000 ALTER TABLE `sys_user` ENABLE KEYS */;
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
