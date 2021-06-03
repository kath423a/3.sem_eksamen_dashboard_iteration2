import { settings } from "../modules/settings";

export function getRandomInteger(min, max, range = null) {
    if (range) {
        // Return random integer with steps / range
        const steps = (max - min) / range + 1;
        return Math.floor(Math.random() * steps) * range + min;
    }
    // Return a random integer between min max parameters including min max
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function getData() {
    let response = await fetch(settings.url);

    if (response.status == 502) {
        console.log(response.statusText);
        // Connection timeout, let's reconnect
        await getData();
    } else if (response.status != 200) {
        // An error - show it in the console
        console.log(response.statusText);

        // reconnect after 1 second
        await getData();
    } else {
        console.log(response.statusText);
        const json = await response.json();

        return json;
    }
}

export function sortBy(field) {
    return function (a, b) {
        return (a[field] > b[field]) - (a[field] < b[field]);
    };
}

export function getRandomCustomerName() {
    const customers = settings.randomCustomers;
    const customerAmount = customers.length;

    const randomNumber = getRandomInteger(1, customerAmount);
    const randomCustomer = customers[randomNumber - 1];

    return randomCustomer;
}
