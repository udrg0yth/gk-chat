-- MySQL dump 10.13  Distrib 5.7.10, for Win64 (x86_64)
--
-- Host: localhost    Database: chat_database
-- ------------------------------------------------------
-- Server version	5.7.10-log

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
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(64) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Geography'),(2,'History'),(3,'Art'),(4,'Literature'),(5,'Music'),(6,'Mathematics'),(7,'Botanics'),(8,'Physics'),(9,'Zoology'),(10,'Astronomy'),(11,'Philosophy'),(12,'Mythology'),(13,'Medicine'),(14,'Chemistry'),(15,'Society'),(16,'Economy'),(17,'Politics'),(18,'Computing'),(19,'Transport'),(20,'Religion');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gk_question_user`
--

DROP TABLE IF EXISTS `gk_question_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gk_question_user` (
  `gk_question_user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `gk_question_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`gk_question_user_id`),
  KEY `user_id` (`user_id`),
  KEY `gk_question_id` (`gk_question_id`),
  CONSTRAINT `gk_question_user_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `gk_question_user_ibfk_2` FOREIGN KEY (`gk_question_id`) REFERENCES `gk_questions` (`gk_question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gk_question_user`
--

LOCK TABLES `gk_question_user` WRITE;
/*!40000 ALTER TABLE `gk_question_user` DISABLE KEYS */;
INSERT INTO `gk_question_user` VALUES (2,9,14,'2016-07-19 12:03:12'),(3,9,4,'2016-07-19 12:06:13'),(4,9,13,'2016-07-19 12:06:32'),(5,9,31,'2016-07-19 12:06:46'),(6,9,31,'2016-07-19 12:07:04'),(7,9,24,'2016-07-19 12:07:08'),(8,9,5,'2016-07-19 12:07:10'),(9,9,8,'2016-07-19 12:07:13'),(10,9,30,'2016-07-19 12:07:16'),(11,9,16,'2016-07-19 12:08:14'),(12,9,18,'2016-07-19 12:18:42'),(13,9,4,'2016-07-19 12:19:25'),(14,9,10,'2016-07-22 09:01:19'),(15,9,5,'2016-07-22 09:01:27'),(16,9,17,'2016-07-22 09:01:33'),(17,9,8,'2016-07-22 09:01:38'),(18,9,12,'2016-07-22 09:02:10'),(19,9,24,'2016-07-22 09:02:47'),(20,9,9,'2016-07-22 09:02:55'),(21,9,27,'2016-07-22 09:07:18'),(22,9,12,'2016-07-22 09:07:22'),(23,9,28,'2016-07-22 09:07:26');
/*!40000 ALTER TABLE `gk_question_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gk_questions`
--

DROP TABLE IF EXISTS `gk_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gk_questions` (
  `gk_question_id` int(11) NOT NULL AUTO_INCREMENT,
  `gk_question` text NOT NULL,
  `gk_answer1` text NOT NULL,
  `gk_answer2` text NOT NULL,
  `gk_answer3` text NOT NULL,
  `gk_answer4` text NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`gk_question_id`),
  KEY `fk_category` (`category_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gk_questions`
--

LOCK TABLES `gk_questions` WRITE;
/*!40000 ALTER TABLE `gk_questions` DISABLE KEYS */;
INSERT INTO `gk_questions` VALUES (2,'Which African Country Is The Largest In Area?','Sudan','South Africa','Libya','Algeria',1),(3,'In Which Country Is Mount Ararat?','Armenia','Georgia','Azerbaijan','Turkey',1),(4,'What African City Has The Most Inhabitants?','Cairo','Johannesburg','Kinshasa','Lagos',1),(5,'On How Many Hills Was Rome Built?','Three','Six','Nine','Seven',1),(6,'What Was The Capital Of West Germany Before Berlin Was Reinstated?','Frankfurt','Munchen','Dortmund','Bonn',1),(7,'Of Which Country Is Kathmandu The Capital?','Afghanistan','Bhutan','Tajikistan','Nepal',1),(8,'Composer George Gershwin died in1937 at the age of 38. How did he die?','Lung tumor','Murdered','Heart attack','Brain tumor',2),(9,'What type of natural disaster hit the American Midwest in 1935?','Tornado','Cyclone','Earthquake','Dust storm',2),(10,'On what river was the Angient Egypt concentrated along?','Zambezi','Niger','Congo','Nile',2),(11,'Who was the first pharaoh?','Djet','Hor-Aha','Djer','Narmer',2),(12,'How long is the nile (km)?','5995','8512','6212','6853',1),(13,'What precedes the Iron Age?','Tin age','Stone age','Chalcolithic','Bronze age',2),(14,'What was it that allowed for the transition from the Paleolithic Age to the Neolithic Age?','Industrial Revolution','American Revolution','War','Agricultural Revolution',2),(15,'What two (2) beings roamed the earth at the same time as homo sapiens?','Homo habilius and Homo erectus','Homo sapiens sapiens and Homo erectus','Cro-Magnons and Homo sapiens','Cro-Magnons and Neanderthals',2),(16,'What are modern humans called?','Homo erectus','Homo sapiens','Cro-Magnon','Homo sapiens sapiens',2),(17,'When did emperor Constantine I consacrate the Church of the Holy Sepulchre in Jerusalem?','265','65','401','335',2),(18,'Who was banished to Trier, on charge that he prevented the corn fleet from sailing to Constantinople?','Julius II','Constantine I','Flavius Dalmatius','Athanasius',2),(19,'What is Anatolia also known as?','Asia major','Armenia','Anatolian island','Asia minor',1),(20,'When did Constantinople fall to the Ottoman empire?','1493','1345','1435','1453',2),(21,'When was Abraham Lincoln assassinated?','1834','1901','1852','1865',2),(22,'In what year was John F. Kennedy assassinated?','1936','1954','1967','1963',2),(23,'In what year did the Berlin wall fall?','1998','1961','1989','1991',2),(24,'What\'s the capital of United Arab Emirates?','Riyadh','Sana\'a','Muscat','Abu Dhabi',1),(25,'What\'s the capital of Saudi Arabia?','Abu Dhabi','Sana\'a','Muscat','Riyadh',1),(26,'What\'s the capital of Yemen?','Abu Dhabi','Riyadh','Muscat','Sana\'a',1),(27,'What\'s the capital of Oman?','Abu Dhabi','Riyadh','Sana\'a','Muscat',1),(28,'What\'s the capital of Spain?','Lisbon','Rome','Velletta','Madrid',1),(29,'What\'s the capital of Italy?','Lisbon','Madrid','Velletta','Rome',1),(30,'What\'s the capital of Portugal?','Rome','Madrid','Velletta','Lisbon',1),(31,'What\'s the capital of Malta?','Rome','Madrid','Lisbon','Velletta',1),(32,'What\'s the capital of Switzerland?','Lucerne','Geneva','Zurich','Bern',1),(33,'What\'s the capital of Norway?','Tallinn','Helsinki','Stockholm','Oslo',1),(34,'What\'s the capital of Sweden?','Tallinn','Helsinki','Oslo','Stockholm',1),(35,'What\'s the capital of Finland?','Tallinn','Stockholm','Oslo','Helsinki',1),(36,'What\'s the capital of Estonia?','Helsinki','Stockholm','Oslo','Tallinn',1);
/*!40000 ALTER TABLE `gk_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iq_links`
--

DROP TABLE IF EXISTS `iq_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `iq_links` (
  `iq_links_id` int(11) NOT NULL AUTO_INCREMENT,
  `link` text NOT NULL,
  PRIMARY KEY (`iq_links_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iq_links`
--

LOCK TABLES `iq_links` WRITE;
/*!40000 ALTER TABLE `iq_links` DISABLE KEYS */;
INSERT INTO `iq_links` VALUES (3,'http://localhost:9001/0.jpg'),(4,'http://localhost:9001/1.jpg'),(5,'http://localhost:9001/2.jpg'),(6,'http://localhost:9001/3.jpg'),(7,'http://localhost:9001/4.jpg'),(8,'http://localhost:9001/5.jpg'),(9,'http://localhost:9001/6.jpg'),(10,'http://localhost:9001/puzzle.jpg');
/*!40000 ALTER TABLE `iq_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iq_question_user`
--

DROP TABLE IF EXISTS `iq_question_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `iq_question_user` (
  `iq_question_user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `iq_question_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`iq_question_user_id`),
  KEY `fk_user` (`user_id`),
  KEY `fk_question` (`iq_question_id`),
  CONSTRAINT `fk_question` FOREIGN KEY (`iq_question_id`) REFERENCES `iq_questions` (`iq_question_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iq_question_user`
--

LOCK TABLES `iq_question_user` WRITE;
/*!40000 ALTER TABLE `iq_question_user` DISABLE KEYS */;
INSERT INTO `iq_question_user` VALUES (55,10,1,'2016-08-04 14:22:07');
/*!40000 ALTER TABLE `iq_question_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iq_questions`
--

DROP TABLE IF EXISTS `iq_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `iq_questions` (
  `iq_question_id` int(11) NOT NULL AUTO_INCREMENT,
  `iq_question` int(11) NOT NULL,
  `iq_answer1` int(11) NOT NULL,
  `iq_answer2` int(11) NOT NULL,
  `iq_answer3` int(11) NOT NULL,
  `iq_answer4` int(11) NOT NULL,
  `iq_answer5` int(11) NOT NULL,
  `iq_answer6` int(11) NOT NULL,
  `iq_correct_answer` int(11) DEFAULT NULL,
  `difficulty` tinyint(4) NOT NULL,
  PRIMARY KEY (`iq_question_id`),
  KEY `iq_answer1` (`iq_answer1`),
  KEY `iq_answer2` (`iq_answer2`),
  KEY `iq_answer3` (`iq_answer3`),
  KEY `iq_answer4` (`iq_answer4`),
  KEY `iq_answer5` (`iq_answer5`),
  KEY `iq_answer6` (`iq_answer6`),
  KEY `iq_correct_answer` (`iq_correct_answer`),
  CONSTRAINT `iq_questions_ibfk_1` FOREIGN KEY (`iq_answer1`) REFERENCES `iq_links` (`iq_links_id`),
  CONSTRAINT `iq_questions_ibfk_2` FOREIGN KEY (`iq_answer2`) REFERENCES `iq_links` (`iq_links_id`),
  CONSTRAINT `iq_questions_ibfk_3` FOREIGN KEY (`iq_answer3`) REFERENCES `iq_links` (`iq_links_id`),
  CONSTRAINT `iq_questions_ibfk_4` FOREIGN KEY (`iq_answer4`) REFERENCES `iq_links` (`iq_links_id`),
  CONSTRAINT `iq_questions_ibfk_5` FOREIGN KEY (`iq_answer5`) REFERENCES `iq_links` (`iq_links_id`),
  CONSTRAINT `iq_questions_ibfk_6` FOREIGN KEY (`iq_answer6`) REFERENCES `iq_links` (`iq_links_id`),
  CONSTRAINT `iq_questions_ibfk_7` FOREIGN KEY (`iq_correct_answer`) REFERENCES `iq_links` (`iq_links_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iq_questions`
--

LOCK TABLES `iq_questions` WRITE;
/*!40000 ALTER TABLE `iq_questions` DISABLE KEYS */;
INSERT INTO `iq_questions` VALUES (1,10,3,4,5,6,7,8,3,0);
/*!40000 ALTER TABLE `iq_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personality_questions`
--

DROP TABLE IF EXISTS `personality_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personality_questions` (
  `personality_question_id` int(11) NOT NULL AUTO_INCREMENT,
  `personality_question` text NOT NULL,
  `negatively_affected_type` int(11) NOT NULL,
  PRIMARY KEY (`personality_question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personality_questions`
--

LOCK TABLES `personality_questions` WRITE;
/*!40000 ALTER TABLE `personality_questions` DISABLE KEYS */;
INSERT INTO `personality_questions` VALUES (1,'You like working alone rather than with others.',0),(2,'You prefer communicating by email rather than talking on the phone.',0),(3,'You dislike being interrupted during lengthy work periods.',0),(4,'You reflect before taking an action rather than quickly act.',0),(5,'You tend to focus in-depth on one thing and you\'re not very good at multitasking.',0),(6,'You usually attend to your own insights rather than to reality.',1),(7,'You prefer doing things in a new way rather than in a proven way.',1),(8,'You present an overview without much detail.',1),(9,'You look for meaning in facts rather than accuracy of facts.',1),(10,'When looking for an answer you focus on different possibilities rather than past experiences.',1),(11,'You adapt to different situations by analysing them objectively rather than using your personal experience.',2),(12,'You criticize and focus on the flaws rather than notice and appreciate what is positive.',2),(13,'You focus on tasks rather than people.',2),(14,'You use logic to make decisions rather than empathy/personal values.',2),(15,'You tend to set criteria and standards rather than adjusting to individual differences and needs.',2),(16,'When scheduling your tasks, you use your \'inner timing\' rather than working with time frames and deadlines.',3),(17,'You prefer having to deal with surprises rather than being required to plan ahead.',3),(18,'You develop contingency plans rather than staying open to reevaluation of tasks.',3),(19,'You like being on time.',3);
/*!40000 ALTER TABLE `personality_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) DEFAULT NULL,
  `password` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `birthdate` datetime DEFAULT NULL,
  `account_status` varchar(16) NOT NULL,
  `credits` int(11) NOT NULL,
  `total_easy_iq_answers` int(11) NOT NULL,
  `correct_medium_iq_answers` int(11) NOT NULL,
  `total_medium_iq_answers` int(11) NOT NULL,
  `correct_hard_iq_answers` int(11) NOT NULL,
  `total_hard_iq_answers` int(11) NOT NULL,
  `correct_gk_answers` int(11) NOT NULL,
  `total_gk_answers` int(11) NOT NULL,
  `gender` tinyint(4) DEFAULT NULL,
  `correct_easy_iq_answers` int(11) NOT NULL,
  `current_iq_score` int(11) NOT NULL,
  `current_gk_score` decimal(10,2) NOT NULL,
  `current_personality_question_id` int(11) NOT NULL,
  `current_personality` varchar(4) NOT NULL,
  `current_personality_raw` varchar(20) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `current_personality_question_id` (`current_personality_question_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`current_personality_question_id`) REFERENCES `personality_questions` (`personality_question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (9,'vlad','sha1$6cba172d$1$75d7e2b98ec5af643a192ab60a0fb62e48e070f9','vladradu97150@hotmail.com','2011-11-01 00:00:00','ACTIVE',150,0,0,0,0,0,0,37,0,0,0,0.00,2,'ISFJ','-20.0.0.0'),(10,NULL,'sha1$0b1d4128$1$dec06a20aa2b96e5ff4bc98d38a7272dd9956ce2','silver_iii_bullet@yahoo.com',NULL,'ACTIVE',150,0,0,0,0,0,0,0,NULL,0,0,0.00,1,'ESFJ','0.0.0.0'),(11,NULL,'sha1$239b6ebe$1$23f25d87b37b8096035b75bff137b9d94ab3d2df','m9.arsenie.toderas@gmail.com',NULL,'ACTIVE',150,0,0,0,0,0,0,0,NULL,0,0,0.00,1,'ESFJ','0.0.0.0');
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

-- Dump completed on 2016-08-04 19:19:30
