-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: vacations
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Current Database: `vacations`
--

/*!40000 DROP DATABASE IF EXISTS `vacations`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `vacations` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `vacations`;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `userId` int NOT NULL,
  `vacationId` int NOT NULL,
  PRIMARY KEY (`userId`,`vacationId`),
  KEY `IX_likes_vacationId` (`vacationId`),
  CONSTRAINT `FK_likes_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_likes_vacations` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`vacationId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (2,1),(2,4),(3,4),(3,5),(2,7),(3,7),(2,8),(3,9),(2,11),(3,12),(2,14);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` char(128) NOT NULL,
  `roleId` tinyint NOT NULL DEFAULT '2',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `UQ_users_email` (`email`),
  CONSTRAINT `CK_users_role` CHECK ((`roleId` in (1,2)))
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','Istrator','admin@vacations.com','4eca7afcad12f0f1fc4eac9b25709805d8b39518cf50b3c2005d8cf55deae37bbdd5f9564a74a438fd91562c4ad57cfaf19c46ea76c6e6549e3d9c0e4196e154',1),(2,'John','Doe','john@vacations.com','bc2ddaa46701e1bfa3eb5f689817a62f04775eb6998ee2125ff0ddb9550454f1a1bbc3551c0d5d03fb5e08ccc25012837fbc6890fa425b314b117a380a7a4c89',2),(3,'Dana','Levi','dana@vacations.com','d7d6fe4ce5b752ac1f01be7a0489bd9db03113e86ed814300457e350fa77034c157f41eb2f258bb728fba5d79ceb35532c105271e3abde88ea15af4d538aa354',2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `vacationId` int NOT NULL AUTO_INCREMENT,
  `destination` varchar(100) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` decimal(7,2) NOT NULL,
  `imageName` varchar(255) NOT NULL,
  PRIMARY KEY (`vacationId`),
  KEY `IX_vacations_startDate` (`startDate`),
  CONSTRAINT `CK_vacations_dates` CHECK ((`endDate` >= `startDate`)),
  CONSTRAINT `CK_vacations_price` CHECK (((`price` >= 0) and (`price` <= 10000)))
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (1,'Rome, Italy','Walk the Colosseum, the Roman Forum and the Pantheon, then spend your evenings in Trastevere over cacio e pepe and a glass of Frascati. Includes a skip-the-line Vatican Museums pass.','2026-07-10','2026-07-17',1450.00,'8f8ef455-73fb-4eb0-9370-f687b89e06f9.jpg'),(2,'Prague, Czech Republic','A week in the city of a hundred spires. Cross the Charles Bridge at sunrise, tour Prague Castle, and explore the Jewish Quarter. Beer tasting evening in a 15th-century cellar included.','2026-08-05','2026-08-12',1120.00,'05408944-9ddb-4838-8be3-2fca550acd24.jpg'),(3,'Santorini, Greece','Whitewashed villages perched over a flooded volcanic caldera. Sunset in Oia, a catamaran cruise to the hot springs, and wine tasting at an Assyrtiko vineyard in Pyrgos.','2026-09-20','2026-09-27',1890.00,'88f2c59a-641c-445d-9f58-33ca97b7d863.jpg'),(4,'Barcelona, Spain','Gaudi at every turn: Sagrada Familia, Park Guell and Casa Batllo. Balance it out with tapas in El Born, a morning at Barceloneta beach and a day trip to Montserrat.','2026-09-28','2026-10-08',1640.00,'37b37000-8431-4cf6-8898-05405ab284b3.jpg'),(5,'Zermatt, Switzerland','Alpine hiking under the Matterhorn. Ride the Gornergrat railway, cross the suspension bridges of the Europaweg, and unwind in a car-free village of timber chalets.','2026-10-01','2026-10-12',2450.00,'d48b306b-11df-4714-a400-9ac1ce1ae612.jpg'),(6,'Amsterdam, Netherlands','Canal-side living in the Jordaan. Timed entry to the Rijksmuseum and the Anne Frank House, a day of cycling through Vondelpark, and a boat tour of the Grachtengordel.','2026-10-02','2026-10-09',1380.00,'3aca4c95-b8ad-4deb-b02f-effd5bd3fea3.jpg'),(7,'Kyoto, Japan','Autumn colours in the old capital. Fushimi Inari at dawn, the Arashiyama bamboo grove, a tea ceremony in Gion and two nights in a traditional ryokan with an onsen bath.','2026-11-08','2026-11-18',3200.00,'ce6568c6-50f4-414f-8749-9ed4c9739b21.jpg'),(8,'Reykjavik, Iceland','Northern lights season. Chase the aurora away from city light, drive the Golden Circle to Gullfoss and Geysir, soak in the Blue Lagoon and walk a glacier on Solheimajokull.','2026-11-22','2026-11-29',2780.00,'d71793ae-bd5d-4630-a6f3-35b883b92799.jpg'),(9,'Lisbon, Portugal','Tram 28 through Alfama, pasteis de nata straight from the oven in Belem, and a fado evening in a tiny tiled tavern. Includes a day trip to the palaces of Sintra.','2026-12-03','2026-12-10',1290.00,'19795ad1-525f-4e60-91cc-a7d163c478e9.jpg'),(10,'Marrakesh, Morocco','The souks of the medina, the Jardin Majorelle and Bahia Palace, mint tea on a rooftop above Jemaa el-Fnaa. Finishes with two nights in a desert camp in the Agafay.','2026-12-14','2026-12-22',1560.00,'ec15e5ad-1460-4689-b206-eee53f82c2a8.jpg'),(11,'Vienna, Austria','Christmas market season. Schonbrunn Palace, the Kunsthistorisches Museum, a classical concert in the Musikverein, and Sachertorte in a proper Viennese coffee house.','2026-12-18','2026-12-25',1720.00,'5a73e602-917e-4fdd-ac78-7ab233bb92b2.jpg'),(12,'Bangkok, Thailand','Grand Palace and Wat Pho at opening time, longtail boats through the Thonburi canals, and street food in Chinatown. Includes a day trip to the Ayutthaya ruins.','2027-01-10','2027-01-21',2150.00,'9a640f98-dacc-46e2-909f-c682153579ac.jpg'),(13,'Cape Town, South Africa','Cable car up Table Mountain, penguins at Boulders Beach, and the drive around Chapman\'s Peak to the Cape of Good Hope. Two days of wine tasting in Stellenbosch.','2027-02-06','2027-02-17',3450.00,'4683300f-45d2-4ad6-a34b-7bfef930ebc3.jpg'),(14,'Edinburgh, Scotland','The Royal Mile from the castle down to Holyrood, a climb up Arthur\'s Seat for the view, the vaults of the Old Town by lamplight, and a Speyside whisky tasting.','2027-03-20','2027-03-28',1480.00,'0d33c9dd-6ffa-48f9-a2a8-121085689f0a.jpg');
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-03  9:09:43
