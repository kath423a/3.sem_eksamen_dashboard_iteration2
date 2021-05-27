import { settings } from "../modules/settings";
import { makeBeerBubbles } from "./beer-bubbles";

export function prepareBeerTapChartObjects(beerTaps) {
    // Resets the chart & xAxis
    settings.hooks.beerTapChart.innerHTML = "";

    // Set amount of beers available from the bar
    settings.hooks.beerTapChart.style.setProperty("--beers", beerTaps.length);

    // Show updated chart
    beerTaps.forEach((beerTap) => {
        showBeerTapLiquid(beerTap);
    });
}

function showBeerTapLiquid(beerTapObject) {
    const beerTapChart = settings.hooks.beerTapChart;
    const templateClone = settings.templates.beerBar.cloneNode(true);
    const percentage = parseInt(
        (beerTapObject.level / beerTapObject.capacity) * 100
    );

    templateClone
        .querySelector(".beer-bar")
        .style.setProperty("--bar-percentage", percentage);

    templateClone
        .querySelector(".beer-bar")
        .setAttribute("data-beer", beerTapObject.beer);

    templateClone.querySelector(".beer-bar__name").textContent =
        beerTapObject.beer;

    templateClone.querySelector(
        ".beer-bar__percent"
    ).textContent = `${percentage}%`;

    const beerWithBubbles = makeBeerBubbles(templateClone);

    beerTapChart.append(beerWithBubbles);
}

function showBeerTapStatus(beerTapObject) {
    const templateClone = settings.templates.chartXAxisItem.cloneNode(true);
    const percentage = (beerTapObject.level / beerTapObject.capacity) * 100;
    const xAxis = settings.hooks.beerTapXAxis;

    templateClone
        .querySelector(".chart__x-axis-item")
        .style.setProperty("--bar-percentage", parseInt(percentage));

    templateClone.querySelector(".chart__x-axis-name").textContent =
        beerTapObject.beer;
    templateClone.querySelector(
        ".chart__x-axis-percent"
    ).textContent = `${parseInt(percentage)}%`;

    templateClone
        .querySelector(".chart__x-axis-item")
        .setAttribute("data-beer", beerTapObject.beer);

    xAxis.append(templateClone);
}
