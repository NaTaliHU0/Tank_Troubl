class Player{
    constructor(x, y, id, left, enemy, lastshot, hp, name, weapon){
        this.x = x;
        this.y = y;
        this.id = id;
        this.left = left;//balra néz-e a karakter
        this.enemy = enemy;
        this.lastshot = lastshot;
        this.hp = hp;
        this.name = name;
        this.weapon = weapon;
    }
}
class Bullet{
    constructor(x, y, left, id, enemy, damage, speed, size){
        this.x = x;
        this.y = y;
        this.left = left;
        this.id = id;
        this.enemy = enemy;
        this.damage = damage;
        this.speed = speed;
        this.size = size;
    }
}
class PowerUp{
    constructor(x, y, targety, id, type, parachuteId){
        this.x = x;
        this.y = y;
        this.targety = targety;
        this.id = id;
        this.type = type;
        this.parachuteId = parachuteId;
    }
}
class Weapon{
    constructor(damage, speed, timeout, special, bulletSize){
        this.damage = damage;
        this.speed = speed;
        this.timeout = timeout;
        this.special = special;
        this.bulletSize = bulletSize;

    }
}
var lement = 0;
var fut=0;
var isplayable = false;
var W1 = new Weapon(10, 20, 1300, "none", 10)
var W2 = new Weapon(25, 30, 2000, "laser", 12)
var W3 = new Weapon(75, 20, 4000, "cannon", 17)
var W4 = new Weapon(1, 20, 800, "minigun", 6)
var P1;
var P2;
var players = [P1, P2];
var usernames = ["játékos egy", "játékos kettő"];
var bullets = [];
var powerups = [];
var powerupsforgeneration = ["medkit","w1","w2","w3"]
var lastPowerUp = new Date();
var keys = {};
document.addEventListener("keydown", (e)=>{
    keys[e.key] = true;
});
document.addEventListener("keyup", (e)=>{
    keys[e.key] = false;
});
function mozgas(){
    if(keys["w"]){
        if(document.getElementById("ground").offsetHeight > P1.y)P1.y+=4;
    }
    if(keys["s"]) if(P1.y > 0) P1.y-=4;
    if(keys["a"]){ 
        if(P1.x > 4) P1.x-=4;
        P1.left = true;
    }
    if(keys["d"]){ 
        if(document.getElementById("ground").offsetWidth > P1.x+100) P1.x+=4;
        P1.left = false;
    }
    if(keys["q"]) loves(P1);
    if(keys["ArrowUp"]){
        if(document.getElementById("ground").offsetHeight > P2.y)P2.y+=4;
    }
    if(keys["ArrowDown"]) if(P2.y > 0) P2.y-=4;
    if(keys["ArrowLeft"]){ 
        if(P2.x > 4) P2.x-=4;
        P2.left = true;
    }
    if(keys["ArrowRight"]){ 
        if(document.getElementById("ground").offsetWidth > P2.x+100) P2.x+=4;
        P2.left = false;
    }
    if(keys[" "]) loves(P2);
}
//Lövések
var bulletCount = 0;
function loves(player){
    if(new Date()-new Date(player.lastshot) > player.weapon.timeout){
        var bullet = document.createElement("img");
        var parameters;
        if(player.weapon!=W3)parameters = [player.left?player.x+1:player.x+90, player.y+47, player.left, "b"+bulletCount, player.enemy, player.weapon.bulletSize];
        else parameters = [player.left?player.x+1:player.x+90, player.y+42, player.left, "b"+bulletCount, player.enemy, player.weapon.bulletSize];
        bullets.push(new Bullet(parameters[0],parameters[1], parameters[2], parameters[3], parameters[4], player.weapon.damage, player.weapon.speed, parameters[5]));
        bullet.src = "images/bullet.jpg";
        bullet.className = "bullet";
        bullet.id = parameters[3];
        bullet.style.left = `${parameters[0]}px`;
        bullet.style.bottom = `${parameters[1]}px`;
        bullet.style.height = `${parameters[5]}px`;
        bullet.style.width = `${parameters[5]}px`;
        document.getElementById("main").appendChild(bullet);
        bulletCount++;
        player.lastshot = Date();
    }
    
}
function lovesFrissites(){
    var main = document.getElementById("main");
    for(var i = 0; i < bullets.length; i++){
        var e = bullets[i].enemy;
        var enemy = document.getElementById(e).getBoundingClientRect();
        var b = bullets[i];
        var bLoc = document.getElementById(b.id).getBoundingClientRect();
        if(b.x > main.offsetWidth || b.x < 0){
            main.removeChild(document.getElementById(b.id));
            bullets.splice(i, 1);
        }
        else if(bLoc.left >= enemy.left && bLoc.left <= enemy.left+50 && bLoc.top >= enemy.top && bLoc.top <= enemy.top+60){
            main.removeChild(document.getElementById(b.id));
            // Ki lőtt
            if(e == "p1") {
                let actualDamage = Math.min(P1.hp, b.damage); //
                P1.hp -= b.damage;
                sebzesUpdate("P2", actualDamage); // P2 sebzés
            } else {
                let actualDamage = Math.min(P2.hp, b.damage); // ne legyen felesleges damage hozzáadva
                P2.hp -= b.damage;
                sebzesUpdate("P1", actualDamage); // P1 sebzés
            }
            bullets.splice(i, 1);
        }
        else{
            if(b.left){
                b.x -=b.speed;
            }else{
            b.x += b.speed; //sebesség
            }
        }
    }
    for(var i = 0; i < powerups.length; i++){
        var p = powerups[i];
        if(p.y + 2 >= p.targety){
            main.removeChild(document.getElementById(p.parachuteId));
            if (p.type == 0)document.getElementById(p.id).classList = "terrain medkit";
            else{
                document.getElementById(p.id).classList = `terrain w${p.type}`;
            }
            powerups.splice(i, 1);
        }
        else{
            p.y += 2;
        }
    }
}
//PowerUp
var powerUpCount = 0;
function PowerUpLetrehozas(){
    var main = document.getElementById("main");
    var ground = document.getElementById("ground");
    var x = Math.random()*main.offsetWidth;
    var targety = Math.random() * (main.offsetHeight - (main.offsetHeight-(ground.offsetHeight)))+(main.offsetHeight-ground.offsetHeight) -20;
    var valasztas = Math.floor(Math.random() * powerupsforgeneration.length);
    powerups.push(new PowerUp(x, -32, targety, `pu${powerUpCount}`,valasztas,  `pc${powerUpCount}`));
    var pu = document.createElement("img");
    pu.id = `pu${powerUpCount}`;
    pu.src = `images/${powerupsforgeneration[valasztas]}.png`;
    pu.style.top = -32;
    pu.style.left = `${x}px`;
    pu.style.position = "absolute";
    main.appendChild(pu);
    var pc = document.createElement("img");
    pc.id = `pc${powerUpCount}`;
    pc.src = "images/parachute.png";
    pc.style.top = -64;
    pc.style.left = `${x}px`;
    pc.style.position = "absolute";
    main.appendChild(pc);
    powerUpCount++;
    lastPowerUp = new Date();
}

//Rajzolás
var objects;
function rajz(){
    for(var p of players){
        var pId = document.getElementById(p.id);
        var tank = document.getElementById(`${p.id}`.replace("Div", ""));
        pId.style.left = `${p.x}px`;
        pId.style.bottom = `${p.y}px`;
        if(p.left) tank.style.transform = "scaleX(-1)";
        else tank.style.transform = "scaleX(1)";
        if (p.weapon.special == "laser" && document.getElementById(`${p.id}laser`) == null){
            var l = document.createElement("hr");
            l.id = `${p.id}laser`;
            l.style.width = `${document.getElementById("main").offsetWidth-tank.getBoundingClientRect().left}px`;
            l.style.position = "absolute";
            var pos = tank.getBoundingClientRect();
            l.style.top = `${pos.top}px`;
            document.getElementById("main").appendChild(l);
        } 
        else if(p.weapon.special == "laser"){
            var l = document.getElementById(`${p.id}laser`);
            var pos = tank.getBoundingClientRect();
            l.style.top = `${pos.top}px`;
            if(!p.left){
                l.style.removeProperty("right");
                l.style.left = `${pos.left+tank.offsetWidth}px`;
                l.style.width = `${document.getElementById("main").offsetWidth-tank.getBoundingClientRect().left}px`;
            }
            else{
                l.style.left = `0px`;
                l.style.width = `${tank.getBoundingClientRect().left}px`;
            }
        }
        for(var o of objects){
            var obj = o.getBoundingClientRect();
            var player = tank.getBoundingClientRect();
            if(obj.top <= player.top && obj.left <= player.left && player.left <= obj.left+o.offsetWidth && player.bottom>= obj.bottom){
                pId.style.zIndex = "10";
            }
            else if(obj.top <= player.top && obj.left <= player.left && player.left <= obj.left+o.offsetWidth && player.bottom<= obj.bottom){
                pId.style.zIndex = "1";
            }
            if(obj.bottom+32 >= player.bottom&& obj.left <= player.left+tank.offsetWidth && player.left <= obj.left+32&&player.bottom >= obj.bottom){
                //power up-ok
                if(o.classList.contains("medkit")){
                    document.getElementById("main").removeChild(o);
                    p.hp += 100;
                }
                else if(o.classList.contains("w1")){
                    document.getElementById("main").removeChild(o);
                    p.weapon = W2;
                    if(document.getElementById(`${p.id}laser`))document.body.removeChild(document.getElementById(`${p.id}laser`));
                }
                else if(o.classList.contains("w2")){
                    document.getElementById("main").removeChild(o);
                    p.weapon = W3;
                    if(document.getElementById(`${p.id}laser`))document.body.removeChild(document.getElementById(`${p.id}laser`));
                }
                else if(o.classList.contains("w3")){
                    document.getElementById("main").removeChild(o);
                    p.weapon = W4;
                    if(document.getElementById(`${p.id}laser`))document.body.removeChild(document.getElementById(`${p.id}laser`));
                }
            }
        }
    }
    if(!document.getElementById("low").checked){
        var felhok = document.getElementsByClassName("felho");
        for(var f of felhok){
            if(f.getBoundingClientRect().left < document.getElementById("main").offsetWidth+5){
                f.style.left = `${f.getBoundingClientRect().left+=0.4}px`;
            }
            else f.style.left = `-${f.offsetWidth}px`;
        }
    } 
    lovesFrissites();
    //Power-up kezelés
    if(new Date()-new Date(lastPowerUp) > 10000) PowerUpLetrehozas();
    for(var b of bullets){
        var bno = document.getElementById(b.id);
        bno.style.left = `${b.x}px`;
    }
    for(var p of powerups){
        var pno = document.getElementById(p.id);
        var parachute = document.getElementById(p.parachuteId);
        pno.style.top = `${p.y}px`;
        parachute.style.top = `${p.y-32}px`;
    }
    //Hp bars
    var hpbars = ["hp1", "hp2"];
    for(var i = 0; i < 2; i++){
        var meter =  document.getElementById(hpbars[i]);
        meter.value = players[i].hp;
        if(players[i].hp > meter.max){
            meter.max = `${players[i].hp}`;
        }
    }
}
function newGame(){
    fut=0;
    document.getElementById("scoreboard").style.color = "#000";
    if(document.getElementById("nev1").value!="")usernames[0]=document.getElementById("nev1").value;
    if(document.getElementById("nev2").value!="")usernames[1]=document.getElementById("nev2").value;
    let div = document.getElementById("scoreboard");
    div.style.display="block";
    document.getElementById("nameP1").textContent = usernames[0];
    document.getElementById("nameP2").textContent = usernames[1];
    document.getElementById("p1").src ="images/tank.png";
    document.getElementById("p2").src ="images/tank.png";
    document.getElementById("hp1").style.display="inline-block"
    document.getElementById("hp2").style.display="inline-block"
    document.getElementById("p1Nev").style.display="block"
    document.getElementById("p2Nev").style.display="block"
    if(document.getElementById("zene").checked){
        document.getElementById("sound2").pause();
        document.getElementById("sound1").play();
    }
    const hrTags = document.querySelectorAll('hr');
    hrTags.forEach(hr => hr.remove());
    objects = document.getElementsByClassName("terrain");
    document.getElementById("halal").style.display = "none";
    document.getElementById("hatter").style.display = "none";
    for(var b of bullets) document.getElementById("main").removeChild(document.getElementById(b.id));  
    bullets.splice(0, bullets.length);
    P1 = new Player(10, 100, "p1Div", false, "p2", new Date(), 100, usernames[0], W1);
    P2 = new Player(document.getElementById("main").offsetWidth-100, 100, "p2Div", true, "p1", new Date(), 100, usernames[1], W1);
    players[0] = P1;
    players[1] = P2;
    document.getElementById("hp1").max = "100";
    document.getElementById("hp2").max = "100";
    document.getElementById("p1Nev").innerHTML = usernames[0];
    document.getElementById("p2Nev").innerHTML = usernames[1];
}
const nyeresek_szama = {
    P1: 0,
    P2: 0
};

function nyeresUpdate(player) {
    nyeresek_szama[player]++;
    document.getElementById(`score${player}`).classList.add('frissites');
    osztalyhozzaadas(player,"score");
    document.getElementById(`score${player}`).textContent = nyeresek_szama[player];
}
const okozott_sebzes = {
    P1: 0,
    P2: 0
};
function sebzesUpdate(player, amount) {
    okozott_sebzes[player] += amount;
    osztalyhozzaadas(player,"dmg");
    document.getElementById(`dmg${player}`).textContent = okozott_sebzes[player];
}
function osztalyhozzaadas(player,nev){
    document.getElementById(`${nev}${player}`).classList.add('frissites');
    setTimeout(function(){
        document.getElementById(`${nev}${player}`).classList.remove('frissites');
    }, 300);
}
function game(){
    mozgas();
    rajz();
    id = requestAnimationFrame(game);
    for(var p of players){
        if(p.hp <= 0){
            if(fut==0){
                if(players.indexOf(p)==0) {
                    nyeresUpdate("P2");
                    fut++;
                } 
                else {
                    nyeresUpdate("P1");
                    fut++;
                }
            }
            document.getElementById("halal").style.display = "flex";
            document.getElementById("halalH1").innerHTML = `${p.name} <span style="color: crimson;">Meghalt!</span>`
            document.getElementById("scoreboard").style.color = "#fff";
            cancelAnimationFrame(id);
        }
    }
}
function reset(){
    document.getElementById("scoreboard").style.display = "none";
    lement = 0;
    const audio = document.getElementById("sound2");
    if(document.getElementById("zene").checked){
        isplayable = true;
    }
    if(isplayable){
        audio.muted = false;
        audio.currentTime=0;
        audio.play();
    }
    document.getElementById("sound1").pause();
    document.getElementById("hatter").style.display = "flex";
    document.getElementById("halal").style.display = "none";
}
document.addEventListener("DOMContentLoaded",music);
function music(){
    let isplayable = false;
    if(isplayable){
        audio.muted = false;
        audio.currentTime=0;
        audio.play();
    }
    const audio = document.getElementById("sound2");
    const zene = document.getElementById("zene");
    zene.addEventListener("change",function(){
         if(this.checked){
            isplayable = true;
            audio.muted = false;
            audio.currentTime=0;
            audio.play();
        }
        else{
            isplayable = false;
            audio.muted = true;
            audio.pause();
        }
    })
}
document.addEventListener("keydown",function(event){
    if(event.key === "Enter" && lement==0){
        newGame();
        game();
        game();
        PowerUpLetrehozas();
        lement++;
    }
})