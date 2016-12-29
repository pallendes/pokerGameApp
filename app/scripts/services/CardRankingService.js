'use strict';

angular
    .module('pokerGameApp')
    .factory('CardRankingService', CardRankingService);

function CardRankingService() {
    
    var CARD_WEIGHT = [];
    
    CARD_WEIGHT['2'] = 1;
    CARD_WEIGHT['3'] = 2;
    CARD_WEIGHT['4'] = 3;
    CARD_WEIGHT['5'] = 4;
    CARD_WEIGHT['6'] = 5;
    CARD_WEIGHT['7'] = 6;
    CARD_WEIGHT['8'] = 7;
    CARD_WEIGHT['9'] = 8;
    CARD_WEIGHT['10'] = 9;
    CARD_WEIGHT['J'] = 10;
    CARD_WEIGHT['Q'] = 11;
    CARD_WEIGHT['K'] = 12;
    CARD_WEIGHT['A'] = 13;
    
    var RANKING_WEIGHT = [];
    
    RANKING_WEIGHT['HIGH_CARD'] = 1;
    RANKING_WEIGHT['PAIR'] = 2;
    RANKING_WEIGHT['TWO_PAIRS'] = 3;
    RANKING_WEIGHT['THREE_OAK'] = 4;
    RANKING_WEIGHT['STRAIGHT'] = 5;
    RANKING_WEIGHT['FLUSH'] = 6;
    RANKING_WEIGHT['FULL_HOUSE'] = 7;
    RANKING_WEIGHT['FOUR_OAK'] = 8;
    RANKING_WEIGHT['STRAIGHT_FLUSH'] = 9;
    RANKING_WEIGHT['ROYAL_FLUSH'] = 10;
    
    
    var service = {};
    var cards = [];
    var rankings = [];
    
    service.setHand = setHand;
    service.findRankings = findRankings;
    service.getRankeableHand = getRankeableHand;
    service.tieBreak = tieBreak;
    service.getRanking = getRanking;
    service.getRankingWeight = getRankingWeight;
    service.getWinnerHand = getWinnerHand;
    
    return service;
    
    function setHand(_cards) {
        cards = [];
        rankings = [];
        cards = angular.copy(_cards);
        assignWeight();
    }
    
    function findRankings() {
        
        checkForStraight();
        checkForPairs();
        chekForNOAK();
        checkForFlush();
        checkForFullHouse();
        checkForStraightAndRoyalFlush();
        sortRanking();
        
        console.log(rankings);
        
        return rankings;
    }
    
    function getWinnerHand(rankingA, rankingB) {
        
        var winner = 0;
        var a = getRankingWeight(rankingA);
        var b = getRankingWeight(rankingB);
        
        if (a > b)
            winner = -1;
        else if (a < b)
            winner = 1;
        else 
            winner = 0;
            
        return winner;
        
    }
    
    function checkForStraight() {
        
        var conseq = 1;
        
        for (var i = cards.length - 1; i > 0 ; i--) {
            if (cards[i].weight == cards[i-1].weight - 1)
                conseq++;
            else
                conseq = 1;
            if (conseq == 4)
                rankings.push('STRAIGHT')
        }
                
    }
    
    function checkForFlush() {
        
        var h_s = 0, c_s = 0, s_s = 0, d_s = 0; 
        
        cards.forEach(function(card) {
             switch(card.suit) {
                 case 'spade': s_s ++
                     break;
                case 'clap': c_s ++
                    break;
                case 'heart': h_s ++
                     break;
                case 'diamond': d_s ++
                     break;
             }
        });
                     
        if (h_s === 5 || c_s === 5 || h_s === 5 || d_s === 5) 
            rankings.push('FLUSH');
        
    }
    
    function checkForPairs() {
        
        var pairsCount = 0;
        
        for ( var i = 1; i < cards.length; i++ ){
            if(cards[i - 1].number === cards[i].number) {
                pairsCount ++;
                i ++;
            }
        }
        
        if (pairsCount === 1) {
            rankings.push('PAIR')
        } else if (pairsCount === 2) {
            rankings.push('TWO_PAIRS')             
        }
        
    }
    
    function checkForFullHouse() {
        
        if (rankings.indexOf('TWO_PAIRS') > -1 && rankings.indexOf('THREE_OAK') > -1) {
            rankings.push('FULL_HOUSE');             
        }
                     
    }
    
    function checkForStraightAndRoyalFlush() {
        if(rankings.indexOf('STRAIGHT') > -1 && rankings.indexOf('FLUSH') > -1) {
            
            if (sumWeight(cards) === 55) {
                rankings.push('ROYAL_FLUSH')
            }
            
            rankings.push('STRAIGHT_FLUSH')
        }
    }
                     
    function chekForNOAK() {
        
        var groupedNumbers = [];
        var repeatedCards = 0;
    
        cards.forEach(function(card) {
            groupedNumbers[card.number] = (groupedNumbers[card.number] || 0) + 1; 
        });
        
        repeatedCards = Math.max.apply(Math, Object.values(groupedNumbers));
                
        if(repeatedCards === 4) {
            rankings.push('FOUR_OAK');   
        } if (repeatedCards === 3) {
            rankings.push('THREE_OAK');
        }
        
    }
        
    function sortRanking() {
        rankings.sort(function(a, b) { return b - a });
    }
    
    function tieBreak(currentHand, opponentHand) {
        
        var a = sumWeight(currentHand);
        var b = sumWeight(opponentHand)
        var winner = 0;
        
        if (a > b)
            winner = -1;
        else if (a < b) 
            winner = 1;
        else 
            winner = 0;
        
        //high card will be the winner
        if (winner === 0) {
             for (var i = 0; i < 5; i ++) {
                if (currentHand[i].weight > opponentHand[i].weight)
                    winner = -1;
                else if (currentHand[i].weight < opponentHand[i].weight)
                    winner = 1;
            }
        }
            
        return winner;

    }
    
    function getRanking() {
        return rankings;
    }
        
    function assignWeight() {
        
        cards.forEach(function(card) {
            card.weight = CARD_WEIGHT[card.number + '']; 
        });      

        cards.sort(function(a, b) {
            return b.weight - a.weight;
        });
        
    }
    
    function sumWeight(cards) {
                    
        var sum = 0;

        cards.forEach(function(card) {
            sum = sum + card.weight;
        })
        
        return sum;
            
    }
    
    function getRankingWeight(rankings) {
        
        var maxRankingWeight = 0;
        
        rankings.forEach(function (ranking) {
            
            if (RANKING_WEIGHT[ranking] > maxRankingWeight) {
                maxRankingWeight = RANKING_WEIGHT[ranking];
            }
            
        })
        
        return maxRankingWeight;
        
    }
    
    function getRankeableHand(){
        return cards;
    }
    
}