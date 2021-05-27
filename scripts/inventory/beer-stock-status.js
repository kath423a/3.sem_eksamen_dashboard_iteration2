import { settings } from "../modules/settings";

export function prepareBeerStockStatusObjects(beersInStock) {
    // Resets the list
    settings.hooks.beerStockStatusList.innerHTML = "";

    // Show updated list
    beersInStock.forEach((beer) => {
        showBeerStockStatus(beer);
    });
}

function showBeerStockStatus(beerObject) {
    const templateClone = settings.templates.beerStock.cloneNode(true);

    templateClone
        .querySelector(".beer-stock__icon")
        .style.setProperty("--keg-color", settings.beerColors[beerObject.name]);
    templateClone.querySelector(".beer-stock__amount").innerHTML =
        beerObject.amount;
    templateClone.querySelector(".beer-stock__name").innerHTML =
        beerObject.name;

    settings.hooks.beerStockStatusList.append(templateClone);
}
