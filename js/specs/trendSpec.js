export const trendSpec = (field) => ({
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "National forest burned (%), 2017–2021. Dropdown swaps unplanned vs planned.",
  width: "container",
  height: 320,
  data: { url: "data/fire_national_year.csv" },
  params: [{ name: "metricField", value: field }],
  transform: [
    { calculate: "toNumber(datum.year)", as: "yearNum" },
    { calculate: "datum[metricField]", as: "metric" },
    { calculate: "toNumber(datum.pct_unplanned_of_forest)+toNumber(datum.pct_planned_of_forest)", as: "pct_total" }
  ],
  layer: [
    {
      mark: { type: "line", interpolate: "monotone" },
      encoding: {
        x: { field: "yearNum", type: "quantitative", title: "Year", axis: { format: "f" } },
        y: { field: "metric", type: "quantitative", title: "% of forest burned" },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "pct_unplanned_of_forest", title: "% Unplanned", format: ".2f" },
          { field: "pct_planned_of_forest", title: "% Planned", format: ".2f" },
          { field: "pct_total", title: "% Total", format: ".2f" }
        ]
      }
    },
    {
      transform: [{ filter: "datum.year == '2020'" }],
      mark: { type: "text", dy: -10, fontWeight: "bold" },
      encoding: { x: { field: "yearNum" }, y: { field: "metric" }, text: { value: "2019–20 peak" }, color: { value: "#444" } }
    }
  ]
});
