'use strict';

/**
 * @ngdoc function
 * @name pokerGameApp.controller:PockerTableController
 * @description
 * # MainCtrl
 * Controller of the pokerGameApp3App
 */
angular.module('pokerGameApp')
  .controller('PokerTableController', PockerTableController);

PockerTableController.$inject = ['DealerService', 'CardRankingService'];

function PockerTableController(dealerService, rankingService) {
    
    var vm = this;
    
    var TOTAL_CARDS = 5;
    var lastDealingRequestCurrent;
    var lastDealingRequestOpponent;
    
    vm.toggleSelectCard = toggleSelectCard;
    vm.dealCards= dealCards;
    vm.toggleOpponentCardsVisibility = toggleOpponentCardsVisibility;
    vm.replaceSelectedCards = replaceSelectedCards;
    vm.retryDealing = retryDealing;
    vm.restartGame = restartGame;
    vm.checkForAWinner = checkForAWinner;
    
    init();
    
    function init() {
        
        lastDealingRequestCurrent = 0;
        lastDealingRequestOpponent = 0;
        
        vm.currentHand = [];
        vm.opponentHand = [];
        vm.opponentHandError = false;
        vm.currentHandError = false;
        vm.isDealingCurrentHand = false;
        vm.isDealingOpponentHand = false;

        
        dealCards(TOTAL_CARDS, 'current');
        dealCards(TOTAL_CARDS, 'opponent');
    }
    
    function retryDealing(player) {
        player === 'current' ?
            dealCards(lastDealingRequestCurrent, player) :
            dealCards(lastDealingRequestOpponent, player);       
    }
    
    function restartGame() {
        dealerService.restartGame();
        init();
    }
    
    function dealCards(numberOfCards, playerHand){
        
        if (playerHand === 'current') {
            vm.isDealingCurrentHand = true;
        } else {
            vm.isDealingOpponentHand = true;
        }
            
        dealerService.dealCards(numberOfCards)
            .then(function(cards){
                
                if (playerHand === 'current') {
                    vm.currentHandError = false;
                    vm.isDealingCurrentHand = false;
                    vm.currentHand = vm.currentHand.length === 0 ? addProperties(cards, playerHand) : replaceCards(cards, playerHand);
                } else {
                    vm.opponentHandError = false;
                    vm.isDealingOpponentHand = false;
                    vm.opponentHand = addProperties(cards, playerHand);
                }
            
            }).catch(function(e){
                
                console.log(e);
            
                if (angular.isDefined(e.status)) {
                    
                    if (e.status === 404) {
                        alert('The dealer lost the his deck!, the game ends here...');
                        init();
                    } else if(e.status === 405) {
                        alert('There are not enough cards!');
                    } else {
                        
                        if (playerHand === 'current') {
                            vm.currentHandError = true;
                            vm.isDealingCurrentHand = false;
                            lastDealingRequestCurrent = numberOfCards;
                        } else {
                            vm.opponentHandError = true;
                            vm.isDealingOpponentHand = false;
                            lastDealingRequestOpponent = numberOfCards;
                        }       
                        
                    }
                    
                }
            
            });
                    
    }
        
    function toggleSelectCard(card) {
        card.selected = !card.selected;
    }
    
    function toggleOpponentCardsVisibility() {
        angular.forEach(vm.opponentHand, function(card) {
           card.visible = !card.visible; 
        });
    }
    
    function replaceSelectedCards(player) { 
        var cards = player === 'current' ? vm.currentHand : vm.opponentHand;
        var selectedCardsCount = 0;
        angular.forEach(cards, function(card) {
            if (card.selected) selectedCardsCount ++
        })
        dealCards(selectedCardsCount, player);
    }
    
    function addProperties(cards, player) {
        
        var _cards = angular.copy(cards);
        
        if (_cards !== undefined) {
            _cards.forEach(function(card){
                if(!card.hasOwnProperty('visible') && !card.hasOwnProperty('selected')) {
                    card.visible = player === 'current' ? true : false;
                    card.selected = false;
                }
            });
        }
        
        return _cards;
        
    }
    
    function checkForAWinner() {
        
        var _currentHand = [];
        var _opponentHand = [];
        var currentHandRanking = [];
        var opponentHandRanking = [];
        
        rankingService.setHand(vm.currentHand);
        _currentHand = rankingService.getRankeableHand();
        currentHandRanking = rankingService.findRankings();
        
        rankingService.setHand(vm.opponentHand);
        _opponentHand = rankingService.getRankeableHand();
        opponentHandRanking = rankingService.findRankings();
        
        var winnerHand = rankingService.getWinnerHand(currentHandRanking, opponentHandRanking);
        
        if (winnerHand === -1) {
            alert('You win, you have these possible hand combinations: [' + (currentHandRanking.length > 0 ? currentHandRanking.join(' ') 
                  : '0') + '] while your opponent has  [' + (opponentHandRanking.length > 0 ? opponentHandRanking.join(' ') 
                  : '0') + ']');
        } else if (winnerHand === 1) {
            alert('You loose, you have these possible hand combinations: [' + (currentHandRanking.length > 0 ? currentHandRanking.join(' ') 
                  : '0') + '] while your opponent has these  [' + (opponentHandRanking.length > 0 ? opponentHandRanking.join(' ') 
                  : '0') + '] combinations.');
        } else {
            
            winnerHand = rankingService.tieBreak(_currentHand, _opponentHand);
            
            if (winnerHand === -1) {
                alert('You win, you have these possible hand combinations: [' + (currentHandRanking.length > 0 ? currentHandRanking.join(' ') 
                  : '0')
                  + '] while your opponent has  [' + (opponentHandRanking.length > 0 ? opponentHandRanking.join(' ') 
                  : '0') + '], but you have the mayor cards.');
            } else if (winnerHand === 1) {
                alert('You loose, you have these possible hand combinations: [' + (currentHandRanking.length > 0 ? currentHandRanking.join(' ') 
                  : '0') + '] while your opponent has  [' + (opponentHandRanking.length > 0 ? opponentHandRanking.join(' ') 
                  : '0') + '], but your opponent has the mayor cards.');
            } else {
                alert('It\'s a tie!!!');
            }
            
        }

    }
    
    function replaceCards(newCards, player) {
        
        var _cards = [];
        
        if (player === 'current') {
            _cards = vm.currentHand;
        } else {
            _cards = vm.opponentHand;
        }
        
        if (!(newCards instanceof Array)) {
            newCards = [newCards];
        }
        
        var newCardIndex = 0;
        
        angular.forEach(_cards, function(card) {
             if (card.selected) {
                card.number = newCards[newCardIndex].number; 
                card.suit = newCards[newCardIndex].suit; 
                card.selected = false;
                newCardIndex ++;
             }
        });
        
        return _cards;
        
    }
    
    

}