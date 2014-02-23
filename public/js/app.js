var jukebox = angular.module('McJukeboxApp', []);

jukebox.service("RequestedSongs", function($http) {
  return {
    getRequestedSongs: function(callback) {
      songs = []
      $http.jsonp("http://airtrill.com/texts?callback=JSON_CALLBACK").
        success(function(data, status, headers, config) {
          data = _.filter(data, function(text) { return text.date > 1393168096; })
          debugger;
          data = _.sortBy(data, 'date');
          debugger;
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

jukebox.service("AccountService", function($http) {
  return {
    registerAccount: function(country, name, callback) {
      $http.jsonp("http://airtrill.com/new_account?country=" + country + "&name=" + name + "&callback=JSON_CALLBACK").
        success(function(data, status, headers, config) {
          callback(data);
        }).
        error(function(data, status, headers, config) {
          callback(false);
        });
    }
  }
});

jukebox.controller('McJukeboxRegisterControl', function($scope, AccountService) {
  $scope.country = "US";
  $scope.room_name = "";
  
  $scope.haveCookie = function() {
    return $.cookie("account") | false;
  };
  
  $scope.logout = function() {
    $.setCookie("account", {});
  };
  
  $scope.register = function() {
    AccountService.registerAccount($scope.country, $scope.room_name, function(response) {
      if (response) {
        $scope.room_name = response.account.name;
        $scope.phone = response.account.phone.friendly_name;
        $.setCookie("account", response);
      }
    });
  }
});

jukebox.controller('McJukeboxControl', function ($scope) {
  $scope.play = 0;
});

jukebox.controller('McJukeboxWrapper', function ($scope, $timeout, RequestedSongs) {
  $scope.number = "1 (508) 762-4751";
  $scope.base_url = "https://w.soundcloud.com/player/?auto_play=true&url="
  $scope.playlist_pointer = 0;
});

jukebox.controller('McJukeboxCurrentControl', function ($scope) {
    
  $scope.$on('trackPlaying', function(e, songInfo) {
    if (songInfo) {
      $scope.title = songInfo.title;
      $scope.artwork = songInfo.artwork_url ? songInfo.artwork_url : "";
      $scope.$apply();
    }
  });

});

jukebox.controller('McJukeboxPlaylistControl', function($scope, $timeout, RequestedSongs) {
  
  $scope.playlist = [];
  $scope.playlist_ids = [];
  
  $scope.current_track_id = 0;
  $scope.playlist_queue = []; // contains the IDs of songs we want to play
  
  $scope.skipped_tracks = []; // contains the IDs of songs we have skipped
  
  $scope.first_load = true;
  
  $scope.periodicRequest = function() {
    $timeout(function() {
      RequestedSongs.getRequestedSongs(function(songs) {
        $scope.playlist = songs;
        $scope.playlist_queue = $scope.playlist_ids = _.pluck($scope.playlist, 'id');
        $scope.$apply();
        
        if ($scope.first_load) {
          popSongStack();
          $scope.first_load = false;
        }
        
        $scope.$apply();
      });
    }, 1000)
  };
  
  popSongStack = function() {
    $scope.skipped_tracks.push($scope.current_track_id);
    $scope.playlist_queue = _.difference($scope.playlist_queue, $scope.skipped_tracks);
    $scope.current_track_id = _.first($scope.playlist_queue);
    console.log($scope.playlistToDisplay());
    $scope.$apply();
  };
  
  $scope.periodicRequest();
  
  $scope.playlistToDisplay = function() {
    _.filter($scope.playlist, function(track) {
      return _.contains($scope.playlist_queue, track.id);
    });
  }

  $scope.pause = function() {
    $scope.$broadcast("pause");
  };
  
  $scope.play = function() {
    $scope.$broadcast("play");
  };

  $scope.skip = function() {
    popSongStack();
  };
  
  $scope.$on('songFinished', function(e) {
    popSongStack();
  });
  
});

jukebox.controller('McJukeboxSoundCloudPlayerControl', function($scope, $sce) {
  
  // Memoized widget returner
  widget = function() {
    if (!$scope.widget) {
      $scope.widget = SC.Widget($('#sc-widget')[0]);
    }
    return $scope.widget;
  };
  
  $scope.$watch('current_track_id', function() {
    newId = $scope.current_track_id;
    if (newId > 0) {
      playSong = _.where($scope.playlist, {id: newId})[0]
      $scope.track_url = $sce.trustAsResourceUrl($scope.base_url + playSong.permalink_url)
      widget().load($scope.track_url, {callback: function() {
        widget().bind(SC.Widget.Events.FINISH, function() {
          console.log("Song done");
          $scope.$emit('songFinished');
        })
      
        widget().getCurrentSound(function(currentSound) {
          $scope.$emit('trackPlaying', currentSound);
        });
      }});
    }
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