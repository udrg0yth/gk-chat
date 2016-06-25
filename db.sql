-- MySQL dump 10.13  Distrib 5.7.12, for Win32 (AMD64)
--
-- Host: localhost    Database: chat_database
-- ------------------------------------------------------
-- Server version	5.7.12-log

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Geography'),(2,'History');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gk_questions`
--

LOCK TABLES `gk_questions` WRITE;
/*!40000 ALTER TABLE `gk_questions` DISABLE KEYS */;
INSERT INTO `gk_questions` VALUES (2,'Which African Country Is The Largest In Area?','Sudan','South Africa','Libya','Algeria',1),(3,'In Which Country Is Mount Ararat?','Armenia','Georgia','Azerbaijan','Turkey',1),(4,'What African City Has The Most Inhabitants?','Cairo','Johannesburg','Kinshasa','Lagos',1),(5,'On How Many Hills Was Rome Built?','Three','Six','Nine','Seven',1),(6,'What Was The Capital Of West Germany Before Berlin Was Reinstated?','Frankfurt','Munchen','Dortmund','Bonn',1),(7,'Of Which Country Is Kathmandu The Capital?','Afghanistan','Bhutan','Tajikistan','Nepal',1);
/*!40000 ALTER TABLE `gk_questions` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
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
  `username` varchar(32) NOT NULL,
  `password` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `birthdate` datetime NOT NULL,
  `account_status` varchar(16) NOT NULL,
  `credits` int(11) NOT NULL,
  `last_personality_question_id` int(11) NOT NULL,
  `current_personality` varchar(32) NOT NULL,
  `correct_easy_iq_questions` int(11) NOT NULL,
  `total_easy_iq_answers` int(11) NOT NULL,
  `correct_medium_iq_answers` int(11) NOT NULL,
  `total_medium_iq_answers` int(11) NOT NULL,
  `correct_hard_iq_answers` int(11) NOT NULL,
  `total_hard_iq_answers` int(11) NOT NULL,
  `correct_gk_answers` int(11) NOT NULL,
  `total_gk_answers` int(11) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
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

-- Dump completed on 2016-06-25 14:02:05
