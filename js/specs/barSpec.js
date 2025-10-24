export const barSpec = (field, yearValue) => ({
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 320,
  data: { url: "data/fire_state_year.csv" },
  params: [{ name: "yr", value: String(yearValue) }],
  transform: [
    { filter: "datum.year == yr" },
    { calculate: "isValid(datum[field]) ? toNumber(datum[field]) : 0", as: "metric" }
  ],
  layer: [
    {
      mark: { type: "bar", cornerRadiusEnd: 2 },
      encoding: {
        y: { field: "STATE", type: "nominal", sort: "-x", title: null },
        x: { field: "metric", type: "quantitative",
             title: field === 'pct_unplanned_of_forest' ? "% unplanned (of forest)" : "% planned (of forest)" },
        color: { value: field === 'pct_unplanned_of_forest' ? "#d7301f" : "#9ecae1" },
        tooltip: [
          { field: "STATE", title: "State" },
          { field: "year", title: "Fire season (ending)" },
          { field: "pct_unplanned_of_forest", title: "% Unplanned", format: ".2f" },
          { field: "pct_planned_of_forest", title: "% Planned", format: ".2f" }
        ]
      }
    },
    { mark: { type: "rule", color: "#aaa" }, encoding: { x: { value: 0 } } }
  ],
  config: { axis: { grid: true, tickSize: 0 } }
});
