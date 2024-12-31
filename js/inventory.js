const inv = {}

class Card {
    title;
    description;
    stats;
    value;
    rarity;
    shiny;

    constructor(reward) {
        this.title = reward.name;
        this.description = reward.description;
        this.stats = reward.stats;
        this.rarity = reward.rarity;
        this.shiny = reward.shinify()
        this.value = Reward.VALUES[this.rarity] + this.shiny? 200: 0;
    }
}