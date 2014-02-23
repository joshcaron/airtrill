var jukebox = angular.module('McJukeboxApp', []);

jukebox.controller('McJukeboxControl', function ($scope) {
  $scope.play = 0;
});

jukebox.controller('McJukeboxWrapper', function ($scope) {
  $scope.number = "+1 617 555 1234";
  $scope.base_url = "https://w.soundcloud.com/player/?url="
});

jukebox.controller('McJukeboxPlaylistControl', function ($scope) {
  $scope.tracks = [];
});

jukebox.controller('McJukeboxCurrentControl', function ($scope, $sce) {
  $scope.track = "http://api.soundcloud.com/pitbull/pitbull-timber-featuring-ke-ha"
  
  $scope.elem = "sc-widget";

  getIframe = function() {
    return $('#' + $scope.elem)[0]
  }

  $scope.pause = function() {
    SC.Widget(getIframe()).pause();
  };
  
  $scope.play = function() {
    SC.Widget(getIframe()).play();
  }
  
  $scope.track_url = $sce.trustAsResourceUrl($scope.base_url + $scope.track);
});