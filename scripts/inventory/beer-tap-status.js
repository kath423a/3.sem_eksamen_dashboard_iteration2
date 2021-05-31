import { settings } from "../modules/settings";
import { makeBeerBubbles } from "./beer-bubbles";
import { sortBy } from "../modules/helpers";

export function prepareBeerTapChartObjects(beerTaps) {
    const chart = settings.hooks.beerTapChart;

    // Resets the chart
    chart.innerHTML = "";

    // Set amount of beers available from the bar
    chart.style.setProperty("--beers", beerTaps.length);

    // Sort beers from A - Z
    beerTaps.sort(sortBy("id"));

    // Show updated chart
    beerTaps.forEach((beerTap) => {
        showBeerTapLiquid(beerTap);
    });
}

function showBeerTapLiquid(beerTapObject) {
    const beerTapChart = settings.hooks.beerTapChart;
    const template = settings.templates.beerBar.content.cloneNode(true);
    const { beer, level, capacity } = beerTapObject;
    const percentage = parseInt((level / capacity) * 100);

    template
        .querySelector(".beer-bar")
        .style.setProperty("--bar-percentage", percentage);

    template.querySelector(".beer-bar").setAttribute("data-beer", beer);

    template.querySelector(".beer-bar__name").textContent = beer;

    template.querySelector(".beer-bar__percent").textContent = `${percentage}%`;

    const beerWithBubbles = makeBeerBubbles(template);

    beerTapChart.append(beerWithBubbles);
}

export function updateBeerTaps(data) {
    const beerTabs = settings.hooks.beerTapChart.querySelectorAll(".beer-bar");

    beerTabs.forEach((tab, index) => {
        const { level, capacity, beer } = data[index];
        const percentage = parseInt((level / capacity) * 100);

        tab.setAttribute("data-beer", beer);
        tab.style.setProperty("--bar-percentage", percentage);

        tab.querySelector(".beer-bar__name").textContent = beer;
        tab.querySelector(".beer-bar__percent").textContent = `${percentage}%`;
    });
}
