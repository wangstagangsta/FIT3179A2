// Area burned (ha) by state in selected year — grouped bars for unplanned vs planned
export const stateYearAreaByState = (yearValue) => ({
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 360,
  params: [{ name: "yr", value: String(yearValue) }],
  data: { url: "data/fire_state_year.csv" },
  transform: [
    { filter: "datum.year == yr" },
    { calculate: "toNumber(datum.pixels_unplanned)", as: "ha_unplanned" },
    { calculate: "toNumber(datum.pixels_planned)", as: "ha_planned" },
    { calculate: "datum.ha_unplanned + datum.ha_planned", as: "ha_total" },
    { fold: ["ha_unplanned", "ha_planned"], as: ["kind", "ha"] },
    {
      calculate:
        "datum.kind === 'ha_unplanned' ? 'Unplanned (bushfire)' : 'Planned (prescribed)'",
      as: "Category"
    }
  ],

  mark: { type: "bar", cornerRadiusEnd: 2 },

  encoding: {
    x: {
      field: "STATE",
      type: "nominal",
      sort: { field: "ha_total", order: "descending" },
      title: "State",
      axis: { labelAngle: 0 }
    },
    xOffset: { field: "Category" }, // grouped bars
    y: {
      field: "ha",
      type: "quantitative",
      title: "Area burned (ha)",
      axis: { format: ",.0f" },
      scale: { nice: true, zero: true }
    },
    color: {
      field: "Category",
      type: "nominal",
      scale: {
        domain: ["Unplanned (bushfire)", "Planned (prescribed)"],
        range: ["#d7301f", "#3182bd"]
      },
      legend: { orient: "top", title: null, symbolType: "square" }
    },
    tooltip: [
      { field: "STATE", title: "State" },
      { field: "year", title: "Year" },
      { field: "ha_unplanned", title: "Unplanned (ha)", format: ",.0f" },
      { field: "ha_planned", title: "Planned (ha)", format: ",.0f" },
      { field: "ha_total", title: "Total (ha)", format: ",.0f" }
    ]
  },

  config: {
    view: { stroke: null },
    axis: { labelFontSize: 11, titleFontSize: 12, grid: true },
    bar: { binSpacing: 2 }
  }
});
