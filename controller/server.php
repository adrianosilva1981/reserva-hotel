<?php
header("Content-Type: application/json");

$return['success'] = true;

$action = addslashes($_GET['action']);

switch ($action) {
	case 'echo':
		$return['message'] = 'Hello! This is the controller.';
		break;

	case 'save-reservation':

	$week = array('Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado');

		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);

		foreach ($request as $key => $value) {
			if($value == '') {
				$return['success'] = false;
				$return['dev_msg'] = $key.' is missing...';
				$return['message'] = 'Ops! Alguns dados estão faltando.';
				break;
			}
			$value = addslashes(trim($value));
		}

		if($return['success']) {
			$checkin  = strtotime($request->checkin);
			$checkout = strtotime($request->checkout);

			if(($checkout - $checkin) < 86400) {
				$return['success'] = false;
				$return['dev_msg'] = 'Invalid date range';
				$return['message'] = 'Ops! A data de checkout tem que ser maior do que a de checkin.';
			}else{
				$hotels = file_get_contents('../data/hotels.json');
				$hotels = json_decode($hotels);

				$days = ($checkout - $checkin) / 86400;
				$current_day = $checkin;
				$regular_total = 0;
				$vip_total = 0;
				$index = $request->hotel - 1;

				for ($i = 0; $i < $days; $i++) {
					if(date('w', $current_day) == 6 || date('w', $current_day) === 0) {
						$vip_total += $hotels[$index]->prices->weekend->vip;
						$regular_total += $hotels[$index]->prices->weekend->regular;
					} else {
						$vip_total += $hotels[$index]->prices->days_week->vip;
						$regular_total += $hotels[$index]->prices->days_week->regular;
					}
					$current_day = $current_day + 86400;
				}

				if (!file_exists('../data/reservations.json')) {
					$fp = fopen('../data/reservations.json', 'w');
					fwrite($fp, '[]');
					fclose($fp);
				}

				$reservations = file_get_contents('../data/reservations.json');
				$reservations = json_decode($reservations);
				$next_index = count($reservations) + 1;

				$new_reservation = array(
					"checkin" => date_format(date_create($request->checkin), "Y-m-d"),
					"checkout" => date_format(date_create($request->checkout), "Y-m-d"),
					"id_hotel" => $hotels[$index]->id,
					"name" => $request->name,
					"phone" => $request->phone,
					"total" => $request->vip == 'yes' ? $vip_total : $regular_total
				);

				array_push($reservations, $new_reservation);

				$fp = fopen('../data/reservations.json','w');
				fwrite($fp, json_encode($reservations));
				fclose($fp);

				$regular_total = number_format($regular_total, 2, ',', '.');
				$vip_total = number_format($vip_total, 2, ',', '.');

				$return['success'] = true;
				$return['name'] = $request->name;
				$return['regular_total'] = $regular_total;
				$return['vip_total'] = $vip_total;
				$return['total'] = $request->vip == 'yes' ? $vip_total : $regular_total;
				$return['checkin'] = date_format(date_create($request->checkin), "d/m/Y");
				$return['checkout'] = date_format(date_create($request->checkout), "d/m/Y");
			}
		}

		break;

	default:
		$return['message'] = 'Nothing received';
		break;
}

echo json_encode($return);