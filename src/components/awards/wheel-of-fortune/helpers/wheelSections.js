import * as d3 from 'd3';
import { generatePieData } from './generatePieData';

export const createWheelSections = (
  wheelGroup,
  radius,
  sectionsCount,
  getSectionFill,
) => {
  const pieData = generatePieData(
    radius,
    sectionsCount,
    getSectionFill,
  );

  const sectionsGroup = wheelGroup.append('g')
    .selectAll('.wheel-section')
    .data(pieData)
    .enter()
    .append('path')
    .attr('class', 'wheel-section')
    .attr('id', (d) => `wheel-section-${ d.id }`)
    .attr('d', (d) => d.arc)
    .attr('fill', (d) => d.fill)
    .attr('stroke', (d) => d.stroke)
    .attr('stroke-width', (d) => d.strokeWidth);

  sectionsGroup.each(function (d) {
    d3.select(this)
      .attr('stroke', d.stroke)
      .attr('stroke-width', d.strokeWidth);
  });
};
