-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: medicare_pro
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('336ee70a-9eb0-4b63-9777-9fd4f7e0628a','d9cb4839614d68a8c2a2a03b235fc907cdeb9d52cf2582badcb859f86d6681ef','2025-09-01 13:53:14.065','20250901135313_init',NULL,NULL,'2025-09-01 13:53:13.423',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patientId` int NOT NULL,
  `doctorId` int NOT NULL,
  `dateTime` datetime(3) NOT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Appointment_doctorId_dateTime_idx` (`doctorId`,`dateTime`),
  KEY `Appointment_patientId_dateTime_idx` (`patientId`,`dateTime`),
  CONSTRAINT `Appointment_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `doctorprofile` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Appointment_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patientprofile` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (6,4,2,'2025-09-16 18:54:00.000','ACCEPTED','2025-09-16 18:51:28.159'),(7,5,1,'2025-09-23 23:04:00.000','PENDING','2025-09-16 19:04:23.416');
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctorprofile`
--

DROP TABLE IF EXISTS `doctorprofile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctorprofile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `specialization` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `DoctorProfile_userId_key` (`userId`),
  CONSTRAINT `DoctorProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctorprofile`
--

LOCK TABLES `doctorprofile` WRITE;
/*!40000 ALTER TABLE `doctorprofile` DISABLE KEYS */;
INSERT INTO `doctorprofile` VALUES (1,2,'Dr. Aisha Khan','Cardiology'),(2,5,'Dr. Meera Roy','Dermatology');
/*!40000 ALTER TABLE `doctorprofile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patientprofile`
--

DROP TABLE IF EXISTS `patientprofile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patientprofile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `medicalHistory` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PatientProfile_userId_key` (`userId`),
  CONSTRAINT `PatientProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientprofile`
--

LOCK TABLES `patientprofile` WRITE;
/*!40000 ALTER TABLE `patientprofile` DISABLE KEYS */;
INSERT INTO `patientprofile` VALUES (4,9,'Jack Smith',29,'M','No known chronic conditions'),(5,11,'Ling Lang',33,'','Hypertension. Currently managed with Lisinopril 10 mg daily. Allergy to Penicillin.');
/*!40000 ALTER TABLE `patientprofile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('PATIENT','DOCTOR','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin@medicare.pro','$2b$10$FmQJOUHcwkS1.h8p0xlN7usL2mEelQvJkbKLuw07s1nE6tnQbIe0S','ADMIN','2025-09-01 13:56:14.297'),(2,'doctor1@medicare.pro','$2b$10$mgFkFBY0JbZ/Jh2rXgOsOexOmJHXjTjyObAdYEF0BH7CSj.xXYPB2','DOCTOR','2025-09-01 13:56:14.533'),(5,'doc2@medicare.pro','$2b$10$n0em75jf08/XnFWoaoTx4Ol0sQWltBxRFxOurzJrlSr5jsxSeFhmy','DOCTOR','2025-09-01 17:13:57.819'),(9,'P2@medicare.pro','$2b$10$Jv.96R9cIGiJQTngcBdq9OlpZuNCma7oc1I.D5OPLlN8BHQcKUaC.','PATIENT','2025-09-16 18:50:52.824'),(11,'nice@medicare.pro','$2b$10$NhuealF9CrO3psAZ3h7LduJsf67uqJgflHqGX26APV0pDrxJCYyLe','PATIENT','2025-09-16 19:04:08.672');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-17 16:51:17
