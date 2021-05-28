import Chart from "chart.js/auto";
export const revenueResults = [];

let chart = "";
export function selectChart() {
  const hours = [8, 10, 12, 14, 16, 18, 20, 22];

  const ctx = document.querySelector("#revenue_chart");

  if (ctx.toDataURL() == document.getElementById("blank").toDataURL()) {
    console.log("It is blank");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: hours,
        datasets: [
          {
            data: revenueResults,
            label: "Revenue",
            borderColor: "#3e95cd",
            fill: true,
          },
        ],
      },
    });
  } else {
    console.log("It is filled");
    chart = "";
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: hours,
        datasets: [
          {
            data: revenueResults,
            label: "Revenue",
            borderColor: "#3e95cd",
            fill: true,
          },
        ],
      },
    });
  }
}
