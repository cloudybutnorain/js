export function influxToBillboard(raw, isTimeseries) {

  if( raw["results"] === undefined ) {
      return [];
  }

  // todo, any kind of error handling around this
  let series = raw["results"][0]["series"];

  // if ts, return the x axis and then one series per tagset returned
  if (isTimeseries) {

    let names = series.map((s) => Object.values(s["tags"])[0]);
    names = names.map((n) => (n == "") ? "(none)" : n);
    let values = series.map((s) => s["values"].map((v) => v[1]));
    names.forEach((name, index) => values[index].unshift(name));

    let ticks = series.map((s) => s["values"].map((v) => v[0]))[0];
    ticks.unshift("x")

    return [ticks, ...values]

  // if not, is a non-time-related query, and x axis is categorical
  } else {

    let names = series.map((s) => Object.values(s["tags"])[0]);
    names = names.map((n) => (n == "") ? "(none)" : n);
    names = names.map((n) => n.padStart(12, '⠀')); // U+2800 BRAILLE PATTERN BLANK
    names.unshift("x")

    let values = series.map((s) => s["values"].map((v) => v[1])).flat();
    values.unshift("data")

    return [names, values]

  }
}

export function randomInt(max) {
  return Math.floor(Math.random() * max);
}
