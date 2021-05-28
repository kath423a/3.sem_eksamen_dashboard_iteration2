import { settings } from "./settings";

export function setServerStatus(status) {
    const statusText = settings.hooks.serverStatus;
    const statusIcon = statusText.querySelector(".server-status__icon");
}
