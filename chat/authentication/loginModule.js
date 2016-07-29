angular.module('loginModule', ['chart.js', 'rzModule', 'ui.bootstrap', 'angular-svg-round-progressbar'])
.config(['$stateProvider', 'ChartJsProvider', function ($stateProvider, ChartJsProvider) {

	  // Configure all charts
    ChartJsProvider.setOptions({
      colours: ['#FF5252', '#FF8A80'],
      responsive: true
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
      datasetFill: false
    }); 
}]);
