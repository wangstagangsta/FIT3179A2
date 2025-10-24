// One big chart: area (ha) burned by state in the selected year,
// grouped bars for Unplanned vs Planned. Optional log scale.
export const stateYearAreaByState = (yearValue, useLog = false) => ({
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 360,
  params: [{ name: "yr", value: String(yearValue) }],
  data: { url: "data/fire_state_year.csv" },
  transform: [
    { filter: "datum.year == yr" },

    // numeric + convenience fields
    { calculate: "toNumber(datum.pixels_unplanned)", as: "ha_unplanned" },
    { calculate: "toNumber(datum.pixels_planned)",   as: "ha_planned" },
    { calculate: "datum.ha_unplanned + datum.ha_planned", as: "ha_total" },

    // long form → two bars per state
    { fold: ["ha_unplanned", "ha_planned"], as: ["kind", "ha"] },
    {
      calculate:
        "datum.kind === 'ha_unplanned' ? 'Unplanned (bushfire)' : 'Planned (prescribed)'",
      as: "Category"
    },

    // for log scale: replace 0/negative with 1 (log can't show 0)
    { calculate: "datum.ha <= 0 ? 1 : datum.ha", as: "ha_pos" }
  ],

  mark: { type: "bar", cornerRadiusEnd: 2 },
  encoding: {
    x: {
      field: "STATE", type: "nominal",
      sort: { field: "ha_total", order: "descending" },  // rank by total area burned
      title: "State",
      axis: { labelAngle: 0 }
    },

    // use ha (linear) or ha_pos (log) depending on flag
    y: {
      field: useLog ? "ha_pos" : "ha",
      type: "quantitative",
      title: "Area burned (ha)",
      axis: { format: ",.0f" },
      scale: useLog ? { type: "log", base: 10, nice: true, clamp: true } : { nice: true }
    },

    color: {
      field: "Category", type: "nominal",
      scale: {
        domain: ["Unplanned (bushfire)", "Planned (prescribed)"],
        range: ["#d7301f", "#3182bd"]
      },
      legend: { orient: "top", title: null, symbolType: "square" }
    },

    tooltip: [
      { field: "STATE",        title: "State" },
      { field: "year",         title: "Year" },
      { field: "ha_unplanned", title: "Unplanned (ha)", format: ",.0f" },
      { field: "ha_planned",   title: "Planned (ha)",   format: ",.0f" },
      { field: "ha_total",     title: "Total (ha)",     format: ",.0f" }
    ]
  },

  config: {
    view: { stroke: null },
    axis: { labelFontSize: 11, titleFontSize: 12, grid: true },
    bar: { binSpacing: 2 }
  }
});
