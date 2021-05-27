import { settings } from "../modules/settings";

export function prepareBeerStockStatusObjects(beersInStock) {
    // Resets the list
    const list = settings.hooks.beerStockStatusList;
    list.innerHTML = "";

    // Show updated list
    beersInStock.forEach((beer) => {
        showBeerStockStatus(beer);
    });
}

function showBeerStockStatus(beerObject) {
    const list = settings.hooks.beerStockStatusList;
    const template = settings.templates.beerStock.cloneNode(true);
    const color = settings.beerColors[beerObject.name];
    const { name, amount } = beerObject;

    template
        .querySelector(".beer-stock__icon")
        .style.setProperty("--keg-color", color);
    template.querySelector(".beer-stock__amount").innerHTML = amount;
    template.querySelector(".beer-stock__name").innerHTML = name;

    list.append(template);
}
