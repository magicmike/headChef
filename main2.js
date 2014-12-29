var cursors = 0;
var meals = 0;

function chefClick(number){
    meals += number;
    document.getElementById("dollars").innerHTML = meals;
}

function buyCursor (){
    var cursorCost = Math.floor(10 * Math.pow(1.1,cursors));
    if (meals >= cursorCost){
        cursors += 1;
        meals = meals - cursorCost;
        document.getElementById('cursors').innerHTML = cursors;
        document.getElementById('dollars').innerHTML = meals;
    };
    var nextCost = Math.floor(10*Math.pow(1.1,cursors));
    document.getElementById('cursorCost').innerHTML = nextCost;
};

window.setInterval(function(){
    chefClick(cursors);
    console.log(meals + " " + cursors);
}, 1000);