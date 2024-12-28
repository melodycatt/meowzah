console.log(inv)
class Reward {
    inventoried = false;

    rarity;
    color;
    static RARITIES = [
        "Common",
        "Uncommon",
        "Rare",
        "Exotic",
        "Epic",
    ]
    static COLORS = {
        "Common": "#0a4a1b",
        "Uncommon": "#0a4a37",
        "Rare": "#0a7874",
        "Exotic": "",
        "Epic": "#5500b0",
    }
    static WEIGHTS = {
        "Common": 0.25,
        "Uncommon": 0.125,
        "Rare": 0.0625,
        "Exotic": "#5500b0",
        "Epic": 0.015625 / 2,
    }
    static VALUES = {
        "Common": 1,
        "Uncommon": 3,
        "Rare": 5,
        "Exotic": 10,
        "Epic": 50,
    }

    name;
    img;
    weight;


    shiny = true;

    static CalculateChances(rewards, sum) {
        let chances = [];
        let groupChances = {};
        for (let i in rewards) {
            chances.push([(rewards[i].weight / sum) * 100, rewards[i].name]);
            if(groupChances[rewards[i].rarity] == undefined) groupChances[rewards[i].rarity] = (rewards[i].weight / sum) * 100;
            else groupChances[rewards[i].rarity] += (rewards[i].weight / sum) * 100;
        }
        console.log(quickSort(chances));
        console.log(groupChances);
        console.log(chances.reduce((x, y) => { if (x[0] != undefined) return x[0] + y[0]; return x + y[0]}));
    }

    static SHINYTYPES = [
        "Shiny",
    ]

    static from(r, test) {
        const nr = new Reward("p", "/", 0, "Dirt", true);
        nr.name = r.name;
        if (!test) nr.img = r.img.cloneNode(true);
        nr.img = r.img;
        nr.weight = r.weight;
        nr.rarity = r.rarity;
        nr.color = r.color;
        if (!test) nr.rewardShinies = nr.img.getElementsByClassName("rewardShinies")[0];

        nr.shinify(test);
        for(let i = 0; i < Reward.SHINYTYPES.length && !test; i++) {
            if (((1 << i) & nr.shinyFlags) != 0) { nr.rewardShinies.children[i].style.opacity = '1'; nr.rewardShinies.children[i].style.filter = "brightness(100%)"; }
            else {  
                if (i == 4) nr.rewardShinies.children[i].style.opacity = '0.1'; 
                else nr.rewardShinies.children[i].style.opacity = '0.4'; 
                nr.rewardShinies.children[i].style.filter = "brightness(30%)";
            }; 
        }

        return nr;
    }

    constructor(name, img, weight, rarity, from = false) {
        if (!from) {
            if(!Reward.RARITIES.includes(rarity)) {
                throw new Error("yohoho rarity bad")
            }
            if(typeof img != "string" || typeof name != "string") {
                throw new Error("img and name shouldbe string")
            }
            if(typeof weight != "number") {
                throw new Error("img and name shouldbe string")
            }
    
            this.rarity = rarity;
            this.color = Reward.COLORS[rarity];
            if (weight == -1) {
                this.weight = Reward.WEIGHTS[rarity]
            } else {
                this.weight = weight;
            }
            this.name = name;
            this.img = img;     
            this.shinify()
        }
    }

    new() {
        let outputr = new Reward(this.name, this.img.src, this.weight, this.rarity);
        outputr.color = this.color;
        //let outputi = new Item(outputr);
        return outputr
    }

    shinify() {
        if (Math.floor(Math.random() * 1863) == 0) this.shiny = true;
        else this.shiny = false;
    }

    select() {
        return () => {
            selected.push(this)
            this.img.classList.add("selected")
            this.img.addEventListener("click", this.unselect(), {once: true})
            this.img.addEventListener("contextmenu", Reward.context, {once: true})        
        }
    }

    static context(x) {
        var temp = selected.slice().reverse()
        for (let i of temp) {
            i.sell()
        }
        loadWithFlags();
    }

    unselect() {
        return () => {
            selected.splice(selected.indexOf(this), 1)
            this.img.classList.remove("selected")
            this.img.removeEventListener("contextmenu", Reward.context, {once: true})
            this.img.addEventListener("click", this.select(), {once: true})
        }
    }

    sell(test) {
        rerolls += Reward.VALUES[this.rarity] + this.shiny? 200: 0;
        selected.splice(selected.indexOf(this), 1)
        if (!test) this.img.classList.remove("selected")
        inventory.splice(inventory.indexOf(this), 1);
        if (!test) this.img.parentNode.removeChild(this.img);
    }

    inventorify() {
        if (!this.inventoried) {
            this.inventoried = true;
            this.img.addEventListener("click", this.select(), {once: true});
        }
    }
}

function SellAll(test) {
    if (!test) loadInventory(undefined, undefined, undefined, undefined, undefined, true)
    selected = inventory.slice();
    var temp = selected.slice().reverse()
    for (let i of temp) {
        i.sell(test)
    }
    if (!test && inv) loadWithFlags();
}

function RollAll(test = false) {
    var rolled = Reroll(test);
    while(rolled) {
        rolled = Reroll(test);
    }
}

function TestRnS(n, m, c) {
    if (ch) ch.destroy();
    if (c) {
        var chart = [];
        var ctx = document.getElementById('chart');
        var total = 0;
    }
    rerolls = n;
    if (m > 0) {
        for (let i = 0; i < m; i++) {
            RollAll(true);
            SellAll(true);
        }
    } else {
        while(rerolls >= 1 && rerolls <= m * -1) {
            RollAll(true);
            SellAll(true);
            if (c) {
                chart.push(rerolls);
                total++
            };
        }
    }

    const labels = ((start, stop, step) =>
        Array.from(
        { length: (stop - start) / step + 1 },
        (value, index) => start + index * step
    ))(0, total, 1)

    ch = new Chart(
        ctx,
        {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "rerolls each buy and sell",
                        data: chart,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0
                    }
                ]
            }
        }
    )

    console.log(rerolls);
}

function RnS() {
    RollAll();
    SellAll();
}

var ch;

class Item extends Reward {
    constructor (reward) {
        this.name = reward.name;
        this.color = reward.color;
        this.rarity = reward.rarity;
        this.weight = reward.weight;
        this.img = reward.img.cloneNode(true)
    }
}

const REWARDS = [
    new Reward("Goop", "./img/items/goop.svg", -1, "Dirt"),
    new Reward("Nightjar", "./img/items/nightjar.jpeg", -1, "Dirt"),
    new Reward("Poop", "./img/items/poop.svg", -1, "Dirt"),
    new Reward("Star", "./img/items/star.svg", -1, "Common"),
    new Reward("Zooper Dooper", "./img/items/zooperdooper.png", -1, "Common"),
    new Reward("Vinegar", "./img/items/vinegar.webp", -1, "Common"),
    new Reward("Leek", "./img/items/leek.svg", -1, "Uncommon"),
    new Reward("Clown", "./img/items/clown.svg", -1, "Uncommon"),
    new Reward("Swivel Chair", "./img/items/swivelchair.avif", -1, "Uncommon"),
    new Reward("Ferris", "./img/items/ferris.png", -1, "Uncommon"),
    new Reward("Normal Distribution", "./img/items/normaldistribution.png", -1, "Rare"),
    new Reward("Miku", "./img/items/miku.jpg", -1, "Rare"),
    new Reward("Olive Oil", "./img/items/oliveoil.webp", -1, "Rare"),
    new Reward("Casio fx-8200 AU", "./img/items/casio.webp", -1, "Rare"),
    new Reward("Russia", "./img/items/russia.svg", 0.03124, "Elusive"),
    new Reward("Italy", "./img/items/italy.svg", -1, "Elusive"),
    new Reward("Estrogen", "./img/items/estrogen.jpg", -1, "Elusive"),
    new Reward("Mitosis", "./img/items/mitosis.png", -1, "Epic"),
    new Reward("Ben 10 Watch", "./img/items/ben10.jpg", -1, "Epic"),
    new Reward("Sata Andagi", "./img/items/sataandagi.jpg", -1, "Rare"),
    new Reward("VBucks", "./img/items/vbuck.webp", -1, "Epic"),
    new Reward("Harkster", "./img/items/harkster.jpg", -1, "Legendary"),
    new Reward("Osaka", "./img/items/osaka.webp", -1, "Legendary"),
    new Reward("Charizard", "./img/items/charizard.jpg", -1, "Legendary"),
    new Reward("Rainbow Goop", "./img/items/rainbowgoop.svg", -1, "Insane"),
    new Reward("Download", "./img/items/download.svg", -1, "Mythical"),
    new Reward("Freddy Fazbear", "./img/items/freddy.webp", -1, "Mythical"),
    new Reward("Bonnie", "./img/items/bonnie.webp", -1, "Mythical"),
    new Reward("Chica", "./img/items/chica.webp", -1, "Mythical"),
    new Reward("Foxy", "./img/items/foxy.webp", -1, "Mythical"),
    new Reward("Sun", "./img/items/sun.webp", -1, "Mythical"),
    new Reward("Moon", "./img/items/moon.webp", -1, "Mythical"),
    new Reward("Balloon Boy", "./img/items/balloonboy.webp", -1, "Mythical"),
    new Reward("Montgomery Gator", "./img/items/montgomery.webp", -1, "Mythical"),
    new Reward("Roxanne Wolf", "./img/items/roxanne.webp", -1, "Mythical"),
    new Reward("Sukuna", "./img/items/sukuna.webp", -1, "Insane"),
    new Reward("Nightmare Freddy", "./img/items/nightmarefreddy.webp", -1, "Insane"),
    new Reward("Nightmare Bonnie", "./img/items/nightmarebonnie.webp", -1, "Insane"),
    new Reward("Nightmare Chica", "./img/items/nightmarechica.webp", -1, "Insane"),
    new Reward("Nightmare foxy", "./img/items/nightmarefoxy.webp", -1, "Insane"),
    new Reward("Man", "./img/items/man.png", -1, "Unique"),
    new Reward("World Peace", "./img/items/worldpeace.png", -1, "Unique"),
    new Reward("Queen Elizabeth II", "./img/items/liz.webp", -1, "Unique"),
]
const t = REWARDS.reduce((px, x) => { return px + x.weight}, 0);

Reward.CalculateChances(REWARDS, t)

function RandomReward(test) {
    let n = Math.random() * t
    let c = 0
    for(let i in REWARDS) {
        c += REWARDS[i].weight;
        if (c >= n) {
            r = Reward.from(REWARDS[i], test);
            return r;
        }
    }
}

var rerolls = 10;

/*addEventListener('load', () => {
        console.log("ya")
        console.log(RandomReward())
        var dist = {}
        //console.log(Array.from({length: (255 - 0) / 1 + 1}, (v, i) => 0 + i * 1))
        //while(!checkSubset(Object.keys(dist), Array.from({length: (255 - 0) / 1 + 1}, (v, i) => 0 + i * 1))) {
        for(let i = 0; i < 50000; i++) {
            var r = RandomReward(false)
            //console.log(r)
            if (dist[r.shinyFlags] == undefined) {
                dist[r.shinyFlags] = 1
            } else {
                dist[r.shinyFlags] += 1;
            }
        }
        console.log(dist)
});*/

var fullDist = {}

let checkSubset = (parentArray, subsetArray) => {
    //return true
    return subsetArray.every((el) => {
        return parentArray.includes(el)
    })
}

const rewardContainer = document.getElementById('rewards');
const inventory = [];
//Reroll()
//document.getElementById('reroll').disabled = true;
function test(n) {
    var rdist = []
    
    for (let i = 0; i < 100; i++) {
        rerolls = n;
        RollAll(true)
        SellAll(true);
        rdist.push(rerolls)
    }

    console.log(rdist)
    console.log(rdist.reduce((x, y) => {
        if (y > n) {
            return x + 1
        }
        else return x
    }, 0))
    console.log(rdist.reduce((x, y) => {
        if (y < n) {
            return x + 1
        }
        else return x
    }, 0))

/*
    var dist = {};
    for (let r = 0; r < 1000; r++) {
        rerolls = 10;
        for (let i = 0; i < 10; i++) {
            let j = Reroll();
            for (let k of j) {
                if (dist[k.weight] == undefined) {
                    dist[k.weight] = 1;
                    continue;
                }
                dist[k.weight] += 1;
            }
        }
    }
    console.log(dist)*/
}

function roll(test = false) {
    var rolledItems = []
    for(let i = 0; i < 3; i++) {
        var r = RandomReward(!test, test);
        inventory.push(r);
        rolledItems.push(r)
    }
    return rolledItems;
}


function quickSort(arr) {
    if (arr.length <= 1) {
      return arr;
    }
  
    let pivot = arr[0];
    let leftArr = [];
    let rightArr = [];
  
    for (let i = 1; i < arr.length; i++) {
        console.log(arr[i][0])
        if (arr[i][0] < pivot[0]) {
            leftArr.push(arr[i]);
        } else {
            rightArr.push(arr[i]);
        }
    }
  
    return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
};




//peer into the fires of hell
with (Math) { console.log(sin(PI)) }