angular.module('chatModule').directive('modal', function () {
    return {
      template: 
         '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' + 
                '<div class="modal-content">' +
                   '<div class="modal-header bg-success">' + 
                      '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
                    '</div>' +
                    '<div class="modal-body" ng-transclude>' + 
                    '</div>' + 
                  '<div class="modal-footer bg-success">' +  
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