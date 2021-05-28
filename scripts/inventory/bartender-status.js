import { settings } from "../modules/settings";
import { sortBy } from "../modules/helpers";

export function prepareBartenderStatusObjects(bartenders) {
    // Resets the list
    const list = settings.hooks.bartenderStatusList;
    list.innerHTML = "";

    // Sort bartenders A - Z
    bartenders.sort(sortBy("name"));

    // Show updated list
    bartenders.forEach(showBartenderStatus);
}

function showBartenderStatus(bartenderObject) {
    const template = settings.templates.bartender.cloneNode(true);
    const list = settings.hooks.bartenderStatusList;

    const {
        name,
        status,
        statusDetail,
        servingCustomer: orderId,
    } = bartenderObject;

    const task = settings.bartender.tasks[statusDetail].text;
    const statusName = settings.bartender.status[status];
    const showOrderId = settings.bartender.tasks[statusDetail].showOrderId;

    if (showOrderId) {
        template.querySelector(
            ".bartender__task"
        ).textContent = ` ${task} #${orderId}`;
    } else {
        template.querySelector(".bartender__task").textContent = ` ${task}`;
    }

    if (status === "READY") {
        template.querySelector(".bartender__status").classList.add("is-ready");
    }

    template.querySelector(".bartender__name").textContent = name;
    template.querySelector(".bartender__image").src = `bartenders/${name}.jpg`;
    template.querySelector(".bartender__status").textContent = statusName;

    list.append(template);
}
