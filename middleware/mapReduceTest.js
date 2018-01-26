var mapFunction = function(){
    emit(this.campaignID, {count: 1, amount: this.amount, createdAt : this.createdAt})
    }


var redFunction = function(campaignID,amount){
    var value = {count: 0, total: 0, daily: [{date: Date(), amount: 0}]} 
     amount_sorted = amount.sort(function(a, b){return b-a})
    for(i=0; i<amount_sorted.length; i++){
//        value.createdAt = amount[i].createdAt
        value.count += amount_sorted[i].count; 
        value.total += amount_sorted[i].amount; 
        //value.daily[i].date = amount[i].createdAt
        //console.log(amount[i].createdAt)
        value.daily[i] = {date: amount_sorted[i].createdAt, amount_sorted: value.total}
        }
        return value;
    }

db.comments.mapReduce(mapFunction,redFunction,{out: "map_ex_1"});

db.map_ex_1.find().pretty()