CREATE DATABASE  IF NOT EXISTS `mathapp`;
USE `mathapp`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mathapp
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `alternativa`
--

DROP TABLE IF EXISTS `alternativa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alternativa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `questao_id` int DEFAULT NULL,
  `texto` text NOT NULL,
  `letra` char(1) NOT NULL,
  `correta` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `questao_id` (`questao_id`),
  CONSTRAINT `alternativa_ibfk_1` FOREIGN KEY (`questao_id`) REFERENCES `questao` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=909 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alternativa`
--

LOCK TABLES `alternativa` WRITE;
/*!40000 ALTER TABLE `alternativa` DISABLE KEYS */;
INSERT INTO `alternativa` VALUES (1,1,'105','A',0),(2,1,'35','B',1),(3,1,'42','C',0),(4,1,'21','D',0),(5,1,'210','E',0),(8,2,'720','A',0),(9,2,'30','B',0),(10,2,'60','C',1),(11,2,'120','D',0),(12,2,'180','E',0),(15,3,'120','A',1),(16,3,'24','B',0),(17,3,'60','C',0),(18,3,'360','D',0),(19,3,'720','E',0),(22,4,'72','A',0),(23,4,'56','B',1),(24,4,'28','C',0),(25,4,'64','D',0),(26,4,'16','E',0),(29,5,'48','A',0),(30,5,'24','B',0),(31,5,'36','C',0),(32,5,'120','D',0),(33,5,'60','E',1),(36,6,'21','A',0),(37,6,'49','B',0),(38,6,'42','C',0),(39,6,'35','D',1),(40,6,'28','E',0),(43,7,'60','A',0),(44,7,'20','B',0),(45,7,'160','C',0),(46,7,'80','D',1),(47,7,'40','E',0),(50,8,'80','A',0),(51,8,'160','B',1),(52,8,'40','C',0),(53,8,'320','D',0),(54,8,'20','E',0),(57,9,'−32','A',1),(58,9,'−8','B',0),(59,9,'32','C',0),(60,9,'16','D',0),(61,9,'−16','E',0),(64,10,'729','A',0),(65,10,'64','B',0),(66,10,'−1','C',0),(67,10,'0','D',0),(68,10,'1','E',1),(71,11,'(3, −2)','A',1),(72,11,'(−3, 2)','B',0),(73,11,'(3, 2)','C',0),(74,11,'(0, 0)','D',0),(75,11,'(−3, −2)','E',0),(78,12,'(−5, 0) e (5, 0)','A',0),(79,12,'(−2, 0) e (2, 0)','B',0),(80,12,'(−4, 0) e (4, 0)','C',1),(81,12,'(0, −4) e (0, 4)','D',0),(82,12,'(−3, 0) e (3, 0)','E',0),(85,13,'(6, 0)','A',0),(86,13,'(0, 3)','B',0),(87,13,'(−3, 0)','C',0),(88,13,'(12, 0)','D',0),(89,13,'(3, 0)','E',1),(92,14,'y = ±3x','A',0),(93,14,'y = ±4x/3','B',0),(94,14,'y = ±9x/16','C',0),(95,14,'y = ±x/4','D',0),(96,14,'y = ±3x/4','E',1),(99,15,'12','A',1),(100,15,'36','B',0),(101,15,'6','C',0),(102,15,'4','D',0),(103,15,'8','E',0),(106,16,'26','A',1),(107,16,'33','B',0),(108,16,'40','C',0),(109,16,'19','D',0),(110,16,'23','E',0),(113,17,'{1, 3}','A',1),(114,17,'{1, 3, 6}','B',0),(115,17,'{2, 4}','C',0),(116,17,'{6}','D',0),(117,17,'{1, 2, 3, 4}','E',0),(120,18,'25','A',0),(121,18,'10','B',0),(122,18,'64','C',0),(123,18,'16','D',0),(124,18,'32','E',1),(127,19,'8','A',0),(128,19,'11','B',0),(129,19,'9','C',1),(130,19,'7','D',0),(131,19,'1','E',0),(134,20,'24','A',0),(135,20,'12','B',1),(136,20,'16','C',0),(137,20,'9','D',0),(138,20,'7','E',0),(141,21,'24','A',0),(142,21,'20','B',0),(143,21,'26','C',0),(144,21,'10','D',0),(145,21,'14','E',1),(148,22,'−15','A',0),(149,22,'−30','B',1),(150,22,'0','C',0),(151,22,'30','D',0),(152,22,'10','E',0),(155,23,'−7','A',1),(156,23,'14','B',0),(157,23,'7','C',0),(158,23,'0','D',0),(159,23,'49','E',0),(162,24,'27','A',0),(163,24,'6','B',0),(164,24,'18','C',0),(165,24,'54','D',1),(166,24,'81','E',0),(169,25,'6','A',0),(170,25,'2','B',1),(171,25,'1','C',0),(172,25,'4','D',0),(173,25,'3','E',0),(176,26,'6','A',1),(177,26,'−6','B',0),(178,26,'1','C',0),(179,26,'−11','D',0),(180,26,'11','E',0),(183,27,'−2','A',0),(184,27,'−8','B',0),(185,27,'−4','C',1),(186,27,'4','D',0),(187,27,'8','E',0),(190,28,'5','A',0),(191,28,'2','B',0),(192,28,'3','C',1),(193,28,'4','D',0),(194,28,'1','E',0),(197,29,'3','A',1),(198,29,'2','B',0),(199,29,'4','C',0),(200,29,'5','D',0),(201,29,'1','E',0),(204,30,'2','A',1),(205,30,'1','B',0),(206,30,'4','C',0),(207,30,'3','D',0),(208,30,'0','E',0),(211,31,'6,5','A',0),(212,31,'6','B',0),(213,31,'7','C',1),(214,31,'7,5','D',0),(215,31,'8','E',0),(218,32,'5','A',0),(219,32,'3','B',0),(220,32,'7','C',0),(221,32,'9','D',0),(222,32,'6','E',1),(225,33,'6','A',1),(226,33,'7','B',0),(227,33,'2','C',0),(228,33,'5','D',0),(229,33,'4','E',0),(232,34,'6,2','A',1),(233,34,'7','B',0),(234,34,'6,5','C',0),(235,34,'5,8','D',0),(236,34,'6','E',0),(239,35,'6','A',0),(240,35,'10','B',0),(241,35,'9','C',0),(242,35,'12','D',1),(243,35,'13','E',0),(246,36,'6','A',0),(247,36,'3','B',0),(248,36,'−4','C',0),(249,36,'12','D',0),(250,36,'4','E',1),(253,37,'6','A',0),(254,37,'4','B',0),(255,37,'3','C',1),(256,37,'2','D',0),(257,37,'5','E',0),(260,38,'R$ 20,00','A',0),(261,38,'R$ 25,50','B',0),(262,38,'R$ 27,00','C',1),(263,38,'R$ 30,00','D',0),(264,38,'R$ 23,50','E',0),(267,39,'(0, 6)','A',1),(268,39,'(6, 0)','B',0),(269,39,'(3, 0)','C',0),(270,39,'(0, −2)','D',0),(271,39,'(−2, 0)','E',0),(274,40,'3','A',0),(275,40,'−3','B',1),(276,40,'−1','C',0),(277,40,'−5','D',0),(278,40,'13','E',0),(281,41,'5','A',0),(282,41,'2','B',0),(283,41,'3','C',0),(284,41,'4','D',1),(285,41,'6','E',0),(288,42,'900','A',0),(289,42,'4800','B',0),(290,42,'2400','C',1),(291,42,'600','D',0),(292,42,'1200','E',0),(295,43,'80 g','A',0),(296,43,'40 g','B',0),(297,43,'10 g','C',0),(298,43,'20 g','D',1),(299,43,'30 g','E',0),(302,44,'1/2','A',0),(303,44,'3/2','B',1),(304,44,'2/3','C',0),(305,44,'2','D',0),(306,44,'3','E',0),(309,45,'(0, +∞)','A',0),(310,45,'[3, +∞)','B',0),(311,45,'(3, +∞)','C',1),(312,45,'Todos os reais','D',0),(313,45,'(−∞, 3)','E',0),(316,46,'7','A',0),(317,46,'8','B',0),(318,46,'4','C',1),(319,46,'2','D',0),(320,46,'−4','E',0),(323,47,'2 e 3','A',1),(324,47,'1 e 6','B',0),(325,47,'−2 e −3','C',0),(326,47,'0 e 5','D',0),(327,47,'−1 e −6','E',0),(330,48,'5','A',0),(331,48,'0','B',0),(332,48,'3','C',0),(333,48,'−5','D',0),(334,48,'4','E',1),(337,49,'1','A',0),(338,49,'4','B',0),(339,49,'3','C',0),(340,49,'0','D',1),(341,49,'2','E',0),(344,50,'2 s','A',0),(345,50,'1 s','B',0),(346,50,'5 s','C',0),(347,50,'3 s','D',0),(348,50,'4 s','E',1),(351,51,'Todos os reais','A',0),(352,51,'[0, +∞)','B',0),(353,51,'[2, +∞)','C',1),(354,51,'(−∞, 2]','D',0),(355,51,'(2, +∞)','E',0),(358,52,'10','A',0),(359,52,'18','B',0),(360,52,'7','C',0),(361,52,'49','D',0),(362,52,'19','E',1),(365,53,'9','A',0),(366,53,'15','B',0),(367,53,'3','C',0),(368,53,'1','D',0),(369,53,'5','E',1),(372,54,'f(x) = abs(x)','A',0),(373,54,'f(x) = x⁴','B',0),(374,54,'f(x) = 7','C',0),(375,54,'f(x) = x²','D',0),(376,54,'f(x) = 2x − 3','E',1),(379,55,'{b, c}','A',0),(380,55,'{a, b}','B',1),(381,55,'{a}','C',0),(382,55,'{1, 2, 3}','D',0),(383,55,'{a, b, c}','E',0),(386,56,'7','A',0),(387,56,'3','B',0),(388,56,'5','C',1),(389,56,'4','D',0),(390,56,'6','E',0),(393,57,'(−2, 2)','A',0),(394,57,'(2, 2)','B',1),(395,57,'(4, 4)','C',0),(396,57,'(2, 3)','D',0),(397,57,'(4, 2)','E',0),(400,58,'2','A',1),(401,58,'8','B',0),(402,58,'4','C',0),(403,58,'1','D',0),(404,58,'1/2','E',0),(407,59,'y = x/2 + 2','A',0),(408,59,'y = −2x + 7','B',0),(409,59,'y = 2x − 1','C',0),(410,59,'y = −x/2 + 3','D',0),(411,59,'y = −x/2 + 4','E',1),(414,60,'(1, 5)','A',0),(415,60,'(3, 4)','B',1),(416,60,'(4, 4)','C',0),(417,60,'(0, 4)','D',0),(418,60,'(2, 4)','E',0),(421,61,'Coincidentes','A',0),(422,61,'Reversas','B',1),(423,61,'Perpendiculares','C',0),(424,61,'Paralelas','D',0),(425,61,'Concorrentes','E',0),(428,62,'Um único ponto','A',0),(429,62,'O conjunto vazio','B',0),(430,62,'Um segmento','C',0),(431,62,'Uma reta','D',1),(432,62,'Todo o espaço','E',0),(435,63,'Infinitos','A',0),(436,63,'Três','B',0),(437,63,'Um','C',1),(438,63,'Dois','D',0),(439,63,'Nenhum','E',0),(442,64,'Perpendicular','A',1),(443,64,'Paralela','B',0),(444,64,'Reversa','C',0),(445,64,'Secante oblíqua','D',0),(446,64,'Contida','E',0),(449,65,'Concorrentes','A',0),(450,65,'Reversas','B',0),(451,65,'Paralelas','C',1),(452,65,'Perpendiculares','D',0),(453,65,'Coincidentes','E',0),(456,66,'15π cm³','A',0),(457,66,'30π cm³','B',0),(458,66,'135π cm³','C',0),(459,66,'90π cm³','D',0),(460,66,'45π cm³','E',1),(463,67,'16 cm²','A',0),(464,67,'64 cm²','B',0),(465,67,'48 cm²','C',0),(466,67,'96 cm²','D',1),(467,67,'128 cm²','E',0),(470,68,'270 cm³','A',0),(471,68,'60 cm³','B',0),(472,68,'180 cm³','C',0),(473,68,'90 cm³','D',1),(474,68,'30 cm³','E',0),(477,69,'108π cm³','A',0),(478,69,'27π cm³','B',0),(479,69,'12π cm³','C',0),(480,69,'36π cm³','D',1),(481,69,'9π cm³','E',0),(484,70,'6 cm','A',0),(485,70,'7 cm','B',1),(486,70,'5 cm','C',0),(487,70,'11 cm','D',0),(488,70,'√35 cm','E',0),(491,71,'19 cm²','A',0),(492,71,'84 cm²','B',0),(493,71,'24 cm²','C',0),(494,71,'48 cm²','D',0),(495,71,'42 cm²','E',1),(498,72,'1080°','A',0),(499,72,'540°','B',0),(500,72,'900°','C',0),(501,72,'360°','D',0),(502,72,'720°','E',1),(505,73,'32π cm','A',0),(506,73,'4π cm','B',0),(507,73,'16π cm','C',0),(508,73,'12π cm','D',0),(509,73,'8π cm','E',1),(512,74,'44 cm²','A',0),(513,74,'55 cm²','B',1),(514,74,'70 cm²','C',0),(515,74,'110 cm²','D',0),(516,74,'30 cm²','E',0),(519,75,'16 cm','A',0),(520,75,'18 cm','B',0),(521,75,'15 cm','C',1),(522,75,'21 cm','D',0),(523,75,'13 cm','E',0),(526,76,'4','A',0),(527,76,'6','B',0),(528,76,'16','C',0),(529,76,'5','D',1),(530,76,'8','E',0),(533,77,'27','A',0),(534,77,'64','B',0),(535,77,'12','C',0),(536,77,'7','D',0),(537,77,'81','E',1),(540,78,'2','A',0),(541,78,'12','B',0),(542,78,'3','C',0),(543,78,'5','D',1),(544,78,'6','E',0),(547,79,'0','A',0),(548,79,'−1','B',0),(549,79,'−5','C',0),(550,79,'−2','D',1),(551,79,'2','E',0),(554,80,'10','A',0),(555,80,'8','B',0),(556,80,'4','C',0),(557,80,'9','D',1),(558,80,'7','E',0),(561,81,'7/12','A',0),(562,81,'2/3','B',0),(563,81,'11/12','C',1),(564,81,'5/6','D',0),(565,81,'4/10','E',0),(568,82,'30','A',0),(569,82,'48','B',0),(570,82,'36','C',1),(571,82,'24','D',0),(572,82,'40','E',0),(575,83,'R$ 52,00','A',0),(576,83,'R$ 42,00','B',0),(577,83,'R$ 56,00','C',0),(578,83,'R$ 49,00','D',1),(579,83,'R$ 35,00','E',0),(582,84,'450 g','A',0),(583,84,'750 g','B',1),(584,84,'800 g','C',0),(585,84,'600 g','D',0),(586,84,'900 g','E',0),(589,85,'24','A',0),(590,85,'36','B',1),(591,85,'72','C',0),(592,85,'6','D',0),(593,85,'48','E',0),(596,86,'R$ 1500,00','A',0),(597,86,'R$ 1020,00','B',0),(598,86,'R$ 1200,00','C',0),(599,86,'R$ 1100,00','D',1),(600,86,'R$ 1050,00','E',0),(603,87,'R$ 2200,00','A',0),(604,87,'R$ 2600,00','B',0),(605,87,'R$ 2400,00','C',0),(606,87,'R$ 2440,00','D',0),(607,87,'R$ 2420,00','E',1),(610,88,'R$ 225,00','A',0),(611,88,'R$ 238,00','B',0),(612,88,'R$ 230,00','C',0),(613,88,'R$ 220,00','D',1),(614,88,'R$ 212,00','E',0),(617,89,'R$ 96,00','A',1),(618,89,'R$ 104,00','B',0),(619,89,'R$ 80,00','C',0),(620,89,'R$ 120,00','D',0),(621,89,'R$ 100,00','E',0),(624,90,'15,00%','A',0),(625,90,'2,50%','B',0),(626,90,'9,52%','C',0),(627,90,'4,76%','D',1),(628,90,'5,00%','E',0),(631,91,'5 × 2','A',1),(632,91,'2 × 5','B',0),(633,91,'2 × 2','C',0),(634,91,'5 × 5','D',0),(635,91,'7 × 7','E',0),(638,92,'2 × 2','A',0),(639,92,'4 × 4','B',0),(640,92,'4 × 3','C',0),(641,92,'2 × 3','D',0),(642,92,'3 × 4','E',1),(645,93,'0','A',0),(646,93,'3','B',0),(647,93,'2','C',1),(648,93,'1','D',0),(649,93,'4','E',0),(652,94,'22','A',1),(653,94,'10','B',0),(654,94,'25','C',0),(655,94,'16','D',0),(656,94,'19','E',0),(659,95,'0','A',0),(660,95,'1','B',0),(661,95,'3','C',1),(662,95,'6','D',0),(663,95,'9','E',0),(666,96,'12','A',1),(667,96,'2','B',0),(668,96,'7','C',0),(669,96,'−12','D',0),(670,96,'−2','E',0),(673,97,'3 e 4','A',0),(674,97,'1 e 7','B',1),(675,97,'−7 e −1','C',0),(676,97,'4 e 7','D',0),(677,97,'−3 e 3','E',0),(680,98,'[−5, 5]','A',0),(681,98,'(0, 5)','B',0),(682,98,'(−5, 5)','C',1),(683,98,'(5, +∞)','D',0),(684,98,'(−∞, 5)','E',0),(687,99,'−1','A',0),(688,99,'1/2','B',0),(689,99,'−1/2','C',1),(690,99,'0','D',0),(691,99,'−2','E',0),(694,100,'x ≥ −6','A',0),(695,100,'x ≤ −6 ou x ≥ 2','B',1),(696,100,'x ≤ 2','C',0),(697,100,'x ≤ −2 ou x ≥ 6','D',0),(698,100,'−6 ≤ x ≤ 2','E',0),(701,101,'2 + 2i','A',0),(702,101,'8 + 2i','B',0),(703,101,'6 + 2i','C',1),(704,101,'6 + 4i','D',0),(705,101,'6 − 2i','E',0),(708,102,'3 + 5i','A',0),(709,102,'5 + 7i','B',0),(710,102,'5 + 5i','C',1),(711,102,'5 − 5i','D',0),(712,102,'1 + 5i','E',0),(715,103,'12','A',0),(716,103,'13','B',1),(717,103,'7','C',0),(718,103,'169','D',0),(719,103,'17','E',0),(722,104,'0','A',0),(723,104,'i','B',0),(724,104,'−1','C',0),(725,104,'1','D',0),(726,104,'−i','E',1),(729,105,'−4','A',1),(730,105,'0','B',0),(731,105,'4','C',0),(732,105,'4i','D',0),(733,105,'−4i','E',0),(736,106,'1','A',0),(737,106,'12','B',0),(738,106,'4','C',0),(739,106,'7','D',1),(740,106,'16','E',0),(743,107,'9','A',1),(744,107,'3','B',0),(745,107,'13','C',0),(746,107,'1','D',0),(747,107,'5','E',0),(750,108,'x − 3','A',0),(751,108,'x − 9','B',0),(752,108,'x² + 3','C',0),(753,108,'x + 9','D',0),(754,108,'x + 3','E',1),(757,109,'12','A',0),(758,109,'14','B',1),(759,109,'6','C',0),(760,109,'8','D',0),(761,109,'10','E',0),(764,110,'−3','A',1),(765,110,'−1','B',0),(766,110,'1','C',0),(767,110,'−2','D',0),(768,110,'3','E',0),(771,111,'1/6','A',0),(772,111,'1/3','B',1),(773,111,'1/2','C',0),(774,111,'1/4','D',0),(775,111,'2/3','E',0),(778,112,'3/5','A',0),(779,112,'3/10','B',1),(780,112,'1/5','C',0),(781,112,'2/5','D',0),(782,112,'1/4','E',0),(785,113,'3/4','A',0),(786,113,'1/8','B',0),(787,113,'1/2','C',1),(788,113,'1','D',0),(789,113,'1/4','E',0),(792,114,'4/13','A',0),(793,114,'1/4','B',0),(794,114,'1/52','C',0),(795,114,'1/13','D',1),(796,114,'1/26','E',0),(799,115,'1/2','A',0),(800,115,'3/4','B',0),(801,115,'1/4','C',0),(802,115,'1/8','D',0),(803,115,'3/8','E',1),(806,116,'34','A',0),(807,116,'27','B',0),(808,116,'28','C',0),(809,116,'31','D',1),(810,116,'30','E',0),(813,117,'220','A',0),(814,117,'90','B',0),(815,117,'110','C',1),(816,117,'120','D',0),(817,117,'100','E',0),(820,118,'96','A',1),(821,118,'128','B',0),(822,118,'192','C',0),(823,118,'48','D',0),(824,118,'64','E',0),(827,119,'72','A',0),(828,119,'78','B',0),(829,119,'54','C',0),(830,119,'80','D',1),(831,119,'81','E',0),(834,120,'24','A',1),(835,120,'12','B',0),(836,120,'21','C',0),(837,120,'18','D',0),(838,120,'30','E',0),(841,121,'(9, 3)','A',0),(842,121,'(7, 2)','B',0),(843,121,'(5, 4)','C',0),(844,121,'(6, 3)','D',1),(845,121,'(3, 6)','E',0),(848,122,'(1, 5)','A',0),(849,122,'(2, 3)','B',1),(850,122,'(4, 0)','C',0),(851,122,'(3, 2)','D',0),(852,122,'(0, 4)','E',0),(855,123,'Uma','A',0),(856,123,'Duas','B',0),(857,123,'Infinitas','C',0),(858,123,'Quatro','D',0),(859,123,'Nenhuma','E',1),(862,124,'Uma','A',0),(863,124,'Infinitas','B',1),(864,124,'Três','C',0),(865,124,'Nenhuma','D',0),(866,124,'Duas','E',0),(869,125,'(2, 3, 1)','A',0),(870,125,'(3, 2, 1)','B',0),(871,125,'(1, 3, 2)','C',0),(872,125,'(2, 1, 3)','D',0),(873,125,'(1, 2, 3)','E',1),(876,126,'√2/2','A',0),(877,126,'0','B',0),(878,126,'1','C',0),(879,126,'1/2','D',1),(880,126,'√3/2','E',0),(883,127,'2/3','A',0),(884,127,'4/5','B',0),(885,127,'4/3','C',0),(886,127,'3/4','D',1),(887,127,'3/5','E',0),(890,128,'−√3/2','A',0),(891,128,'−1/2','B',1),(892,128,'√3/2','C',0),(893,128,'0','D',0),(894,128,'1/2','E',0),(897,129,'√2','A',0),(898,129,'1','B',1),(899,129,'0','C',0),(900,129,'1/2','D',0),(901,129,'2','E',0),(904,130,'30° e 150°','A',1),(905,130,'150° e 210°','B',0),(906,130,'30° e 330°','C',0),(907,130,'210° e 330°','D',0),(908,130,'60° e 120°','E',0);
/*!40000 ALTER TABLE `alternativa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conteudo`
--

DROP TABLE IF EXISTS `conteudo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conteudo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dificuldade` enum('facil','medio','dificil') NOT NULL,
  `descricao` varchar(400) DEFAULT NULL,
  `nome` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conteudo`
--

LOCK TABLES `conteudo` WRITE;
/*!40000 ALTER TABLE `conteudo` DISABLE KEYS */;
INSERT INTO `conteudo` VALUES (1,'medio','Estudo dos agrupamentos possíveis de elementos de um conjunto, incluindo arranjos, permutações e combinações.','Análise Combinatória'),(2,'dificil','Estudo do desenvolvimento da potência de um binômio (x + y)^n e seus termos gerais.','Binômio de Newton'),(3,'dificil','Estudo de curvas geométricas obtidas pela interseção de um cone com um plano: circunferência, elipse, parábola e hipérbole.','Cônicas'),(4,'facil','Estudo da teoria dos conjuntos, operações como união, interseção, diferença e diagramas de Venn.','Conjuntos'),(5,'medio','Cálculo e propriedades de determinantes associados a matrizes quadradas de ordem n.','Determinantes'),(6,'dificil','Estudo das equações polinomiais, raízes, relações de Girard e teorema fundamental da álgebra.','Equações Algébricas'),(7,'facil','Análise de dados, medidas de tendência central (média, mediana, moda) e dispersão.','Estatística'),(8,'facil','Estudo da função polinomial do 1º grau f(x) = ax + b, gráficos e aplicações.','Função Afim'),(9,'medio','Estudo de funções na forma f(x) = a^x, crescimento exponencial e equações.','Função Exponencial'),(10,'medio','Estudo da função polinomial do 2º grau f(x) = ax^2 + bx + c, vértices e raízes.','Função Quadrática'),(11,'medio','Conceitos gerais de funções, domínio, contradomínio, imagem, funções injetoras, sobrejetoras e bijetoras.','Funções'),(12,'medio','Estudo da geometria por meio de coordenadas cartesianas, retas, circunferências e distâncias.','Geometria Analítica'),(13,'medio','Estudo das posições relativas entre pontos, retas e planos no espaço tridimensional.','Geometria de Posição'),(14,'medio','Cálculo de áreas e volumes de sólidos geométricos como prismas, pirâmides, cilindros, cones e esferas.','Geometria Espacial'),(15,'facil','Estudo de figuras geométricas planas, polígonos, circunferências, áreas e perímetros.','Geometria Plana'),(16,'medio','Estudo das propriedades operatórias dos logaritmos e resolução de equações logarítmicas.','Logaritmo'),(17,'facil','Operações fundamentais, frações, razões, proporções, regra de três e porcentagem.','Matemática Básica'),(18,'medio','Estudo de juros simples e compostos, descontos, financiamentos e inflação.','Matemática Comercial e Financeira'),(19,'medio','Estudo de tabelas numéricas organizadas em linhas e colunas, operações e tipos especiais de matrizes.','Matrizes'),(20,'medio','Estudo da função modular, inequações e equações com valores absolutos.','Módulo'),(21,'dificil','Estudo dos números na forma algébrica e trigonométrica z = a + bi, operações e fórmula de De Moivre.','Números complexos'),(22,'medio','Estudo de expressões algébricas polinomiais, operações, divisão e dispositivos de Briot-Ruffini.','Polinômios'),(23,'medio','Cálculo da chance de ocorrência de eventos em experimentos aleatórios, probabilidade condicional e binomial.','Probabilidade'),(24,'medio','Estudo de sequências numéricas com progressão aritmética e geométrica.','Progressões - PA e PG'),(25,'medio','Resolução e discussão de sistemas de equações lineares por escalonamento e regra de Cramer.','Sistemas Lineares'),(26,'medio','Estudo das razões trigonométricas no triângulo retângulo, ciclo trigonométrico e identidades.','Trigonometria');
/*!40000 ALTER TABLE `conteudo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudante`
--

DROP TABLE IF EXISTS `estudante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudante` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nascimento` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudante`
--

LOCK TABLES `estudante` WRITE;
/*!40000 ALTER TABLE `estudante` DISABLE KEYS */;
INSERT INTO `estudante` VALUES (4,'teste','teste@gmail.com','$2y$10$KdbYgWIJNOi3VnKi0Ej.Z.aFjOzbyfgl8QN2YsAc9cQvzqDkCRLgi','2000-03-24'),(5,'Safado','safadez@gmail.com','$2y$10$Zr5PtUfsY51uII6bVfEj9OYZlyQ4pLk3GDC5ZPIhStASBdmEgpTIS','2008-03-12'),(6,'Viado','viado@gmail.com','$2y$10$4NlfTZlTp.IkTrZyYpnwtOHCU.K.oAK3Nfb1BPVhyNUEifQ3xvWvy','2006-02-09'),(7,'Murilo Pereira Vendrametto','murilo.p.vendrametto@gmail.com','$2y$10$ZOLHU1bMj1twTKwX/1eZaeVat.JdF2AlOfcw8qA5QVeqghqyJXW.u','2009-09-02');
/*!40000 ALTER TABLE `estudante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudante_questao`
--

DROP TABLE IF EXISTS `estudante_questao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudante_questao` (
  `id_estudante` int NOT NULL,
  `id_questao` int NOT NULL,
  `acerto` tinyint(1) DEFAULT NULL,
  `resposta` varchar(60) DEFAULT NULL,
  `data_realizacao` date DEFAULT NULL,
  PRIMARY KEY (`id_estudante`,`id_questao`),
  KEY `id_questao` (`id_questao`),
  CONSTRAINT `estudante_questao_ibfk_1` FOREIGN KEY (`id_estudante`) REFERENCES `estudante` (`id`) ON DELETE CASCADE,
  CONSTRAINT `estudante_questao_ibfk_2` FOREIGN KEY (`id_questao`) REFERENCES `questao` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudante_questao`
--

LOCK TABLES `estudante_questao` WRITE;
/*!40000 ALTER TABLE `estudante_questao` DISABLE KEYS */;
/*!40000 ALTER TABLE `estudante_questao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professor`
--

DROP TABLE IF EXISTS `professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nascimento` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor`
--

LOCK TABLES `professor` WRITE;
/*!40000 ALTER TABLE `professor` DISABLE KEYS */;
INSERT INTO `professor` VALUES (1,'Jorjão','jorjao_o_grosso@gmail.com','$2y$10$iuRJ2R1RM/LHWf0opKTZLuDB07.nLA0z9z7SKC0UhixK/M6jmEPKu','2005-10-18'),(2,'João Paulo','joaopaulo@gmail.com','$2y$10$O7l9KmEPY7P312xGqpuB6uHWxZXgzzUlInl5BNpByPLhJXyIUmFwa','2004-03-10'),(3,'Maria Joaquina','Mariajoaquina@gmail.com','$2y$10$v0Wr7Kw3WMIHeNyTEjtWX.0tzUw6A5MapnKra/uUYrDyTGueT1tN6','2003-03-20'),(4,'Pamela Trudes Lourenção','lourencaopamela@gmail.com','$2y$10$Z4topPHX03llNGAE2ygJLOZmqnra7FcYKz7IBZg9b4.YObox0fKEK','2010-07-07');
/*!40000 ALTER TABLE `professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questao`
--

DROP TABLE IF EXISTS `questao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enunciado` text NOT NULL,
  `id_conteudo` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_conteudo` (`id_conteudo`),
  CONSTRAINT `questao_ibfk_1` FOREIGN KEY (`id_conteudo`) REFERENCES `conteudo` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questao`
--

LOCK TABLES `questao` WRITE;
/*!40000 ALTER TABLE `questao` DISABLE KEYS */;
INSERT INTO `questao` VALUES (1,'Questão 1 - DAMA 2026\n\nUma biblioteca tem 7 livros distintos. De quantas maneiras é possível escolher 3 deles, sem considerar a ordem?',1),(2,'Questão 2 - DAMA 2026\n\nQuantos anagramas distintos tem a palavra BANANA?',1),(3,'Questão 3 - DAMA 2026\n\nDe quantas maneiras 6 pessoas distintas podem sentar-se ao redor de uma mesa circular, considerando equivalentes apenas as rotações?',1),(4,'Questão 4 - DAMA 2026\n\nUma turma de 8 estudantes vai escolher presidente e vice, que devem ser pessoas diferentes. Quantas escolhas são possíveis?',1),(5,'Questão 5 - DAMA 2026\n\nHá 5 alunos e 4 alunas disponíveis. Quantas equipes com exatamente 2 alunos e 2 alunas podem ser formadas?',1),(6,'Questão 6 - DAMA 2026\n\nQual é o coeficiente de x³ no desenvolvimento de (1 + x)⁷?',2),(7,'Questão 7 - DAMA 2026\n\nQual é o coeficiente de x² no desenvolvimento de (2 + x)⁵?',2),(8,'Questão 8 - DAMA 2026\n\nQual é o termo independente de x no desenvolvimento de (x + 2/x)⁶, com x ≠ 0?',2),(9,'Questão 9 - DAMA 2026\n\nQual é o coeficiente de x³ no desenvolvimento de (2x − 1)⁴?',2),(10,'Questão 10 - DAMA 2026\n\nQual é a soma dos coeficientes do polinômio (2x − 3)⁶?',2),(11,'Questão 11 - DAMA 2026\n\nQual é o centro da circunferência (x − 3)² + (y + 2)² = 25?',3),(12,'Questão 12 - DAMA 2026\n\nQuais são os focos da elipse x²/25 + y²/9 = 1?',3),(13,'Questão 13 - DAMA 2026\n\nQual é o foco da parábola y² = 12x?',3),(14,'Questão 14 - DAMA 2026\n\nQuais são as assíntotas da hipérbole x²/16 − y²/9 = 1?',3),(15,'Questão 15 - DAMA 2026\n\nQual é o comprimento do eixo maior da elipse x²/4 + y²/36 = 1?',3),(16,'Questão 16 - DAMA 2026\n\nSe A tem 18 elementos, B tem 15 e A ∩ B tem 7, quantos elementos tem A ∪ B?',4),(17,'Questão 17 - DAMA 2026\n\nSe A = {1, 2, 3, 4} e B = {2, 4, 6}, qual é o conjunto A − B?',4),(18,'Questão 18 - DAMA 2026\n\nQuantos subconjuntos possui um conjunto com 5 elementos?',4),(19,'Questão 19 - DAMA 2026\n\nEm uma turma de 40 alunos, 22 estudam inglês, 17 estudam espanhol e 8 estudam ambos. Quantos não estudam nenhuma dessas línguas?',4),(20,'Questão 20 - DAMA 2026\n\nSe A = {a, b, c} e B = {1, 2, 3, 4}, quantos pares ordenados há em A × B?',4),(21,'Questão 21 - DAMA 2026\n\nQual é o determinante da matriz com linhas (4, 3) e (2, 5)?',5),(22,'Questão 22 - DAMA 2026\n\nQual é o determinante de uma matriz triangular de ordem 3 cuja diagonal principal é (2, −3, 5)?',5),(23,'Questão 23 - DAMA 2026\n\nSe det(A) = 7, qual é o determinante da matriz obtida trocando duas linhas de A?',5),(24,'Questão 24 - DAMA 2026\n\nSe A é de ordem 3 e det(A) = 2, quanto vale det(3A)?',5),(25,'Questão 25 - DAMA 2026\n\nPara qual valor de k a matriz com linhas (k, 4) e (3, 6) tem determinante zero?',5),(26,'Questão 26 - DAMA 2026\n\nQual é a soma das raízes de x³ − 6x² + 11x − 6 = 0?',6),(27,'Questão 27 - DAMA 2026\n\nQual é o produto das raízes de 2x³ − 3x² + x + 8 = 0, contadas com multiplicidade?',6),(28,'Questão 28 - DAMA 2026\n\nNo polinômio (x − 2)³(x + 1)², qual é a multiplicidade da raiz 2?',6),(29,'Questão 29 - DAMA 2026\n\nEntre os valores 1, 2, 3, 4 e 5, qual é raiz de x³ − 4x² + x + 6 = 0 e é maior que 2?',6),(30,'Questão 30 - DAMA 2026\n\nQuantas raízes complexas não reais tem x⁴ − 16 = 0?',6),(31,'Questão 31 - DAMA 2026\n\nQual é a média aritmética de 4, 6, 8 e 10?',7),(32,'Questão 32 - DAMA 2026\n\nQual é a mediana de 3, 9, 2, 12 e 6?',7),(33,'Questão 33 - DAMA 2026\n\nQual é a moda de 2, 4, 4, 5, 6, 6 e 6?',7),(34,'Questão 34 - DAMA 2026\n\nUma prova nota 8 tem peso 2 e outra nota 5 tem peso 3. Qual é a média ponderada?',7),(35,'Questão 35 - DAMA 2026\n\nQual é a amplitude dos dados −3, 0, 4 e 9?',7),(36,'Questão 36 - DAMA 2026\n\nQual é o zero da função f(x) = 3x − 12?',8),(37,'Questão 37 - DAMA 2026\n\nUma função afim satisfaz f(1) = 5 e f(3) = 11. Qual é seu coeficiente angular?',8),(38,'Questão 38 - DAMA 2026\n\nUma corrida custa R$ 7 de bandeirada mais R$ 2,50 por quilômetro. Quanto custa uma corrida de 8 km?',8),(39,'Questão 39 - DAMA 2026\n\nEm que ponto o gráfico de y = −2x + 6 cruza o eixo y?',8),(40,'Questão 40 - DAMA 2026\n\nSe f(x) = 4x + b e f(2) = 5, qual é o valor de b?',8),(41,'Questão 41 - DAMA 2026\n\nQual é o valor de x que satisfaz 3ˣ = 81?',9),(42,'Questão 42 - DAMA 2026\n\nUma população de 150 bactérias dobra a cada hora. Quantas bactérias haverá após 4 horas?',9),(43,'Questão 43 - DAMA 2026\n\nUma substância tem massa inicial de 160 g e perde metade da massa a cada dia. Qual será a massa após 3 dias?',9),(44,'Questão 44 - DAMA 2026\n\nQual é a solução de 4ˣ = 8?',9),(45,'Questão 45 - DAMA 2026\n\nQual é a imagem da função real f(x) = 2ˣ + 3, definida para todo x real?',9),(46,'Questão 46 - DAMA 2026\n\nQual é a abscissa do vértice de f(x) = x² − 8x + 7?',10),(47,'Questão 47 - DAMA 2026\n\nQuais são as raízes de x² − 5x + 6 = 0?',10),(48,'Questão 48 - DAMA 2026\n\nQual é o valor máximo de f(x) = −x² + 6x − 5?',10),(49,'Questão 49 - DAMA 2026\n\nQuantas raízes reais distintas tem 2x² + x + 3 = 0?',10),(50,'Questão 50 - DAMA 2026\n\nUm objeto tem altura h(t) = −t² + 4t em metros, com t em segundos. Em que instante positivo ele volta ao chão?',10),(51,'Questão 51 - DAMA 2026\n\nQual é o domínio real de f(x) = √(x − 2)?',11),(52,'Questão 52 - DAMA 2026\n\nSe f(x) = 2x + 1 e g(x) = x², qual é f(g(3))?',11),(53,'Questão 53 - DAMA 2026\n\nSe f(x) = 3x − 6, qual é f⁻¹(9)?',11),(54,'Questão 54 - DAMA 2026\n\nQual das funções de ℝ em ℝ abaixo é injetora?',11),(55,'Questão 55 - DAMA 2026\n\nPara f: {1, 2, 3} → {a, b, c}, com f(1) = a, f(2) = b e f(3) = a, qual é a imagem?',11),(56,'Questão 56 - DAMA 2026\n\nQual é a distância entre A(1, 2) e B(4, 6)?',12),(57,'Questão 57 - DAMA 2026\n\nQual é o ponto médio do segmento de extremidades (−2, 5) e (6, −1)?',12),(58,'Questão 58 - DAMA 2026\n\nQual é o coeficiente angular da reta que passa por (0, 1) e (4, 9)?',12),(59,'Questão 59 - DAMA 2026\n\nQual reta passa por (2, 3) e é perpendicular a y = 2x + 1?',12),(60,'Questão 60 - DAMA 2026\n\nQual ponto pertence à circunferência x² + y² = 25?',12),(61,'Questão 61 - DAMA 2026\n\nDuas retas no espaço não se cruzam e não são coplanares. Como são classificadas?',13),(62,'Questão 62 - DAMA 2026\n\nDois planos distintos que têm um ponto em comum se intersectam em qual conjunto?',13),(63,'Questão 63 - DAMA 2026\n\nQuantos planos passam por três pontos não colineares?',13),(64,'Questão 64 - DAMA 2026\n\nUma reta é perpendicular a duas retas concorrentes de um plano no ponto em que elas se cruzam. Qual é sua posição em relação ao plano?',13),(65,'Questão 65 - DAMA 2026\n\nDuas retas distintas perpendiculares ao mesmo plano são, entre si, como?',13),(66,'Questão 66 - DAMA 2026\n\nQual é o volume de um cilindro de raio 3 cm e altura 5 cm?',14),(67,'Questão 67 - DAMA 2026\n\nQual é a área total de um cubo de aresta 4 cm?',14),(68,'Questão 68 - DAMA 2026\n\nQual é o volume de uma pirâmide com área da base 30 cm² e altura 9 cm?',14),(69,'Questão 69 - DAMA 2026\n\nQual é o volume de uma esfera de raio 3 cm?',14),(70,'Questão 70 - DAMA 2026\n\nQual é a diagonal espacial de um paralelepípedo retângulo de dimensões 2 cm, 3 cm e 6 cm?',14),(71,'Questão 71 - DAMA 2026\n\nQual é a área de um triângulo de base 12 cm e altura 7 cm?',15),(72,'Questão 72 - DAMA 2026\n\nQual é a soma dos ângulos internos de um hexágono?',15),(73,'Questão 73 - DAMA 2026\n\nQual é o comprimento de uma circunferência de raio 4 cm?',15),(74,'Questão 74 - DAMA 2026\n\nQual é a área de um trapézio com bases de 8 cm e 14 cm e altura de 5 cm?',15),(75,'Questão 75 - DAMA 2026\n\nUm triângulo retângulo tem catetos de 9 cm e 12 cm. Qual é a hipotenusa?',15),(76,'Questão 76 - DAMA 2026\n\nQual é o valor de log₂(32)?',16),(77,'Questão 77 - DAMA 2026\n\nSe log₃(x) = 4, qual é o valor de x?',16),(78,'Questão 78 - DAMA 2026\n\nQual é o valor de log₂(8) + log₂(4)?',16),(79,'Questão 79 - DAMA 2026\n\nQual é o valor de log₅(1/25)?',16),(80,'Questão 80 - DAMA 2026\n\nQual é a solução real de log₂(x − 1) = 3?',16),(81,'Questão 81 - DAMA 2026\n\nQuanto vale 3/4 + 1/6?',17),(82,'Questão 82 - DAMA 2026\n\nQuanto é 15% de 240?',17),(83,'Questão 83 - DAMA 2026\n\nSe 4 cadernos custam R$ 28, quanto custam 7 cadernos ao mesmo preço unitário?',17),(84,'Questão 84 - DAMA 2026\n\nUma receita usa 300 g de farinha para 4 porções. Quanto de farinha é necessário para 10 porções?',17),(85,'Questão 85 - DAMA 2026\n\nQual é o menor múltiplo comum positivo de 12 e 18?',17),(86,'Questão 86 - DAMA 2026\n\nQual é o montante de R$ 1000 aplicados a juros simples de 2% ao mês por 5 meses?',18),(87,'Questão 87 - DAMA 2026\n\nQual é o montante de R$ 2000 aplicados a juros compostos de 10% ao mês por 2 meses?',18),(88,'Questão 88 - DAMA 2026\n\nUm produto de R$ 250 recebe desconto de 12%. Qual é o preço final?',18),(89,'Questão 89 - DAMA 2026\n\nUm preço de R$ 100 sobe 20% e depois cai 20% sobre o novo valor. Qual é o preço final?',18),(90,'Questão 90 - DAMA 2026\n\nUm investimento rendeu 10% em um ano com inflação de 5%. Qual foi o ganho real aproximado?',18),(91,'Questão 91 - DAMA 2026\n\nQual é a ordem da transposta de uma matriz com 2 linhas e 5 colunas?',19),(92,'Questão 92 - DAMA 2026\n\nSe A é 3 × 2 e B é 2 × 4, qual é a ordem de AB?',19),(93,'Questão 93 - DAMA 2026\n\nNa matriz A com linhas (1, 4) e (2, 3), qual é o elemento a₂₁?',19),(94,'Questão 94 - DAMA 2026\n\nSe A tem linhas (1, 2) e (3, 4), qual é o elemento da linha 2 e coluna 2 de A²?',19),(95,'Questão 95 - DAMA 2026\n\nNa matriz identidade de ordem 3, qual é a soma de todos os elementos?',19),(96,'Questão 96 - DAMA 2026\n\nQual é o valor de ∣−7∣ + ∣3 − 8∣?',20),(97,'Questão 97 - DAMA 2026\n\nQuais são as soluções de ∣x − 4∣ = 3?',20),(98,'Questão 98 - DAMA 2026\n\nQual é o conjunto solução de ∣x∣ < 5?',20),(99,'Questão 99 - DAMA 2026\n\nQual é a solução de ∣2x + 1∣ = 0?',20),(100,'Questão 100 - DAMA 2026\n\nQuais são as soluções de ∣x + 2∣ ≥ 4?',20),(101,'Questão 101 - DAMA 2026\n\nQual é o resultado de (2 + 3i) + (4 − i)?',21),(102,'Questão 102 - DAMA 2026\n\nQual é o resultado de (1 + 2i)(3 − i)?',21),(103,'Questão 103 - DAMA 2026\n\nQual é o módulo do número complexo −5 + 12i?',21),(104,'Questão 104 - DAMA 2026\n\nQual é o valor de i²⁷?',21),(105,'Questão 105 - DAMA 2026\n\nQual é o valor de (1 + i)⁴?',21),(106,'Questão 106 - DAMA 2026\n\nQual é o grau do produto de um polinômio de grau 3 por um polinômio de grau 4?',22),(107,'Questão 107 - DAMA 2026\n\nQual é o resto da divisão de P(x) = x³ − 2x + 5 por x − 2?',22),(108,'Questão 108 - DAMA 2026\n\nQual é o quociente da divisão de x² − 9 por x − 3?',22),(109,'Questão 109 - DAMA 2026\n\nSe P(x) = 2x² − x + 4, qual é P(−2)?',22),(110,'Questão 110 - DAMA 2026\n\nPara que x − 1 seja fator de P(x) = x³ + ax + 2, quanto deve valer a?',22),(111,'Questão 111 - DAMA 2026\n\nAo lançar um dado honesto de seis faces, qual é a probabilidade de obter um número maior que 4?',23),(112,'Questão 112 - DAMA 2026\n\nUma urna contém 3 bolas vermelhas e 2 azuis. Retiram-se duas bolas sem reposição. Qual é a probabilidade de ambas serem vermelhas?',23),(113,'Questão 113 - DAMA 2026\n\nAo lançar duas moedas honestas independentes, qual é a probabilidade de sair exatamente uma cara?',23),(114,'Questão 114 - DAMA 2026\n\nDentre as cartas de copas de um baralho padrão de 52 cartas, escolhe-se uma ao acaso. Qual é a probabilidade de ser um ás?',23),(115,'Questão 115 - DAMA 2026\n\nEm três lançamentos independentes de uma moeda honesta, qual é a probabilidade de obter exatamente duas caras?',23),(116,'Questão 116 - DAMA 2026\n\nUma PA tem primeiro termo 4 e razão 3. Qual é o 10º termo?',24),(117,'Questão 117 - DAMA 2026\n\nQual é a soma dos dez primeiros termos da PA (2, 4, 6, ...)?',24),(118,'Questão 118 - DAMA 2026\n\nUma PG tem primeiro termo 3 e razão 2. Qual é o sexto termo?',24),(119,'Questão 119 - DAMA 2026\n\nQual é a soma dos quatro primeiros termos da PG (2, 6, 18, ...)?',24),(120,'Questão 120 - DAMA 2026\n\nQual é a soma da PG infinita 12, 6, 3, ...?',24),(121,'Questão 121 - DAMA 2026\n\nNo sistema x + y = 9 e x − y = 3, qual é a solução (x, y)?',25),(122,'Questão 122 - DAMA 2026\n\nQual é a solução (x, y) de 2x + y = 7 e x + 2y = 8?',25),(123,'Questão 123 - DAMA 2026\n\nQuantas soluções reais tem o sistema x + y = 4 e 2x + 2y = 9?',25),(124,'Questão 124 - DAMA 2026\n\nQuantas soluções reais tem o sistema 3x − y = 5 e 6x − 2y = 10?',25),(125,'Questão 125 - DAMA 2026\n\nNo sistema x + y + z = 6, y + z = 5 e z = 3, qual é a solução (x, y, z)?',25),(126,'Questão 126 - DAMA 2026\n\nQual é o valor de sen(30°)?',26),(127,'Questão 127 - DAMA 2026\n\nEm um triângulo retângulo, o cateto oposto a um ângulo agudo mede 6 e o adjacente mede 8. Qual é a tangente desse ângulo?',26),(128,'Questão 128 - DAMA 2026\n\nQual é o valor de cos(120°)?',26),(129,'Questão 129 - DAMA 2026\n\nQual é o valor de sen²(37°) + cos²(37°)?',26),(130,'Questão 130 - DAMA 2026\n\nNo intervalo [0°, 360°), quais ângulos satisfazem sen(x) = 1/2?',26);
/*!40000 ALTER TABLE `questao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `simulado`
--

DROP TABLE IF EXISTS `simulado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `simulado` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tempo_limite` int DEFAULT NULL,
  `numero_questoes` int DEFAULT NULL,
  `id_estudante` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_estudante` (`id_estudante`),
  CONSTRAINT `simulado_ibfk_1` FOREIGN KEY (`id_estudante`) REFERENCES `estudante` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `simulado`
--

LOCK TABLES `simulado` WRITE;
/*!40000 ALTER TABLE `simulado` DISABLE KEYS */;
/*!40000 ALTER TABLE `simulado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `simulado_questao`
--

DROP TABLE IF EXISTS `simulado_questao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `simulado_questao` (
  `id_questao` int NOT NULL,
  `id_simulado` int NOT NULL,
  PRIMARY KEY (`id_questao`,`id_simulado`),
  KEY `id_simulado` (`id_simulado`),
  CONSTRAINT `simulado_questao_ibfk_1` FOREIGN KEY (`id_questao`) REFERENCES `questao` (`id`) ON DELETE CASCADE,
  CONSTRAINT `simulado_questao_ibfk_2` FOREIGN KEY (`id_simulado`) REFERENCES `simulado` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `simulado_questao`
--

LOCK TABLES `simulado_questao` WRITE;
/*!40000 ALTER TABLE `simulado_questao` DISABLE KEYS */;
/*!40000 ALTER TABLE `simulado_questao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'mathapp'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-23 23:55:48