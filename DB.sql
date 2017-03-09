

DROP PROCEDURE IF EXISTS debug_msg;

DELIMITER //

CREATE PROCEDURE debug_msg(enabled INTEGER, msg VARCHAR(255))
BEGIN
  IF enabled THEN BEGIN
    select concat("** ", msg) AS '** DEBUG:';
  END; END IF;
END //

DELIMITER ;






DROP PROCEDURE IF EXISTS create_booking;

DELIMITER //

CREATE PROCEDURE create_booking
(IN arr_date CHAR(10), no_of_nights INTEGER, cost FLOAT, pass BOOL, OUT out_param INT)

BEGIN

DECLARE actual_arrival_date DATE;
DECLARE booking_date DATE;
DECLARE modified_date DATE;
DECLARE counter INT UNSIGNED DEFAULT 0;

SET actual_arrival_date = CAST(arr_date AS DATE);
SET booking_date = NOW();
SET modified_date = NOW();
SET @enabled = TRUE;


	INSERT INTO bookings VALUES (NULL, actual_arrival_date, no_of_nights, booking_date, modified_date, cost, '', pass);
	SET out_param =  LAST_INSERT_ID();

 	WHILE counter < no_of_nights DO
    	UPDATE availability set status='B', booking_id=out_param WHERE arrival_date = DATE_FORMAT(actual_arrival_date, '%Y-%m-%d');
    	SET actual_arrival_date = DATE_ADD(actual_arrival_date , INTERVAL 1 DAY);
    	SET counter = counter+1;
 	END WHILE;
  	COMMIT;

END //

DELIMITER ;






DROP TABLE availability IF EXISTS availability;

CREATE TABLE `availability` (
  `availability_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `arrival_date` date NOT NULL,
  `status` char(1) DEFAULT NULL,
  `booking_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`availability_id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;





DROP PROCEDURE IF EXISTS make_availability;

DELIMITER //

CREATE PROCEDURE make_availability
(IN start_date CHAR(10), end_date CHAR(10), season_start_date CHAR(10) )

BEGIN

DECLARE actual_start_date DATE;
DECLARE actual_end_date DATE;
DECLARE actual_season_start_date DATE;
DECLARE counter INT UNSIGNED DEFAULT 0;

SET actual_start_date = CAST(start_date AS DATE);
SET actual_end_date = CAST(end_date AS DATE);
SET actual_season_start_date = CAST(season_start_date AS DATE);
SET @enabled = TRUE;

  WHILE actual_start_date <= actual_end_date DO

    IF ( actual_start_date <= actual_season_start_date ) THEN
        INSERT INTO availability (arrival_date, status) VALUES (DATE_FORMAT(actual_start_date, '%Y-%m-%d'), 'C');
    ELSEIF ( actual_start_date > actual_season_start_date ) THEN
        INSERT INTO availability (arrival_date) VALUES (DATE_FORMAT(actual_start_date, '%Y-%m-%d'));  
    END IF;

      SET actual_start_date = DATE_ADD(actual_start_date , INTERVAL 1 DAY);
      SET counter = counter+1;
  END WHILE;
    COMMIT;

END

DELIMITER ;

