var jukebox = angular.module('McJukeboxApp', []);

jukebox.service("RequestedSongs", function($http) {
  return {
    getRequestedSongs: function(callback) {
      songs = []
      $http.jsonp("http://music.turtles.io/texts?callback=JSON_CALLBACK").
        success(function(data, status, headers, config) {
          count = data.length;
          $.each(data, function(i, query) {
             SC.get('/tracks', { q: query.song }, function(tracks) {
               songs.push(tracks[0]);
               if (!--count) callback(songs);
             });
          });
        }).
        error(function(data, status, headers, config) {
          callback([]);
        });
    }
  }
});

jukebox.controller('McJukeboxControl', function ($scope) {
  $scope.play = 0;
});

jukebox.controller('McJukeboxWrapper', function ($scope, RequestedSongs) {
  $scope.number = "+1 617 555 1234";
  $scope.base_url = "https://w.soundcloud.com/player/?auto_play=true&url="
  
  RequestedSongs.getRequestedSongs(function(songs) {
    $scope.playlist = songs;
    $scope.$apply();
  });
  
  $scope.loadTrack = function($event) {
    $scope.$broadcast('playTrack', {url: $($event.target).data('url')});
  }
});

jukebox.controller('McJukeboxPlaylistControl', function ($scope, $http) {

});

jukebox.controller('McJukeboxCurrentControl', function ($scope) {
    
  $scope.$on('trackPlaying', function(e, songInfo) {
    if (songInfo) {
      $scope.title = songInfo.title;
      $scope.artwork = songInfo.artwork_url;
      $scope.$apply();
    }
  });

  $scope.pause = function() {
    $scope.$broadcast("pause");
  };
  
  $scope.play = function() {
    $scope.$broadcast("play");
  };
  
});

jukebox.controller('McJukeboxSoundCloudPlayerControl', function($scope, $sce) {
  
  // Memoized widget returner
  widget = function() {
    if (!$scope.widget) {
      $scope.widget = SC.Widget($('#sc-widget')[0]);
    }
    return $scope.widget;
  };
  
  $scope.$on('playTrack', function(e, track) {
    $scope.track_url = $sce.trustAsResourceUrl($scope.base_url + track.url);
    widget().load($scope.track_url, {callback: function() {
      widget().getCurrentSound(function(currentSound) {
        $scope.$emit('trackPlaying', currentSound);
      });
    }});
  });
  
  $scope.$on('pause', function() {
    widget().pause();
  });
  
  $scope.$on('play', function() {
    widget().play();
  });
  
  $scope.init = function() {
    console.log("Init sound player");
  };
});