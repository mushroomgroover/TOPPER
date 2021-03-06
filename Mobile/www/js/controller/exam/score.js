angular.module('topper.examScoreCtrl', [])

.controller('ExamScoreCtrl', function(
	$scope,
	$state,
	$localStorage,
    $sessionStorage,
	Http,
	Cache,
	LocalStorage
) {

	function getObjectByValue(array, key, value) {
		var _answer = undefined;
		array.some(function(item, index) {
			if (item[key] === value) {
				_answer = array[index].choice;
				return true;
			}
		});
		return _answer;
	}

	function countScore(array) {
		var _score = 0;
		array.forEach(function(item, index) {
			if (item.is_answer === 1) {
				_score++;
			}
		});
		return _score;
	}

	$scope.$on('$ionicView.beforeEnter', function (event) {
		$scope.examData = $localStorage.examAnswers;

		if ($scope.examData === undefined) {
			$state.go('menu.home');
		}
	});

	$scope.$on('$ionicView.enter', function (e) {
		$scope.questions = $scope.examData.questions;
        $scope.answers   = $scope.examData.answers;
        $scope.time      = $scope.examData.time;
        $scope.results   = $scope.getResult();

        $scope.score      = countScore($scope.results);
		$scope.total      = $scope.results.length;
		$scope.percentage = ($scope.score / $scope.results.length) * 100;

		if ($scope.examData.examType === 'mock') {
			LocalStorage.storeExam({
				user_id : $sessionStorage.auth.id,
				raw_score : $scope.score,
				total_score : $scope.total,
				percentage : $scope.percentage,
				time : $scope.time
			});
		}

		// Chart data
        $scope.chartLabels = ['Correct', 'Incorrect'];
		$scope.chartData   = [$scope.score, $scope.total - $scope.score];
		$scope.chartColors = ['#009900', '#ff0000'];
		// $scope.chartOptions = { elements: { arc: { borderColor: 'black' } } };
	});

	$scope.goResults = function() {
		Cache.set('ExamResults', $scope.results);
		$state.go('menu.exam_result');
	}

	$scope.getResult = function() {
		var _result = [];
		if ($scope.questions) {
			$scope.questions.forEach(function(item, index) {
				var oData = {
					question_id: item.id,
					question_text: item.text,
					question_rationale: item.rationale,
					question_answer: getObjectByValue(item.selections, 'isAnswer', 1),
					answer: $scope.answers[index].choice,
					is_answer: $scope.answers[index].isAnswer
				};
				_result[index] = oData;
			});
			return _result;
		}
	}

	$scope.goExam = function() {
		$state.go('menu.exam_index', {type: $scope.examData.examType});
	}
});

