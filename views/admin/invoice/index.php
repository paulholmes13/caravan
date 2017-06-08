<!DOCTYPE html>
<?php
require_once( '/Users/pholmes/Sites/paulandclaireholidayhome/config.php');
require_once( ROOT_DIR.'/admin/classes/DB.php' );
require_once( ROOT_DIR.'/admin/classes/Bookings.php' );
require_once( ROOT_DIR.'/admin/classes/Utils.php' );

$booking_id = $_GET['id'];

if (!$booking_id) {
	die();
}

$bookings = new Bookings();

// Set timezone
date_default_timezone_set('UTC');

$bookingInfo = $bookings->getAllInfo($booking_id);

$booking = $bookingInfo->bookingInfo;
$guestInfo = $bookingInfo->guestInfo;
$payments = $bookingInfo->paymentInfo;
$addressInfo = $bookingInfo->addressInfo;

$cost = $booking[0]['cost'];
$arrival_date = $booking[0]['arrival_date'];
$nights = $booking[0]['no_of_nights'];
$balance = $cost;

foreach ($guestInfo as $guests) {

	if ($guests['age'] && !is_null($guests['age'])) {
		$guestString .= $guests['title'] . " " . $guests['first_name'] . " " . $guests['last_name'] . " - Age: " . $guests['age'] . "<br />";
	}
	else {	
		$guestString .= $guests['title'] . " " . $guests['first_name'] . " " . $guests['last_name'] . "<br />";
	}

	foreach ($guests as $key => $guest) {
		if ($key == 'lead_passenger' && $guest == 1) {
			$customer_id = $guests['customer_id'];
			$email = $guests['email_address'];
		}
	}
}

foreach ($payments as $payment) {
		$balance -= $payment['amount'];
		$paymentString .= "<span class='small'>" . $payment['payment_date'] . "</span><span class='small'>Type: " . $payment['type'] . "</span><span class='medium'>Amount: &pound;" . $payment['amount'] . "</span><span>Ref: " . $payment['reference'] . "</span><span>Balance: &pound;" . $balance . "</span></br >";
}

$address = $addressInfo[0]['address_1'] . "<br />" . $addressInfo[0]['address_2'] . "<br />" . $addressInfo[0]['address_3'] . "<br />" . $addressInfo[0]['address_4'] . "<br />" . $addressInfo[0]['postal_code'];
$phone = $addressInfo[0]['phone'];

?>

<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">

<style>
.w3-container {
	padding:0px 0px 0px 10px;
	max-width: 700px;
}
body{
	font-size:12px;
}
.header_img {
	width: 100%;
	height: 200px;
	background: url('img/header.jpg') no-repeat;
	background-position-y: -185px;
	background-position-x: -90px;
}

.header_img img.overlay {
	height: auto;
    	width: 24%;
	margin: 79px 0px 0px 10px;
}

.header_img p {
    color: white;
    text-align: right;
    margin-top: 172px;
    margin-right: 10px;
    width: 72%;
    float: right;
}

.title .wording {
	float:left;
	width: 55%;
}

.title .vanaddress {
	float:right;
	text-align:right;
}

hr {
	clear:both;
}

span {
    display: block;
    float: left;
    width: 160px;
}

span.medium {
	width: 140px;
}
span.small {
	width: 115px;
}

.address {
	width:65%; 
	float:left;
}

.conditions {
	float:left;
	width: 50%;
}

.cancellation {
	float:right;
	width: 50%;
}

.conditions p, .cancellation p, .cleaning p {
	font-size:10px;
}

</style>

</head>
<body class="test">

<div class="w3-container">

<div class="header_img">
	<img class="overlay" src="img/delta_lounge.jpeg" />
	<p><a href="https://www.facebook.com/paulandclairesholidayhome/">https://www.facebook.com/paulandclairesholidayhome/</a></p>
</div>

<div class="title">
<h1 class="wording">Booking Confirmation - Reference: DELTA<?php echo "/$booking_id" ?> </h1>
<div class="vanaddress">
<p>
47 Meadow <br/>
Haven Holiday Park<br/>
LittleSea<br/>
DT4 9DT
</p>
<p><a href="tel:07787684268">Tel: 07787 684268</a></p>
</div>
</div>

<hr />

<div class="address">
<h3>About You</h3>
<p><?php echo $address?></p>
<p>Tel: <?php echo $phone ?></p>
<p>Email: <?php echo $email ?></p>
</div>
<div>
<h3>People Staying</h3>
<p><?php echo $guestString ?></p>
</div>

<hr />

<div class="info">
<h3>Accommodation</h3>
<p>
1 x Deluxe Delta Warmth 2016 - 3 Bed - Self Catering -  Arriving on <?php echo $arrival_date?> for <?php echo $nights?> nights.
</p>
<p>
Total Cost: &pound;<?php echo $cost ?>
</p>
</div>

<hr />

<div class="payments">
<h3>Payments</h3>
<p><?php echo $paymentString ?></p>
</div>

<hr />

<div class="conditions">
<h4>Conditions</h4>
<p>
A deposit of &pound;75 is required.<br />
The deposit will be refunded according to the cancellation conditions.<br />
Full booking balance must be paid 14 days before arrival.<br />
Payments by cash or BACS<br />
Your expected arrival time is 15:00.<br />
</p>
</div>

<div class="cancellation">
<h4>Cancellations</h4>
<p>
If the booking is cancelled then a charge equal to &pound;75 per booking will be made.<br />
In the event of a no show or booking reduction (after arrival date) the full cost of the booking is charged.<br />
</p>
</div>

<hr />

<div class="cleaning">
<p>
Firstly, we would like to wish you a happy holiday and we hope you enjoy the park and caravan alike.

As this caravan is PRIVATELY owned please:

1) Leave the caravan as you first find it.  Prior to your stay the caravan has been thoroughly cleaned. Please check the caravan when you arrive and report any issues immediately taking photos if necessary.

2) We have supplied a number of cleaning products.  Please use them if needed and please replace should you use the last of an item.  There is a grocery store located by the main complex.
 
3) Prior to leaving the caravan please ensure that all kitchen equipment is clean and back in place, ensuring that all kitchen surfaces and caravan tables have been wiped clean, bins have been emptied and the floors have been hoovered and left tidy.

4) The caravan should be left in the state you found it.  Any additional cleaning by Haven will impose further costs to us and we won’t be able to keep our prices at what we think are a reasonable rate.

5) Please do not remove any property from the caravan.  This is our property NOT Havens.  Please report any breakages, we understand accidents happen.

6) All doors and windows must be closed when you leave the caravan. 

7) This is a strictly no smoking caravan.

The cleaners will take photographs of anything they find.</p>
<p>Many thanks.</p>
<p>Paul and Claire</p>
</div>

</div>


</body>
</html>
