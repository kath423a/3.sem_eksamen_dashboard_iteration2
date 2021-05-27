import { settings } from "../modules/settings";
import { getRandomInteger } from "../modules/helpers";

export function makeBeerBubbles(beerTapBar) {
    // Destructoring
    const { minBubbles, maxBubbles } = settings.beerBubbles;

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

    console.log(beerTapBar);

    const liquidPercentage = (beerTapBar.level / beerTapBar.capacity) * 100;
    console.log(liquidPercentage);

    // for number of bubbles... make a bubble
    for (let index = 1; index <= numberOfBubbles; index++) {
        const template = settings.templates.beerBubble.cloneNode(true);
        const delay = getRandomInteger(minDelay, maxDelay, rangeDelay);
        const duration = getRandomInteger(
            minDuration,
            maxDuration,
            rangeDuration
        );

        template
            .querySelector(".beer-bubble")
            .style.setProperty("--beer-bubble-delay", delay);
        template
            .querySelector(".beer-bubble")
            .style.setProperty("--beer-bubble-duration", duration);
        template
            .querySelector(".beer-bubble")
            .style.setProperty("--beer-bubble-x", getRandomInteger(1, 100));

        beerTapBar.querySelector(".beer-bar__liquid").append(template);
    }

    return beerTapBar;
}
