'use strict';

describe('CardRankingService tests of functions', function () { 

    beforeEach(module('pokerGameApp'));
    
    var rankingService;
    
    var mockHand = [{number: "7",suit: "diamond"},{number: "9",suit: "diamond"}, {number: "2",suit: "diamond"},{number: "A",suit: "diamond"}, 
                    { number: "Q",suit: "diamond"}];
    var towPairHand = [{number: "7",suit: "diamond"},{number: "7",suit: "diamond"}, {number: "2",suit: "diamond"},{number: "A",suit: "diamond"}, 
                { number: "Q",suit: "diamond"}];
    var threeOAKHand = [{number: "7",suit: "diamond"},{number: "7",suit: "diamond"}, {number: "7",suit: "diamond"},{number: "A",suit: "diamond"}, 
                { number: "Q",suit: "diamond"}];
    var fourOAKHand = [{number: "7",suit: "diamond"},{number: "Q",suit: "diamond"}, {number: "Q",suit: "diamond"},{number: "Q",suit: "diamond"}, 
                { number: "Q",suit: "diamond"}];
    var straightHand = [{number: "2",suit: "diamond"},{number: "3",suit: "diamond"}, {number: "4",suit: "diamond"},{number: "5",suit: "diamond"}, 
                { number: "Q",suit: "diamond"}];
    var straightHand_2 = [{number: "5",suit: "diamond"},{number: "7",suit: "diamond"}, {number: "6",suit: "diamond"},{number: "8",suit: "diamond"}, 
                { number: "Q",suit: "diamond"}];
    var fullHouseHand = [{number: "5",suit: "diamond"},{number: "2",suit: "diamond"}, {number: "2",suit: "diamond"},{number: "5",suit:"diamond"}, 
                { number: "5",suit: "diamond"}];
    var royalFlushHand = [{number: "10",suit: "diamond"},{number: "Q",suit: "diamond"}, {number: "J",suit: "diamond"},{number:   "A",suit:"diamond"}, { number: "K",suit: "diamond"}];
    var badHand = [{number: "10",suit: "diamond"},{number: "4",suit: "spade"}, {number: "8",suit: "diamond"},{number:   "2",suit:"diamond"},              {number: "6",suit: "hearth"}];
    
    
    var handCards = [];
    
    beforeEach(inject(function (_CardRankingService_) {
        rankingService = _CardRankingService_;
        rankingService.setHand(mockHand);
        handCards = rankingService.getRankeableHand();
    }));
    
    it('Should be sorted desc', function() {
        expect(handCards[0].number).toEqual('A');
        expect(handCards[1].number).toEqual('Q');
        expect(handCards[2].number).toEqual('9');
        expect(handCards[3].number).toEqual('7');
        expect(handCards[4].number).toEqual('2');
    });
    
    it('Should assign weight to cards', function(){
        expect(handCards[0].weight).toEqual(13);
        expect(handCards[1].weight).toEqual(11);
        expect(handCards[2].weight).toEqual(8);
        expect(handCards[3].weight).toEqual(6);
        expect(handCards[4].weight).toEqual(1);
    });
    
    it('Should contains THREE_OAK hand', function() {
        rankingService.setHand(threeOAKHand);
        rankingService.findRankings();
        var rankings = rankingService.getRanking();
        expect(rankingExists(rankings, 'THREE_OAK')).toBe(true); 
    });
    
    it('Should contains FOUR_OAK hand', function() {
        rankingService.setHand(fourOAKHand);
        rankingService.findRankings();
        var rankings = rankingService.getRanking();
        expect(rankingExists(rankings, 'FOUR_OAK')).toBe(true); 
    });
        
    it('Should contains STRAIGHT hand', function() {
        rankingService.setHand(straightHand);
        rankingService.findRankings();
        var rankings = rankingService.getRanking();
        expect(rankingExists(rankings, 'STRAIGHT')).toBe(true); 
    });
    
    it('Should be a FLUSH hand', function() {
        rankingService.setHand(straightHand);
        rankingService.findRankings();
        var rankings = rankingService.getRanking();
        expect(rankingExists(rankings, 'FLUSH')).toBe(true); 
    });
    
    it('Should contains FULL_HOUSE hand', function() {
        rankingService.setHand(fullHouseHand);
        rankingService.findRankings();
        var rankings = rankingService.getRanking();
        expect(rankingExists(rankings, 'FULL_HOUSE')).toBe(true); 
    });
    
    it('Should contains an STRAIGHT_FLUSH hand', function() {
        rankingService.setHand(straightHand);
        rankingService.findRankings();
        var rankings = rankingService.getRanking();
        expect(rankingExists(rankings, 'STRAIGHT_FLUSH')).toBe(true); 
    });
    
    it('Should contains an ROYAL_FLUSH hand', function() {
        rankingService.setHand(royalFlushHand);
        rankingService.findRankings();
        var rankings = rankingService.getRanking();
        expect(rankingExists(rankings, 'ROYAL_FLUSH')).toBe(true); 
    });
    
    it('Should return the max ranking weight', function() {
        rankingService.setHand(royalFlushHand);
        rankingService.findRankings();
        var rankings = rankingService.getRanking();
        expect(rankingService.getRankingWeight(rankings)).toBe(10); 
    });
    
    it('Should get the winner hand (a)', function() {
        rankingService.setHand(royalFlushHand);
        rankingService.findRankings();
        var rankingA = rankingService.getRanking();
        rankingService.setHand(straightHand);
        rankingService.findRankings();
        var rankingB = rankingService.getRanking();
        expect(rankingService.getWinnerHand(rankingA, rankingB)).toBe(-1); 
    });
    
    it('Should be a tie', function() {
        rankingService.setHand(straightHand);
        rankingService.findRankings();
        var rankingA = rankingService.getRanking();
        rankingService.setHand(straightHand_2);
        rankingService.findRankings();
        var rankingB = rankingService.getRanking();
        expect(rankingService.getWinnerHand(rankingA, rankingB)).toBe(0); 
    });
    
    it('Should break the tie', function() {
        rankingService.setHand(straightHand);
        rankingService.findRankings();
        var _straightHand = rankingService.getRankeableHand();
        var rankingA = rankingService.getRanking();
        rankingService.setHand(straightHand_2);
        rankingService.findRankings();
         var _straightHand_2 = rankingService.getRankeableHand();
        var rankingB = rankingService.getRanking();
        expect(rankingService.getWinnerHand(rankingA, rankingB)).toBe(0); 
        expect(rankingService.tieBreak(_straightHand, _straightHand_2)).toBe(1);
    });
    
    function rankingExists(rankings, element) {
        for (var r in rankings) {
            if (rankings[r] === element) return true;
        }
        
        return false;
    }
    
});