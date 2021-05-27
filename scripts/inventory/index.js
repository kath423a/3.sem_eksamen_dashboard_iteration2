import "../../sass/index.scss";
import { prepareBartenderStatusObjects } from "./bartender-status";
import { prepareBeerTapChartObjects } from "./beer-tap-status";
import { prepareBeerStockStatusObjects } from "./beer-stock-status";
import { getData } from "../modules/helpers";

window.addEventListener("DOMContentLoaded", init);

async function init() {
    const data = await getData();

    console.log(data);

    buildView(data);

    // Call getQueue again, to wait for the next update to the queue
    // setTimeout(init, 5000);
}

function buildView(data) {
    const { storage, taps, bartenders } = data;

    prepareBeerStockStatusObjects(storage);
    prepareBeerTapChartObjects(taps);
    prepareBartenderStatusObjects(bartenders);
}
