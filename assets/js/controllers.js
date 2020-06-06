// For this exercise, I put all controllers in a single file for simplicity,
// but in a real case, each controller will created in a separated file ;)

// === home controller ====================================================================================
app.controller('homeController', function($scope){
	console.log('home works!');
});

// === reservation controller =============================================================================
app.controller('reservaController', function($scope, $http, $timeout, $location, $anchorScroll){

	$scope.hotels = [];
	$scope.reservations = [];
	$scope.message;
	$scope.response = false;
	$scope.success = false;
	$scope.loading = false;

	$scope.confirm = {
		name: '',
		regular_total: '',
		vip_total: '',
		total: '',
		checkin: '',
		checkout: ''
	};

	$scope.modalTitle;
	$scope.reservationForm = {
		name: {
			name: "Nome",
			value: '',
			required: true,
			valid: true
		},
		phone: {
			name: "Telefone",
			value: '',
			required: true,
			valid: true
		},
		hotel: {
			name: "Hotel",
			value: '',
			required: true,
			valid: true
		},
		vip: {
			name: "Cliente vip",
			value: 'no',
			required: true,
			valid: true
		},
		checkin: {
			name: "Data de checkin",
			value: '',
			required: true,
			valid: true
		},
		checkout: {
			name: "Data de checkout",
			value: '',
			required: true,
			valid: true
		}
	};

	$scope.onInit = () => {
		$http.get('data/hotels.json').then(
			(response) => {
				$scope.hotels = response.data;
			},
			(error) => {
				console.log(error);
			}
		);
	}

	$scope.setHotel = (id, title) => {
		$scope.reservationForm.hotel.value = id;
		$scope.modalTitle = title;
	}

	$scope.confirmReservation = () => {
		for (key in $scope.reservationForm) {
			if($scope.reservationForm[key].required && $scope.reservationForm[key].value === '') {
				$scope.reservationForm[key].valid = false;
				console.log(key);
				return;
			}
		}
		let data = {};
		for (key in $scope.reservationForm) {
			if(key === 'checkin' || key === 'checkout') {
				data[key] = dateFormat($scope.reservationForm[key].value);
			} else {
				data[key] = $scope.reservationForm[key].value;
			}
		}
		$scope.loading = true;
		$http.post('controller/server.php?action=save-reservation', data).then(
			(response) => {
				$scope.loading = false;
				if(!response.data.success) {
					$scope.response = true;
					$scope.message = response.data.message;
					$timeout(() => { $scope.response = false; }, 5000);
					return;
				}

				$scope.success = true;
				for (key in $scope.reservationForm) {
					if($scope.reservationForm[key].required) {
						if(key === 'vip') $scope.reservationForm[key].value = 'no';
						else $scope.reservationForm[key].value = '';
						$scope.reservationForm[key].valid = true;
					}
				}

				$scope.confirm.name = response.data.name;
				$scope.confirm.total = response.data.total;
				$scope.confirm.checkin = response.data.checkin;
				$scope.confirm.checkout = response.data.checkout;
			},
			(error) => {
				$scope.loading = false;
				$.toast({
					heading: 'Error',
					text: 'Ops! Algo de errado ocorreu... Tente novamente mais tarde.',
					position: 'bottom-right',
				});
				console.log(error);
			}
		);
	}
});

// === contact controller ====================================================================
app.controller('contatoController', function($scope){
	console.log('contato works!');
})

function dateFormat(data) {
	const dia = data.split("/")[0];
	const mes = data.split("/")[1];
	const ano = data.split("/")[2];
	return ("0"+dia).slice(-2)+'-'+("0"+mes).slice(-2)+'-'+ano;
}