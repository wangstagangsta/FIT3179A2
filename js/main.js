import { mapSpec } from './specs/mapSpec.js';
import { stackedSpec } from './specs/stackedSpec.js';
import { stateYearAreaByState } from './specs/stateYearAreaByState.js';

const el = (sel) => document.querySelector(sel);
const safeEmbed = (sel, spec) => {
  const node = el(sel);
  if (!node) return;
  return vegaEmbed(sel, spec, { actions:false })
    .then(() => console.log(`rendered ${sel}`))
    .catch(err => {
      console.error(err);
      node.innerHTML = `<div style="color:#b00020;background:#fee;padding:.75rem;border-radius:8px;">
        Chart failed: <code>${err.message || err}</code>
      </div>`;
    });
};

// state
let currentField = 'pct_unplanned_of_forest'; // for the map (%)
let currentYear  = 2020;

// mounts
const mountMap     = (field, yr) => safeEmbed('#map', mapSpec(field, yr));
const mountStacked = ()          => safeEmbed('#stacked', stackedSpec);
const mountStateYearArea = (yr)  => {
  const useLog = !!el('#logScale')?.checked;
  return safeEmbed('#stateYearArea', stateYearAreaByState(yr, useLog));
};

// initial
mountStateYearArea(currentYear);
mountMap(currentField, currentYear);
mountStacked();

// controls
const yearSlider = el('#year');
const yearLabel  = el('#yearLabel');
const mapNote    = el('#mapNote');
const logChk     = el('#logScale');

const updateMapNote = () => {
  if (!mapNote) return;
  const isUnplanned = currentField === 'pct_unplanned_of_forest';
  mapNote.innerHTML = `Showing <strong>% of each state's forest area burned (${isUnplanned ? 'unplanned' : 'planned'})</strong> in the selected year.`;
};
updateMapNote();

if (yearSlider) {
  yearSlider.addEventListener('input', (e) => {
    currentYear = +e.target.value;
    if (yearLabel) yearLabel.textContent = currentYear;
    mountMap(currentField, currentYear);
    mountStateYearArea(currentYear);
  });
}

if (logChk) {
  logChk.addEventListener('change', () => {
    mountStateYearArea(currentYear); // re-render with/without log
  });
}
