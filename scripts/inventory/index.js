import "../../sass/index.scss";

window.addEventListener("DOMContentLoaded", init);

let settings = {
    url: "https://hold-kaeft-vi-har-det-godt.herokuapp.com/",
    hooks: {
        beerStockStatusList: document.querySelector(
            ".js-beer-stock-status-list"
        ),
        beerTapChart: document.querySelector(".js-beer-tap-chart"),
    },
    templates: {
        beerStock: document.querySelector(".t-beer-stock").content,
    },
    beerColors: {
        "Ruined Childhood": "#75b2ff",
        "El Hefe": "#ffda58",
        GitHop: "#553333",
        "Row 26": " #f85229",
        "Hollaback Lager": "#e8d2ae",
        "Hoppily Ever After": "#3ccb75",
        Sleighride: "#e072a4",
        Mowintime: "#3454d1",
        Steampunk: "#ff912d",
        "Fairy Tale Ale": "#ace365",
    },
};

async function init() {
    await getData();
}

async function getData() {
    let response = await fetch(settings.url);

    if (response.status == 502) {
        // Connection timeout, let's reconnect
        await getData();
    } else if (response.status != 200) {
        // An error - show it in the console
        console.log(response.statusText);

        // reconnect after 1 second
        await getData();
    } else {
        const data = await response.json();
        // updateData(data);
        prepareBeerStockStatusObjects(data.storage);
        prepareBeerTapChartObjects(data.taps);
        console.log(data);
        // Call getQueue again, to wait for the next update to the queue
        await setTimeout(await getData, 1000);
    }
}

function prepareBeerTapChartObjects(beerTaps) {
    // Resets the chart
    settings.hooks.beerTapChart.innerHTML = "";

    // Set amount of beers available from the bar
    settings.hooks.beerTapChart.style.setProperty("--beers", beerTaps.length);

    // Show updated chart
    beerTaps.forEach((beerTap) => {
        showBeerTapStatus(beerTap);
    });
}

function showBeerTapStatus(beerTapObject) {
    const percentage = (beerTapObject.level / beerTapObject.capacity) * 100;
    console.log(percentage);
    const bar = document.createElement("li");
    bar.classList.add("beer-tap-chart__bar");
    bar.style.setProperty("--bar-percentage", `${percentage.toFixed(2)}%`);

    settings.hooks.beerTapChart.append(bar);
}

function prepareBeerStockStatusObjects(beersInStock) {
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
