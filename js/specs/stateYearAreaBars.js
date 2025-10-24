// Small-multiple bars: area (ha) burned per state, by year
export const stateYearAreaBars = (pctField) => {
  // map your dropdown value → area field + color
  const isPlanned = pctField === 'pct_planned_of_forest';
  const areaField = isPlanned ? 'pixels_planned' : 'pixels_unplanned';
  const color = isPlanned ? '#3182bd' : '#d7301f';

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: { url: "data/fire_state_year.csv" },
    transform: [
      { calculate: "toNumber(datum.year)", as: "yearNum" },
      { calculate: `toNumber(datum.${areaField})`, as: "area_ha" },
      { filter: "isFinite(datum.area_ha)" }
    ],

    // make a grid of small charts (facets) — one per state
    facet: { field: "STATE", columns: 4, header: { title: null } },
    spec: {
      width: 160,
      height: 120,
      mark: { type: "bar", cornerRadiusEnd: 2, color },
      encoding: {
        x: { field: "yearNum", type: "ordinal", title: "Year" },
        y: { field: "area_ha", type: "quantitative", title: "Area burned (ha)", axis: { format: ",.0f" } },
        tooltip: [
          { field: "STATE", title: "State" },
          { field: "year",  title: "Year" },
          { field: areaField, title: "Area burned (ha)", format: ",.0f" }
        ]
      }
    },

    // independent y-scales so each state remains readable
    resolve: { scale: { y: "independent" } },
    config: { view: { stroke: null }, axis: { labelFontSize: 10, titleFontSize: 11 } }
  };
};
