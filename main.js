//Uses bootstrap
var debug1 = 0;
var hc = {
    dollars : 0,
    recipes : 0,
    lineCooks : 0,
    restaurantCooks : 0,
    gourmetChefs : 0,
    cordonBleuChefs : 0,
    empathy : 0,
    openConcessions : 0.0,
    openland : 0,
    customers : 0,
    customersTurnedAway: 0,
    serviceRate : 0.5,
    salaryCost : 0,
    customerSatisfaction : 'Satisfied',
    customerOverflow: 0, //boolean for triggering when too many are in line.
    //serviceRate : 0, //how many customers get handled per game loop (per second).
    triggerNumber : 10,
    gameClock : 0,
    ingredients : {
        basic : 10,
        regular : 0,
        fancy : 0
    },
    stand : {
        total:1,
        staff : 'lineCook',
        ingredients : 'basic',
        require:{
            dollars:100,
            recipes:1,
            concessions:0
        }
    },
    truck : {
        total:0,
        staff : 'lineCook',
        require:{
            dollars:1000,
            recipes:5,
            concessions:1,
            foodtruckcooks:2
        }
    },
    diner : {
        total: 0,
        staff : 'lineCook',
        require:{
            dollars: 7000,
            recipes: 15,
            dinercooks: 3,
            land: 1
        }
    },
    ingredientCost : {
        basic : 0.25
    }
};

var everySecondTick = 0,
everyThirdTick = 0,
everyFifthTick = 0;
every60Tick = 0;

function save(){
    var save = {
        meals: hc.dollars,
        cooks: hc.lineCooks,
        empathy: hc.empathy
    }
    localStorage.setItem("save",JSON.stringify(save));
}
function restoreGame (){
    var savedgame = JSON.parse(localStorage.getItem("save"));
    if (typeof savedgame.dollars !== "undefined") hc.dollars = savedgame.dollars;
    if (typeof savedgame.cooks !== "undefined") hc.lineCooks = savedgame.cooks;
    if (typeof savedgame.empathy !== "undefined") hc.emapthy = savedgame.emapthy;

}
function prettify(input){
    var output = (Math.round(input * 100)) / 100; //max 2 decimals
    return output;
}

function hotDogClick(number) {
    // called by "cook hot dog" button and engine. ALWAYS a hot dog stand.
    // num is the number of dollars I am wanting to make (customers to fulfill)

    var fulfill = function (num){
        hc.customers -= num;
        hc.ingredients.basic -= num; //assume 1 per meal.
        hc.dollars += num;
        $("#dollars").text(hc.dollars);
        $("#basicingredients").text(hc.ingredients.basic); //display not updating correctly.
        $("#customers").text(hc.customers);
    }

    if (hc.customers > number) { //check enough customers to service
        if (hc.ingredients.basic > number) {
            fulfill(number); //enough of everything.
        } else {
            fulfill(hc.ingredients.basic); // not enough ingredients. use all the ingredients.
            //****
            $("#customers").notify("Consider buying ingredients", {position: 'bottom'}, "info");
        }
    }
    else { // partial fulfillment
        var num = hc.customers; // reduce amount to fulfill to number of customers.
        if (hc.ingredients.basic > num) { // enough ingredients for reduced fulfillment.
            fulfill(num);
        }else {
            fulfill(hc.ingredients.basic) // not enough ingredients. use all the ingredients.
            $("#customers").notify("Consider buying ingredients", {position: 'bottom'}, "info");
        }
    }
}
function buyCook() {
    var cookCost = Math.floor(10 * Math.pow(1.1, hc.lineCooks));     //works out the cost of this chef
    if(hc.dollars >= cookCost){                                   //checks that the player can afford the chef
        hc.lineCooks = hc.lineCooks + 1;
        hc.salaryCost += cookCost;
        hc.dollars = hc.dollars - cookCost;                          //removes the dollars spent
        //document.getElementById('cooks').innerHTML = prettify(hc.lineCooks);  //updates the number of chefs for the user
        $("#cooks").text(prettify(hc.lineCooks));
        //document.getElementById('dollars').innerHTML = prettify(hc.dollars);  //updates the number of dollars for the user
        $("#dollars").text(prettify(hc.dollars));
    } else {
        //Notify.notify({message:"You don't have enough money", time: 500})
        $("#lineCookButton").notify("You need more money", "info", {position : "bottom"});
    }
    var nextCost = Math.floor(10 * Math.pow(1.1,hc.lineCooks));       //works out the cost of the next chef
    document.getElementById('cookCost').innerHTML = prettify(nextCost);  //updates the chef cost for the user
}

function createBuilding(name){
    //TODO: Create Buildings
}
function workLand(amount) {
    hc.openland += 1;
}
function workConcession(amount) {
    hc.openConcessions += 0.1
    console.log("Working concession");
}
function hireBuyer(cost){
    // a Buyer obtains ingredients for dollars.

}
function buyIngredients(type, number){
    // Ingredients are needed for dollars.
    // basic: Hot dog stand, food truck.
    //console.log("buyIngredients of type: " + type + " number " + number);
    if (type === 'basic'){
        if (hc.dollars > (hc.ingredientCost.basic * number)) {
            hc.ingredients.basic += 1;
            $("#basicingredients").text(hc.ingredients.basic);
            hc.dollars -= (hc.ingredientCost.basic * number);
            $("#dollars").text(hc.dollars);
        }
    }
}
function updateCustomers(arrivalRate){
    // called from game loop. Calculate how many customers arrive & update display

    //This code probably has some issues. It is to deal with 'anything * 0 = 0' problem.
    var tempRate;
    (hc.serviceRate)? tempRate = hc.serviceRate : tempRate = 1;
    hc.triggerNumber = 10 * tempRate;
    if (hc.customers < hc.triggerNumber){
        hc.customers += arrivalRate; //right now it's just one customer a second.
    }
    if (hc.customers >= hc.triggerNumber && hc.customerOverflow === 0){
            // too many customers in line
        //add a notify.js warning
        hc.customersTurnedAway += arrivalRate;
        hc.customers += Math.floor(arrivalRate/2);
        hc.customerOverflow = 1;
        $("#customers").notify("Too many customers waiting", {position: 'bottom'}, "info");
    }
    if (hc.customers < (hc.triggerNumber-1) && hc.customerOverflow){
        // the -1 is there to clamp hysteresis. Reset the warning.
        hc.customerOverflow = 0;
    }
    $("#customers").text(prettify(hc.customers));
}
function evalSatisfaction(){
    //called from game loop. Determine customer satisfaction
    $("#customersatisfaction").text(hc.customerSatisfaction);
}
function calcServiceRate (){ //rate as which dollars are served.
    hc.serviceRate = hc.lineCooks; //right now there are just line cooks available.
}
function paySalaries(){ //once a minute
    if (meals >= salaryCost){
        meals -= salaryCost;
        var message = "Paid Salaries of " + salaryCost;
        //TODO: Convert message to jquery bootstrap
        Notify.notify({message:message, time: 1000});
    }
    else if (bankLoans === 0){
        availableCash = meals;
        meals = 0;
        Notify.notify({message:"Not enough money for payroll. Took a loan from the bank", time: 500, location:"center"});
    }
    else { // already took a bank loan. Start firing staff
        //TODO: Implement how staff are fired.
    }
}
// *********** Game Clock Loop. Executes once per tick.
function clockLoop (){
    if (everySecondTick) {everySecondTick = 0;} else {everySecondTick++;}
    if (everyThirdTick === 2) {everyThirdTick = 0;} else {everyThirdTick++;}
    if (everyFifthTick === 4) {everyFifthTick = 0;} else {everyFifthTick++;}
    if (every60Tick === 59) {every60Tick = 0;} else {every60Tick++}

    calcServiceRate();
    updateCustomers(1); //just one a second for now.
    evalSatisfaction();
    if (!everySecondTick) {
        if (hc.serviceRate){(hc.serviceRate);} //decided on once every 2 seconds.
    }
    if (!every60Tick) {
        if (hc.salaryCost != 0){paySalaries();}
        // also pay for equipment rentals

    }
    //if (hc.customers === 8){clearInterval(gameClock);} Stop the game clock.
}

$(document).ready(function(){
    //what to do when page is loaded. Jquery.
    //Should probably move this to a 'start' button with an intro sometime.
    // and then call the game loop when the button is dismissed.

    $(".paneSelector").click(function(){  //whenever something with a class pane is clicked.
        var name = $(this).attr("id");
        $(".paneSelector").removeClass("selected");
        $(this).addClass("selected");
        $(".pane").hide();
        name = name.replace("select", "").toLowerCase() + "Pane";
        $("#" + name).show();
    });
    //This handles all buttons. data-func value MUST be the same as function name
    $(".actionbutton").click(function(){
        var func = $(this).data("func");
        var arglist = $(this).data("args");
        if (typeof (arglist) === 'number'){
            window[func](arglist);
        }
        if (typeof (arglist) === 'string') {
            var args = arglist.split(" ");
            window[func](args[0], args[1]); // assumes no more than two arguments
        }
    });

    $('#startmodal').modal();
    $.notify.defaults({autoHideDelay: 1000});

    $('#startmodal').on('hidden.bs.modal', function () {
        hc.gameClock = window.setInterval(function(){clockLoop()}, 1000); //Max update rate is 1/second
    })
});
