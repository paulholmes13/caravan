

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
(IN arr_date CHAR(10), no_of_nights INTEGER, cost FLOAT, pass BOOL, booking_id INTEGER, OUT out_param INT)

BEGIN

DECLARE actual_arrival_date DATE;
DECLARE booking_date DATE;
DECLARE modified_date DATE;
DECLARE counter INT UNSIGNED DEFAULT 0;

SET actual_arrival_date = CAST(arr_date AS DATE);
SET booking_date = NOW();
SET modified_date = NOW();
SET @enabled = TRUE;

  IF (booking_id IS NULL) THEN
    INSERT INTO bookings VALUES (NULL, actual_arrival_date, no_of_nights, booking_date, modified_date, cost, '', pass, null, null, null, null, null, null, null, null);
    SET out_param =  LAST_INSERT_ID();

    WHILE counter < no_of_nights DO
        UPDATE availability set status='B', booking_id=out_param WHERE arrival_date = DATE_FORMAT(actual_arrival_date, '%Y-%m-%d');
        SET actual_arrival_date = DATE_ADD(actual_arrival_date , INTERVAL 1 DAY);
        SET counter = counter+1;
    END WHILE;
    
    COMMIT;
    SELECT @out_param;
  ELSEIF (booking_id IS NOT NULL) THEN

    SET @query = "UPDATE bookings SET modified_date = '@modDate', cost = @cost, priv_pass = @privPass WHERE booking_id = @bookingId;";
    SET @query = replace(@query, '@modDate', modified_date);
    SET @query = replace(@query, '@cost', cost);
    SET @query = replace(@query, '@privPass', pass);  
    SET @query = replace(@query, '@bookingId', booking_id);  

    PREPARE stmt1 FROM @query;
    EXECUTE stmt1;
    COMMIT;

  END IF;

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

END //

DELIMITER ;





DROP PROCEDURE IF EXISTS create_guest;

DELIMITER //

CREATE PROCEDURE create_guest
(IN bookingId INTEGER, existingCustomerId INTEGER, customer_id INTEGER, title CHAR(10), firstName CHAR(50), lastName CHAR(50), emailAddress VARCHAR(200), age INTEGER, leadPassenger INTEGER )

BEGIN

DECLARE nextId INT;

  SET @enabled = TRUE;
  SET @sql = '';  
  
  if ( leadPassenger = 1 ) THEN 

    if ( existingCustomerId IS NOT NULL ) THEN
    
      SET @query = 'UPDATE bookings SET lead_passenger_id = @customerId WHERE booking_id = @bookingId;';
      SET @query = replace(@query, '@customerId', existingCustomerId);
      SET @query = replace(@query, '@bookingId', bookingId);

    ELSEIF ( existingCustomerId IS NULL AND customer_id IS NOT NULL ) THEN 
  
      SET @query = "UPDATE customer SET title='@title', first_name='@firstName', last_name='@lastName', age='@age', email_address='@emailAddress' WHERE customer_id=@customerId";
      SET @query = replace(@query, '@title', title);
      SET @query = replace(@query, '@firstName', firstName);
      SET @query = replace(@query, '@lastName', lastName);
      SET @query = replace(@query, '@age', IFNULL(age,''));
      SET @query = replace(@query, '@emailAddress', emailAddress);
      SET @query = replace(@query, '@customerId', customer_id);
    
    ELSEIF ( existingCustomerId IS NULL AND customer_id IS NULL ) THEN 
    
      INSERT INTO customer VALUES (NULL, title, firstName, lastName, age, emailAddress);
      SET @cId = LAST_INSERT_ID();
      SET @query = 'UPDATE bookings SET lead_passenger_id = @customerId WHERE booking_id = @bookingId;';
      SET @query = replace(@query, '@customerId', @cId);
      SET @query = replace(@query, '@bookingId', bookingId);

    END IF;

  ELSEIF ( leadPassenger <> 1 ) THEN

    SET @c1 = 
    (SELECT 
      IF (passenger_2_id IS NULL, 'passenger_2_id',
        IF (passenger_3_id IS NULL, 'passenger_3_id',
          IF (passenger_4_id IS NULL, 'passenger_4_id',
            IF (passenger_5_id IS NULL, 'passenger_5_id',
              IF (passenger_6_id IS NULL, 'passenger_6_id',
                IF (passenger_7_id IS NULL, 'passenger_7_id',
                  IF (passenger_8_id IS NULL, 'passenger_8_id', 0)
                )
              )
            )
          )
        )
      ) 
    FROM bookings WHERE booking_id = bookingId
    );

    if ( existingCustomerId IS NOT NULL ) THEN

      SET @query = 'UPDATE bookings SET @column = @customerId WHERE booking_id = @bookingId;';
      SET @query = replace(@query, '@column', @c1);
      SET @query = replace(@query, '@customerId', existingCustomerId);
      SET @query = replace(@query, '@bookingId', bookingId);

    ELSEIF ( existingCustomerId IS NULL AND customer_id IS NOT NULL ) THEN 

      SET @query = "UPDATE customer SET title='@title', first_name='@firstName', last_name='@lastName', age='@age', email_address='@emailAddress' WHERE customer_id=@customerId";
      SET @query = replace(@query, '@title', title);
      SET @query = replace(@query, '@firstName', firstName);
      SET @query = replace(@query, '@lastName', lastName);
      SET @query = replace(@query, '@age', IFNULL(age,''));
      SET @query = replace(@query, '@emailAddress', emailAddress);
      SET @query = replace(@query, '@customerId', customer_id);

    ELSEIF ( existingCustomerId IS NULL AND customer_id IS NULL ) THEN 
    
      INSERT INTO customer VALUES (NULL, title, firstName, lastName, age, emailAddress);
      SET @cId =  LAST_INSERT_ID();
      
      SET @query = 'UPDATE bookings SET @column = @customerId WHERE booking_id = @bookingId;';
      SET @query = replace(@query, '@column', @c1);
      SET @query = replace(@query, '@customerId', @cId);
      SET @query = replace(@query, '@bookingId', bookingId);
    
    END IF;
    
  END IF;

  PREPARE stmt1 FROM @query;
  EXECUTE stmt1;
  COMMIT;
END //

DELIMITER ;






DROP PROCEDURE IF EXISTS get_guests;

DELIMITER //

CREATE PROCEDURE get_guests
(IN bookingId INTEGER)

BEGIN

SELECT c.customer_id, c.title, c.first_name, c.last_name, c.age, c.email_address
FROM customer c
  LEFT JOIN bookings as j1 on c.customer_id = j1.lead_passenger_id
  LEFT JOIN bookings as j2 on c.customer_id = j2.passenger_2_id
  LEFT JOIN bookings as j3 on c.customer_id = j3.passenger_3_id
  LEFT JOIN bookings as j4 on c.customer_id = j4.passenger_4_id
  LEFT JOIN bookings as j5 on c.customer_id = j5.passenger_5_id
  LEFT JOIN bookings as j6 on c.customer_id = j6.passenger_6_id
  LEFT JOIN bookings as j7 on c.customer_id = j7.passenger_7_id
  LEFT JOIN bookings as j8 on c.customer_id = j8.passenger_8_id
WHERE 
j1.booking_id = bookingId OR
j2.booking_id = bookingId OR
j3.booking_id = bookingId OR
j4.booking_id = bookingId OR
j5.booking_id = bookingId OR
j6.booking_id = bookingId OR
j7.booking_id = bookingId OR
j8.booking_id = bookingId;

END //

DELIMITER ;






DROP PROCEDURE IF EXISTS create_address;

DELIMITER //

CREATE PROCEDURE create_address
(IN addressId INTEGER, customerId INTEGER, addressType CHAR(1), address1 VARCHAR(100), address2 VARCHAR(100) , address3 VARCHAR(100) , address4 VARCHAR(100), postCode VARCHAR(8), phone LONGTEXT  )

BEGIN

DECLARE nextId INT;

  SET @enabled = TRUE;
  SET @sql = '';  
  
  IF ( addressId IS NULL ) THEN 

    INSERT INTO addresses VALUES (NULL, addressType, address1, address2, address3, address4, postCode, customerId, phone);

  ELSEIF ( addressId IS NOT NULL ) THEN 

    SET @query = "UPDATE addresses SET address_1='@address_1', address_2='@address_2', address_3='@address_3', address_4='@address_4', postal_code='@postal_code', phone='@phone' WHERE address_id=@addressId";
    SET @query = replace(@query, '@address_1', address_1);
    SET @query = replace(@query, '@address_2', address_2);
    SET @query = replace(@query, '@address_3', address_3);
    SET @query = replace(@query, '@address_4', address_4);
    SET @query = replace(@query, '@emailAddress', emailAddress);
    SET @query = replace(@query, '@postal_code', postCode);
    SET @query = replace(@query, '@phone', phone);
    SET @query = replace(@query, '@addressId', addressId);
    
    PREPARE stmt1 FROM @query;
    EXECUTE stmt1;

  END IF;

COMMIT;
END //

DELIMITER ;








DROP PROCEDURE IF EXISTS create_payment;

DELIMITER //

CREATE PROCEDURE create_payment
(IN bookingId INTEGER, paymentId INTEGER, paymentType CHAR(11), paymentAmount FLOAT, paymentReference VARCHAR(50) , paymentDate CHAR(10)  )

BEGIN
  
  DECLARE actual_payment_date DATE;
  
  SET actual_payment_date = CAST(paymentDate AS DATE);
  SET @enabled = TRUE;
  SET @sql = '';  
  
  IF ( paymentId IS NULL ) THEN 

    SET @query = "INSERT INTO payments VALUES (NULL, @bookingId, '@paymentType', @paymentAmount, '@paymentDate', '@paymentReference');";
    SET @query = replace(@query, '@bookingId', bookingId);
    SET @query = replace(@query, '@paymentType', paymentType);
    SET @query = replace(@query, '@paymentAmount', paymentAmount);
    SET @query = replace(@query, '@paymentDate', actual_payment_date);
    SET @query = replace(@query, '@paymentReference', paymentReference);

  ELSEIF ( paymentId IS NOT NULL ) THEN 

    SET @query = "UPDATE payments SET type='@paymentType', amount='@paymentAmount', payment_date='@payment_date'. reference='@paymentReference' WHERE payment_id=@paymentId";
    SET @query = replace(@query, '@paymentType', paymentType);
    SET @query = replace(@query, '@paymentAmount', paymentAmount);
    SET @query = replace(@query, '@payment_date', DATE_FORMAT(actual_payment_date, '%Y-%m-%d'));
    SET @query = replace(@query, '@paymentReference', paymentReference);
    SET @query = replace(@query, '@paymentId', paymentId);
    
  END IF;

PREPARE stmt1 FROM @query;
EXECUTE stmt1;
COMMIT;

END //

DELIMITER ;