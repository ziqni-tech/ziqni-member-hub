import * as d3 from 'd3';

export const generatePieData = (radius, sectionsCount, getSectionFill) => {
  const pie = d3.pie()
    .sort(null)
    .value(1);

  return pie(d3.range(sectionsCount)).map((d, i) => {
    return {
      id: i + 1,
      arc: d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
        .startAngle((d, i) => (i * 2 * Math.PI) / sectionsCount)
        .endAngle((d, i) => ((i + 1) * 2 * Math.PI) / sectionsCount)(d.value, d.index),
      endAngle: d.endAngle,
      startAngle: d.startAngle,
      fill: getSectionFill(i),
      stroke: '#F2D570',
      strokeWidth: 1
    };
  });
};