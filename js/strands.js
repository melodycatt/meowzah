const StrandI = new Item("strand", 50000, "sum", 25000);
StrandI.new = function() {
    {
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
        this.cost_span.innerText = ` | cost: ${this.cost} catnip`;
    }    
    
}

class Strand {
    genes;

    constructor() {
        
    }
}

class StrandGenes {
    /*
    C - -2
    c - -1
    A - 0
    t - 1
    T - 2
    */
    grow_genes = [];
    sell_genes = [];
    cost_genes = [];

    constructor(grow_genes, sell_genes, cost_genes) {
        this.grow_genes = grow_genes;
        this.sell_genes = sell_genes;
        this.cost_genes = cost_genes;
    }

    static random() {
        return new StrandGenes(
            new Array().fill(0, 0, 4).map(() => Math.floor(Math.random() * 5 - 2)),
            new Array().fill(0, 0, 4).map(() => Math.floor(Math.random() * 5 - 2)),
            new Array().fill(0, 0, 4).map(() => Math.floor(Math.random() * 5 - 2)),
        );
    }
}