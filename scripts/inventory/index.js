import "../../sass/index.scss";
import { prepareBartenderStatusObjects } from "./bartender-status";
import { prepareBeerTapChartObjects, updateBeerTaps } from "./beer-tap-status";
import { prepareBeerStockStatusObjects } from "./beer-stock-status";
import { getData } from "../modules/helpers";

window.addEventListener("DOMContentLoaded", init);

async function init() {
    const data = await getData();

    console.log(data);

    buildView(data);

    updateView();
}

function buildView(data) {
    const { storage, taps, bartenders } = data;

    prepareBeerStockStatusObjects(storage);
    prepareBeerTapChartObjects(taps);
    prepareBartenderStatusObjects(bartenders);
}

async function updateView() {
    const data = await getData();

    const { storage, taps, bartenders } = data;

    updateBeerTaps(taps);
    prepareBartenderStatusObjects(bartenders);
    prepareBeerStockStatusObjects(storage);

    // Call getQueue again, to wait for the next update to the queue
    setTimeout(updateView, 5000);
}
