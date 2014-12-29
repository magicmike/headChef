//Uses notify: https://github.com/sbkwgh/Notify
var meals = 0, //basically dollars - meals served
recipes = 0,
lineCooks = 0,
empathy = 0,
openconcessions = 0.0,
openland = 0,
customers = 0;
serviceRate = 0,
salaryCost = 0,
customerSatisfaction = 'Satisfied';

var everySecondTick = 0.
everyThirdTick = 0,
everyFifthTick = 0;
every60Tick = 0;

//Init types
var stand = {
    total:0,
    require:{
        dollars:100,
        recipes:1,
        concessions:0
    }
},
truck = {
        total:0,
        require:{
            dollars:1000,
            recipes:5,
            concessions:1,
            foodtruckcooks:2
        }
},
diner = {
    total: 0,
    require:{
        dollars: 7000,
        recipes: 15,
        dinercooks: 3,
        land: 1
    }
};

function save(){
    var save = {
        meals: meals,
        cooks: lineCooks,
        empathy: empathy
    }
    localStorage.setItem("save",JSON.stringify(save));
}
function restoreGame (){
    var savedgame = JSON.parse(localStorage.getItem("save"));
    if (typeof savedgame.meals !== "undefined") meals = savedgame.meals;
    if (typeof savedgame.cooks !== "undefined") lineCooks = savedgame.cooks;
    if (typeof savedgame.empathy !== "undefined") emapthy = savedgame.emapthy;

}
function prettify(input){
    var output = (Math.round(input * 10000000)) / 10000000;
    return output;
}

function chefClick(number) {
    // called by "cook meal" button.
    // does not affect service rate, since a single click.

    if (customers >= number) {
        customers -= number;
        meals += number;
        document.getElementById("dollars").innerHTML = meals;
    }
    else {
        var served = customers;
        customers = 0;
        meals += served;
    }
    document.getElementById("customers").innerHTML = customers;
};
function buyCook() {
    var cookCost = Math.floor(10 * Math.pow(1.1, lineCooks));     //works out the cost of this chef
    if(meals >= cookCost){                                   //checks that the player can afford the chef
        lineCooks = lineCooks + 1;
        salaryCost += cookCost;
    	meals = meals - cookCost;                          //removes the meals spent
        document.getElementById('cooks').innerHTML = prettify(lineCooks);  //updates the number of chefs for the user
        document.getElementById('dollars').innerHTML = prettify(meals);  //updates the number of meals for the user
    } else {
        Notify.notify({message:"You don't have enough money", time: 500})
    }
    var nextCost = Math.floor(10 * Math.pow(1.1,lineCooks));       //works out the cost of the next chef
    document.getElementById('cookCost').innerHTML = prettify(nextCost);  //updates the chef cost for the user
};

function paneSelect(name){
    if (name == 'ingredients'){
        document.getElementById("ingredientsPane").style.display = "block";
        document.getElementById("staffPane").style.display = "none";
        document.getElementById("buildingsPane").style.display = "none";
        document.getElementById("equipmentPane").style.display = "none";
        document.getElementById("recipesPane").style.display = "none";

        document.getElementById("selectIngredients").className = "paneSelector selected";
        document.getElementById("selectStaff").className = "paneSelector";
        document.getElementById("selectBuildings").className = "paneSelector";
        document.getElementById("selectEquipment").className = "paneSelector";
        document.getElementById("selectRecipes").className = "paneSelector";
    }
    if (name == 'staff'){
        document.getElementById("ingredientsPane").style.display = "none";
        document.getElementById("staffPane").style.display = "block";
        document.getElementById("buildingsPane").style.display = "none";
        document.getElementById("equipmentPane").style.display = "none";
        document.getElementById("recipesPane").style.display = "none";

        document.getElementById("selectIngredients").className = "paneSelector";
        document.getElementById("selectStaff").className = "paneSelector selected";
        document.getElementById("selectBuildings").className = "paneSelector";
        document.getElementById("selectEquipment").className = "paneSelector";
        document.getElementById("selectRecipes").className = "paneSelector";
    }
    if (name == 'buildings'){
        document.getElementById("ingredientsPane").style.display = "none";
        document.getElementById("staffPane").style.display = "none";
        document.getElementById("buildingsPane").style.display = "block";
        document.getElementById("equipmentPane").style.display = "none";
        document.getElementById("recipesPane").style.display = "none";
        document.getElementById("selectIngredients").className = "paneSelector";
        document.getElementById("selectStaff").className = "paneSelector";
        document.getElementById("selectBuildings").className = "paneSelector selected";
        document.getElementById("selectEquipment").className = "paneSelector";
        document.getElementById("selectRecipes").className = "paneSelector";
    }
    if (name == 'equipment'){
        document.getElementById("ingredientsPane").style.display = "none";
        document.getElementById("staffPane").style.display = "none";
        document.getElementById("buildingsPane").style.display = "none";
        document.getElementById("equipmentPane").style.display = "block";
        document.getElementById("recipesPane").style.display = "none";
        document.getElementById("selectIngredients").className = "paneSelector";
        document.getElementById("selectStaff").className = "paneSelector";
        document.getElementById("selectBuildings").className = "paneSelector";
        document.getElementById("selectEquipment").className = "paneSelector selected";
        document.getElementById("selectRecipes").className = "paneSelector";
    }
    if (name == 'recipes'){
        document.getElementById("ingredientsPane").style.display = "none";
        document.getElementById("staffPane").style.display = "none";
        document.getElementById("buildingsPane").style.display = "none";
        document.getElementById("equipmentPane").style.display = "none";
        document.getElementById("recipesPane").style.display = "block";

        document.getElementById("selectIngredients").className = "paneSelector";
        document.getElementById("selectStaff").className = "paneSelector";
        document.getElementById("selectBuildings").className = "paneSelector";
        document.getElementById("selectEquipment").className = "paneSelector";
        document.getElementById("selectRecipes").className = "paneSelector selected";
    }
}
function createBuilding(name){
    //TODO: Create Buildings
}
function workland(amount) {
    openland += 1;
}
function workconcession(amount) {
    openconcessions += 0.1
}
function updateCustomers(){
    // called from game loop. Calculate how many customers arrive & update display
    customers += 1;
    document.getElementById("customers").innerHTML = customers;
}
function evalSatisfaction(){
    //called from game loop. Determine customer satisfaction
}
function calcServiceRate (){ //rate as which meals are served.
    serviceRate = lineCooks; //right now there are just line cooks available.
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

    document.getElementById("customersatisfaction").innerHTML = customerSatisfaction;
    calcServiceRate();
    updateCustomers();
    evalSatisfaction();
    if (!everySecondTick) {
        chefClick(serviceRate);
    }
    if (!every60Tick) {
        if (salaryCost != 0){paySalaries();}
    }
}, 1000); //Max update rate is 1/second.