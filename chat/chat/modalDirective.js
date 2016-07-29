angular.module('mainModule').directive('modal', function () {
    return {
      template: 
         '<div class="modal fade">' +
            '<div class="modal-dialog modal-lg">' + 
                '<div class="modal-content">' +
                    '<div class="modal-body" ng-transclude>' + 
                    '</div>' + 
                '</div>' +
            '</div>' + 
          '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function (scope, element, attrs) {
        scope.title = attrs.title;
        scope.modalclass = attrs.modalclass;
      }
    };
});