export const stackedSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 320,
  data: { url: "data/fire_national_year.csv" },
  transform: [
    // Use the raw 'year' string as an ordinal category → no 2017.0… junk
    {
      fold: ["pct_unplanned_of_forest", "pct_planned_of_forest"],
      as: ["type", "value"]
    },
    { calculate: "toNumber(datum.value)", as: "pct" },
    { filter: "isFinite(datum.pct)" },
    {
      calculate: "datum.type === 'pct_unplanned_of_forest' ? 'Unplanned (bushfire)' : 'Planned (prescribed)'",
      as: "Category"
    }
  ],
  layer: [
    {
      mark: { type: "area" },
      encoding: {
        x: { field: "year", type: "ordinal", title: "Year" },
        y: { field: "pct", type: "quantitative", title: "% of forest burned", stack: "zero" },
        color: {
          field: "Category", type: "nominal",
          scale: { domain: ["Unplanned (bushfire)", "Planned (prescribed)"], range: ["#d7301f", "#fdd0a2"] },
          legend: { orient: "top", title: null }
        },
        order: { field: "Category", sort: "descending" },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "Category", title: "Type" },
          { field: "pct", title: "% of forest burned", format: ".2f" }
        ]
      }
    },
    // Subtle peak marker for 2019–20 (ending 2020)
    {
      transform: [
        { filter: "datum.year == '2020' && datum.type === 'pct_unplanned_of_forest'" }
      ],
      mark: { type: "text", dy: -6, fontWeight: "bold", color: "#444" },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "pct", type: "quantitative", stack: "zero" },
        text: { value: "2019–20 Black Summer Bushfires" }
      }
    }
  ],
  config: {
    view: { stroke: null },
    axis: { labelFontSize: 11, titleFontSize: 12 }
  }
};
