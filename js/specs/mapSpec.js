export const mapSpec = (field, yearValue) => {
  const legendTitle =
    field === 'pct_unplanned_of_forest'
      ? '% of state forest burned (unplanned)'
      : '% of state forest burned (planned)';
  const domainMax = 60;

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 800,
    height: 480,
    projection: { type: "mercator", center: [134, -27] },
    params: [{ name: "yr", value: String(yearValue) }],
    data: { url: "topo/aus_states.topojson", format: { type: "topojson", feature: "austates" } },
    transform: [
      { calculate: "['NSW','Vic','Qld','SA','WA','Tas','NT','ACT'][datum.id]", as: "STATE" },
      { calculate: "datum.STATE + '-' + yr", as: "STATE_YEAR" },
      {
        lookup: "STATE_YEAR",
        from: {
          data: { url: "data/fire_state_year.csv" },
          key: "STATE_YEAR",
          fields: [
            "year","pixels_forest","pixels_unplanned","pixels_planned",
            "pct_unplanned_of_forest","pct_planned_of_forest"
          ]
        }
      },
      { calculate: "datum.pixels_unplanned", as: "ha_unplanned" },
      { calculate: "datum.pixels_planned",   as: "ha_planned" },
      {
        calculate:
          "(isValid(datum.pct_unplanned_of_forest)?toNumber(datum.pct_unplanned_of_forest):0)+"
          +"(isValid(datum.pct_planned_of_forest)?toNumber(datum.pct_planned_of_forest):0)",
        as: "pct_total_of_forest"
      }
    ],
    layer: [
      { mark: { type: "geoshape", fill: "#f2f2f2", stroke: "#fff", strokeWidth: 0.5 } },
      {
        transform: [{ filter: "isValid(datum.year)" }],
        mark: { type: "geoshape", stroke: "#fff", strokeWidth: 0.6 },
        encoding: {
          color: {
            field: field, type: "quantitative", title: legendTitle,
            scale: { scheme: "reds", domain: [0, domainMax], clamp: true },
            legend: { labelExpr: "datum.label + ' %'" }
          },
          tooltip: [
            { field: "STATE", title: "State" },
            { field: "year",  title: "Fire season (ending)" },
            { field: "pct_planned_of_forest", title: "Planned burned (% of forest)", format: ".2f" },
            { field: "pct_total_of_forest",   title: "Total burned (% of forest)",   format: ".2f" },
            { field: "ha_unplanned", title: "Unplanned area (ha)", format: ",.0f" },
            { field: "ha_planned",   title: "Planned area (ha)",   format: ",.0f" },
            { field: "pixels_forest", title: "Forest area baseline (ha)", format: ",.0f" }
          ]
        }
      },
      { mark: { type: "geoshape", fill: null, stroke: "#bbb", strokeWidth: 0.6 } }
    ]
  };
};
