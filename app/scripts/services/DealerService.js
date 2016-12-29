'use strict'

angular
    .module('pokerGameApp')
    .factory('DealerService', DealerService);

DealerService.$inject = ['$http', '$q']

function DealerService($http, $q) {
    
    var BASE_URL = 'http://dealer.internal.comparaonline.com:8080';
        
    var service = {};
    var deckToken = '';
    
    service.getDeck = getDeck;
    service.dealCards = dealCards;
    service.restartGame = restartGame;
    service.verifyWinner = verifyWinner;
    
    return service;
    
    function getDeck() {
       
        var d = $q.defer();
        
        $http.post(BASE_URL + '/deck')
            .then(function(response) {
                deckToken = response.data;
                d.resolve();
            }, function(errorResponse) {
                console.log(errorResponse.data);
                d.reject(errorResponse);
            })
        
        return d.promise;
        
    }
    
    function restartGame() {
        deckToken = '';
    }
    
    function dealCards(number) {
        
        var d = $q.defer();
        
        if (!deckToken) {
            getDeck().then(function(){
                return getCards(number);
            }).then(function(cards){
                d.resolve(cards);
            }).catch(function(error){
                d.reject(error);         
            })
        } else {
            getCards(number).then(function(cards){
                d.resolve(cards);
            }).catch(function(error){
                d.reject(error);
            })
        }
            
        return d.promise;
                
    }
    
    function getCards(number) {
        
        var d = $q.defer();
        
        $http.get(BASE_URL + '/deck/' + deckToken + '/deal/' + number)
            .then(function(response) {
                d.resolve(angular.copy(response.data));
            }, function(errorResponse) {
                console.log(errorResponse.data);
                d.reject(errorResponse);
            })
        
        return d.promise;
        
    }
    
    function verifyWinner(currentHand, opponentHand) {
        
        
        
    }
    
}