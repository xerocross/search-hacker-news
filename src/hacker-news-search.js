let template = require("./hacker-news-search-template").template;


angular.module("hackerNewsSearchApp",[])
.directive("hackerNewsSearch", function() {
    return {
        template: template,
        controller : ["$scope", "$q", "hackerNewsService", function($scope, $q, hackerNewsService) {

            $scope.loading = true;
            $scope.topStoriesIndex = [];
            $scope.items = {};
            $scope.searchText = "";

            $scope.getItem = function(id) {
                $scope.items[id] = {};
                $scope.items[id].loading = true;
                $scope.items[id].error = false;
                hackerNewsService.getStory(id)
                    .then((response) => {
                        if (response.status == "SUCCESS") {
                            $scope.items[id].data = response.data;
                            $scope.items[id].loading = false;
                        } else {
                            $scope.items[id].loading = false;
                            $scope.items[id].error = true;
                        }
                    });
            }

            hackerNewsService.getTopStoriesIndex()
            .then((response)=>{
                let promises = [];
                $scope.topStoriesIndex = response.topStoriesIndex;
                $scope.topStoriesIndex.forEach((id) => {
                    promises.push(
                        $scope.getItem(id)
                    );
                });
                $q.all(promises)
                .then(()=>{
                    $scope.loading = false;
                })
            })

        }]
    }
})

require("./hacker-news-service");