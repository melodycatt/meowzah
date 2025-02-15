const l = function(what) {return document.getElementById(what)}

var catnip = 0;
const catnip_count = l('catnip');

class Item {
    name;
    count = 0;
    count_span;
    cost_span;
    cost = 0;
    base_cost = 0;
    cost_growth_type = "";
    cost_growth_value;
    cost_additive_value;


    /**
     * creates a new type of item
     * 
     * @param {string} name gets the count span by this id
     * @param {number} cost cost of the auto
     * @param {"exponent" | "multiple" | "sum" | "additive_exponent" | "additive_multiple" | "additive_sum"} cost_growth_type the way the cost is increased
     * @param {number} cost_growth_value value for the cost grown on buy
     * @param {number} cost_additive_value if cost growth type is additive, this is the starting amount to add
     * 
     * @constructor
     */
    constructor(name, cost, cost_growth_type, cost_growth_value, cost_additive_value = 0) {
        this.name = name
        this.count_span = l(name);
        this.cost_span = l(`${name}-cost`);
        this.cost = cost;
        this.base_cost = cost;
        this.cost_growth_type = cost_growth_type;
        this.cost_growth_value = cost_growth_value;
        this.cost_additive_value = cost_additive_value;
    }

    new() {
        if (catnip < this.cost) return;
        this.count++; 
        this.count_span.innerText = this.count; 
        nipdeeznuts(-this.cost); 
        if (this.cost_growth_type == "multiple") this.cost = this.base_cost * Math.pow(this.cost_growth_value, this.count);
        if (this.cost_growth_type == "exponent") this.cost = Math.pow(this.base_cost, Math.pow(this.cost_growth_value, this.count));
        if (this.cost_growth_type == "sum") this.cost = this.base_cost + this.cost_growth_value * this.count;
        if (this.cost_growth_type == "additive_exponent") { this.cost += this.cost_additive_value; Math.pow(this.cost_additive_value, this.cost_growth_value) };
        if (this.cost_growth_type == "additive_multiple") { this.cost += this.cost_additive_value; this.cost_additive_value *= this.cost_growth_value };
        if (this.cost_growth_type == "additive_sum") { this.cost += this.cost_additive_value; this.cost_additive_value += this.cost_growth_value };
        this.cost = Math.ceil(this.cost);
        this.cost_additive_value = Math.round(this.cost_additive_value);
        this.cost_span.innerText = ` | cost: ${this.cost} catnip`
    }
}

class Auto extends Item {
    speed;
    n;
    cps;
    cps_span;

    //current instances of this auto
    intervals = [];

    /**
     * creates a new type of 'auto' (generates catnip)
     * 
     * @param {string} name gets the count span by this id
     * @param {number} cost cost of the auto
     * @param {"exponent" | "multiple" | "sum" | "additive_exponent" | "additive_multiple" | "additive_sum"} cost_growth_type the way the cost is increased
     * @param {number} cost_growth_value value for the cost grown on buy
     * @param {number} cost_additive_value if cost growth type is additive, this is the starting amount to add
     * @param {number} speed how often this auto creates catnip in ms
     * @param {number} n how much catnip this auto generates
     * 
     * @constructor
     */
    constructor(name, cost, cost_growth_type, cost_growth_value, speed, n, cost_additive_value = 0) {
        super(name, cost, cost_growth_type, cost_growth_value, cost_additive_value)
        this.cps_span = l(`${name}-cps`);
        this.speed = speed;
        this.n = n;
        this.cps = (1 / (speed / 1000)) * n;
    }

    new() {
        if (catnip < this.cost) return;
        super.new()
        this.intervals.push(setInterval(nipdeeznuts, this.speed, this.n));
        this.cps_span.innerText = `Total contributed cps: ${this.cps * this.count}`;
    }
}

function nipdeeznuts(n) {
    catnip += n;
    for(let i in autos) {
        if (catnip >= autos[i].cost * 0.75) {
            l(`${autos[i].name}-container`).style.display = "block";
        }
    }
    catnip_count.innerText = catnip;
}

const Dealer = new Auto('dealers', 10, "multiple", 1.15, 2000, 1);
const Farm = new Auto('farmers', 150, "multiple", 1.15, 500, 3);
const Factory = new Auto('factories', 1750, "multiple", 1.15, 25, 2);

const autos = [
    Dealer,
    Farm,
    Factory
]

const strands = [

]