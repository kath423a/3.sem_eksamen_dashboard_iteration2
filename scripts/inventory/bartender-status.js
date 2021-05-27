import { settings } from "../modules/settings";
import { sortBy } from "../modules/helpers";

export function prepareBartenderStatusObjects(bartenders) {
    // Resets the list
    settings.hooks.bartenderStatusList.innerHTML = "";

    // Sort bartenders A - Z
    bartenders.sort(sortBy("name"));

    // Show updated list
    bartenders.forEach(showBartenderStatus);
}

function showBartenderStatus(bartenderObject) {
    const templateClone = settings.templates.bartender.cloneNode(true);
    const bartenderStatusList = settings.hooks.bartenderStatusList;
    const task = settings.bartender.tasks[bartenderObject.statusDetail].text;
    const status = settings.bartender.status[bartenderObject.status];
    const orderId = bartenderObject.servingCustomer;
    const name = bartenderObject.name;
    const showOrderId =
        settings.bartender.tasks[bartenderObject.statusDetail].showOrderId;

    templateClone.querySelector(".bartender__name").textContent = name;

    if (showOrderId) {
        templateClone.querySelector(
            ".bartender__task"
        ).textContent = ` ${task} #${orderId}`;
    } else {
        templateClone.querySelector(
            ".bartender__task"
        ).textContent = ` ${task}`;
    }

    templateClone.querySelector(
        ".bartender__image"
    ).src = `bartenders/${name}.jpg`;

    templateClone.querySelector(".bartender__status").textContent = status;

    if (bartenderObject.status === "READY") {
        templateClone
            .querySelector(".bartender__status")
            .classList.add("is-ready");
    }

    bartenderStatusList.append(templateClone);
}
