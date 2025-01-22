var catnip = 0;
const catnip_count = document.getElementById('catnip');

class Auto {
    name;
    count = 0;
    count_span;
    cost_span;
    cost = 0;
    cost_growth_type = "";
    cost_growth_value;
    cost_additive_value;

    speed;
    n;

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
        this.name = name
        this.count_span = document.getElementById(name);
        this.cost_span = document.getElementById(`${name}-cost`);
        this.cost = cost;
        this.cost_growth_type = cost_growth_type;
        this.cost_growth_value = cost_growth_value;
        this.speed = speed;
        this.n = n;
        this.cost_additive_value = cost_additive_value;
    }

    new() {
        if (catnip < this.cost) return;
        this.intervals.push(setInterval(nipdeeznuts, this.speed, this.n));
        this.count++; 
        this.count_span.innerText = this.count; 
        nipdeeznuts(-this.cost); 
        if (this.cost_growth_type == "multiple") this.cost *= this.cost_growth_value;
        if (this.cost_growth_type == "exponent") Math.pow(this.cost, this.cost_growth_value);
        if (this.cost_growth_type == "sum") this.cost += this.cost_growth_value;
        if (this.cost_growth_type == "additive_exponent") { this.cost += this.cost_additive_value; Math.pow(this.cost_additive_value, this.cost_growth_value) };
        if (this.cost_growth_type == "additive_multiple") { this.cost += this.cost_additive_value; this.cost_additive_value *= this.cost_growth_value };
        if (this.cost_growth_type == "additive_sum") { this.cost += this.cost_additive_value; this.cost_additive_value += this.cost_growth_value };
        this.cost = Math.round(this.cost);
        this.cost_additive_value = Math.round(this.cost_additive_value);
        this.cost_span.innerText = ` | cost: ${this.cost} catnip`
    }
}

function nipdeeznuts(n) {
    catnip += n;
    for(let i in autos) {
        if (catnip >= autos[i].cost * 0.75) {
            document.getElementById(`${autos[i].name}-container`).style.display = "block";
        }
    }
    catnip_count.innerText = catnip;
}

const Dealer = new Auto('dealers', 10, "additive_sum", 2, 1000, 1, 5);
const Farm = new Auto('farmers', 125, "additive_sum", 20, 200, 3, 50);
const Factory = new Auto('factories', 1350, "additive_sum", 200, 50, 9, 500);

const autos = [
    Dealer,
    Farm,
    Factory
]