import { settings } from "../modules/settings";
import { getRandomInteger } from "../modules/helpers";

export function makeBeerBubbles(beerTapBar) {
    // Destructoring
    const { minBubbles, maxBubbles } = settings.beerBubbles;

    // const percentage = (beerTapBar.level / beerTapObject.capacity) * 100;

    const randomAmountOfBubbles = getRandomInteger(minBubbles, maxBubbles);

    const beerTapBarWithBubbles = generateBeerBubbles(
        beerTapBar,
        randomAmountOfBubbles
    );

    return beerTapBarWithBubbles;
}

function generateBeerBubbles(beerTapBar, numberOfBubbles) {
    // Destructoring
    const {
        minDuration,
        maxDuration,
        rangeDuration,
        minDelay,
        maxDelay,
        rangeDelay,
    } = settings.beerBubbles;

    // for number of bubbles... make a bubble
    for (let index = 1; index <= numberOfBubbles; index++) {
        const templateClone = settings.templates.beerBubble.cloneNode(true);
        const delay = getRandomInteger(minDelay, maxDelay, rangeDelay);
        const duration = getRandomInteger(
            minDuration,
            maxDuration,
            rangeDuration
        );

        templateClone
            .querySelector(".beer-bubble")
            .style.setProperty("--beer-bubble-delay", delay);
        templateClone
            .querySelector(".beer-bubble")
            .style.setProperty("--beer-bubble-duration", duration);
        templateClone
            .querySelector(".beer-bubble")
            .style.setProperty("--beer-bubble-x", getRandomInteger(1, 100));

        beerTapBar.querySelector(".beer-bar__liquid").append(templateClone);
    }

    return beerTapBar;
}
