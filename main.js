//Uses notify: https://github.com/sbkwgh/Notify

var hc = {
    meals : 0, //basically dollars - meals served
    recipes : 0,
    lineCooks : 0,
    empathy : 0,
    openConcessions : 0.0,
    openland : 0,
    customers : 0,
    serviceRate : 0,
    salaryCost : 0,
    customerSatisfaction : 'Satisfied',
    serviceRate : 0,
    stand : {
        total:0,
        require:{
            dollars:100,
            recipes:1,
            concessions:0
        }
    },
    truck : {
        total:0,
        require:{
            dollars:1000,
            recipes:5,
            concessions:1,
            foodtruckcooks:2
        }
    },
    diner : {
        total: 0,
        require:{
            dollars: 7000,
            recipes: 15,
            dinercooks: 3,
            land: 1
        }
    }
}
var everySecondTick = 0.
everyThirdTick = 0,
everyFifthTick = 0;
every60Tick = 0;

function save(){
    var save = {
        meals: hc.meals,
        cooks: hc.lineCooks,
        empathy: hc.empathy
    }
    localStorage.setItem("save",JSON.stringify(save));
}
function restoreGame (){
    var savedgame = JSON.parse(localStorage.getItem("save"));
    if (typeof savedgame.meals !== "undefined") hc.meals = savedgame.meals;
    if (typeof savedgame.cooks !== "undefined") hc.lineCooks = savedgame.cooks;
    if (typeof savedgame.empathy !== "undefined") hc.emapthy = savedgame.emapthy;

}
function prettify(input){
    var output = (Math.round(input * 10000000)) / 10000000;
    return output;
}

function chefClick(number) {
    // called by "cook meal" button.
    // does not affect service rate, since a single click.

    if (hc.customers >= number) {
        hc.customers -= number;
        hc.meals += number;
        document.getElementById("dollars").innerHTML = hc.meals;
    }
    else {
        var served = hc.customers;
        hc.customers = 0;
        hc.meals += served;
    }
    document.getElementById("customers").innerHTML = hc.customers;
};
function buyCook() {
    var cookCost = Math.floor(10 * Math.pow(1.1, hc.lineCooks));     //works out the cost of this chef
    if(hc.meals >= cookCost){                                   //checks that the player can afford the chef
        hc.lineCooks = hc.lineCooks + 1;
        hc.salaryCost += cookCost;
        hc.meals = hc.meals - cookCost;                          //removes the meals spent
        document.getElementById('cooks').innerHTML = prettify(hc.lineCooks);  //updates the number of chefs for the user
        document.getElementById('dollars').innerHTML = prettify(hc.meals);  //updates the number of meals for the user
    } else {
        Notify.notify({message:"You don't have enough money", time: 500})
    }
    var nextCost = Math.floor(10 * Math.pow(1.1,hc.lineCooks));       //works out the cost of the next chef
    document.getElementById('cookCost').innerHTML = prettify(nextCost);  //updates the chef cost for the user
};

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
function updateCustomers(){
    // called from game loop. Calculate how many customers arrive & update display
    hc.customers += 1;
    document.getElementById("customers").innerHTML = hc.customers;
}
function evalSatisfaction(){
    //called from game loop. Determine customer satisfaction
}
function calcServiceRate (){ //rate as which meals are served.
    hc.serviceRate = hc.lineCooks; //right now there are just line cooks available.
}
function paySalaries(){ //once a minute
    if (meals >= salaryCost){
        meals -= salaryCost;
        var message = "Paid Salaries of " + salaryCost;
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
// *********** Game Loop
window.setInterval(function(){
    if (everySecondTick) {everySecondTick = 0;} else {everySecondTick++;}
    if (everyThirdTick === 2) {everyThirdTick = 0;} else {everyThirdTick++;}
    if (everyFifthTick === 4) {everyFifthTick = 0;} else {everyFifthTick++;}
    if (every60Tick === 59) {every60Tick = 0;} else {every60Tick++}

    $("#customersatisfaction").text(hc.customerSatisfaction);
    calcServiceRate();
    updateCustomers();
    evalSatisfaction();
    if (!everySecondTick) {
        chefClick(hc.serviceRate);
    }
    if (!every60Tick) {
        if (hc.salaryCost != 0){paySalaries();}

    }
}, 1000); //Max update rate is 1/second.

$(document).ready(function(){
    //what to do when page is loaded. Jquery.
    $(".paneSelector").click(function(){  //whenever something with a class pane is clicked.
        var name = $(this).attr("id");
        $(".paneSelector").removeClass("selected");
        $(this).addClass("selected");
        $(".pane").hide();
        name = name.replace("select", "").toLowerCase() + "Pane";
        $("#" + name).show();
    });
    //This handles all buttons. data-func name MUST be the same as function name
    $(".actionbutton").click(function(){
        var func = $(this).data("func");
        var args = $(this).data("args");
        window[func](args);
    });

});
