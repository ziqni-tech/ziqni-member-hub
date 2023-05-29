<template>
  <div
      id="wheel"
      :class="['wheel', `wheel_font-size--${modelValue.length}`]"
      :style="wheelStyle"
  />
</template>

<script setup>
import * as d3 from 'd3';
import { computed, ref, onMounted } from 'vue';

const props = defineProps({
  animDuration: {
    type: Number,
    default: 6000,
  },
  modelValue: {
    type: Object,
    default: () => ({}),
    validator: (d) => {
      return d.length <= 8;
    },
  },
  gift: {
    type: Number,
    default: 0,
  },
  imgParams: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['done']);

const arrow = ref(null);
const clicked = ref(false);
const container = ref();
const pie = ref(null);
const rayon = ref(0);
const rotation = ref(0);
const style = ref({
  width: 600,
  height: 600,
  boxShadow: '0px 2px 17px rgba(64, 106, 140, 0.82)'
});
const margin = ref(20);
const svg = ref();
const vis = ref(null);

const wheelStyle = computed(() => {
  return {
    width: `${ wheelSize.value.width }px`,
    height: `${ wheelSize.value.height }px`,
  };
});

const wheelSize = computed(() => {
  const screenWidth = window.innerWidth;
  const width = Math.min(screenWidth, style.value.width) - margin.value;
  const height = Math.min(screenWidth, style.value.width) + 120;
  return {
    width,
    height,
  };
});

let interpolate = d3.interpolate(0, 0);

const createSvg = () => {
  svg.value = d3
      .select('#wheel')
      .append('svg')
      .attr('font-size', '16px')
      .attr('height', '100%')
      .attr('width', '100%')
      .attr(
          'viewBox',
          `0 0 ${ wheelSize.value.width + margin.value * 2 } ${
              wheelSize.value.height
          }`
      )
      .data([props.modelValue])
      .append('g')
      .attr('class', 'wrapper')
      .attr(
          'transform',
          `translate(${ (wheelSize.value.width + margin.value * 2) / 2 }, ${
              wheelSize.value.height / 2
          })`
      );
};

const createDefs = () => {
  const defs = svg.value
      .append('defs')
      .append('filter')
      .attr('id', 'shadow')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '550%')
      .attr('height', '550%');
  defs
      .append('feOffset')
      .attr('in', 'SourceAlpha')
      .attr('dx', 0)
      .attr('dy', 0)
      .attr('result', 'offsetOut');
  defs
      .append('feGaussianBlur')
      .attr('stdDeviation', '9')
      .attr('in', 'offsetOut')
      .attr('result', 'drop');
  defs
      .append('feColorMatrix')
      .attr('in', 'drop')
      .attr('result', 'color-out')
      .attr('type', 'matrix')
      .attr(
          'values',
          `0 0 0 0   0
          0 0 0 0   0
          0 0 0 0   0
          0 0 0 .3 0
        `
      );
  defs
      .append('feBlend')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'color-out')
      .attr('mode', 'normal');
};

const createVis = () => {
  container.value = svg.value.append('g').attr('class', 'wheelholder');
  // Create a G on container
  vis.value = container.value.append('g');
  pie.value = d3
      .pie()
      .value(() => {
        return 1;
      })
      .padAngle(0.01)
      .sort(null);
};
const imageSize = 100

const addImage = () => {
  const arc = d3.arc().innerRadius(0).outerRadius(rayon.value)
  vis.value
      .selectAll('.middleArcText')
      .data(pie.value(props.modelValue))
      .enter()
      .append('svg:image')
      .attr('class', 'item-image')
      .attr('dy', (d) => {
        return d.endAngle > (90 * Math.PI) / 180 ? -35 : 42;
      })
      .attr('x', (d) => {
        const [x, y] = arc.centroid(d)
        return x - imageSize / 2
      })
      .attr('y', (d) => {
        const [x, y] = arc.centroid(d)
        return y - imageSize / 2
      })
      .attr('width', imageSize)
      .attr('height', imageSize)
      .attr('xlink:href', (d) => {
        return d.data.image
      })
}

const createArc = () => {
  const arc = d3.arc().outerRadius(rayon.value).innerRadius(0);
  // Create the donut slices and also the invisible arcs for the text
  vis.value
      .selectAll('.middleArcText')
      .data(pie.value(props.modelValue))
      .enter()
      .append('path')
      .attr('class', 'slice')
      .attr('d', arc)
      .attr('stroke', '#8749DC') // items borders
      .attr('stroke-width', '3')
      .attr('fill', (d, i) => {
        return d.data.bgColor;
      })
      .each(function (d, i) {
        const firstArcSection = /(^.+?)L/;
        let newArc = firstArcSection
            .exec(d3.select(this).attr('d'))[1]
            .replace(/,/g, ' ');
        if (d.endAngle > (90 * Math.PI) / 180) {
          const startLoc = /M(.*?)A/;
          const middleLoc = /A(.*?)0 0 1/;
          const endLoc = /0 0 1 (.*?)$/;
          const newStart = endLoc.exec(newArc)[1];
          const newEnd = startLoc.exec(newArc)[1];
          const middleSec = middleLoc.exec(newArc)[1];
          newArc = `M${ newStart }A${ middleSec }0 0 0${ newEnd }`;
        }
        vis.value
            .append('path')
            .attr('transform', (d) => {
              const [x, y] = arc.centroid(d)
              return `translate(${x}, ${y})`
            })
            .attr('class', 'hiddenarcs')
            .attr('id', 'middleArc' + i)
            .attr('d', newArc)
            .style('fill', 'none');
      });
};

const addText = () => {
  vis.value
      .selectAll('.middleArcText')
      .data(pie.value(props.modelValue))
      .enter()
      .append('text')
      .attr('class', 'middleArcText')
      .attr('dy', (d) => {
        return d.endAngle > (90 * Math.PI) / 180 ? -35 : 42;
      })
      .append('textPath')
      .attr('startOffset', '50%')
      .attr('text-anchor', 'middle')
      .attr('fill', (d, i) => {
        return d.data.color;
      })
      .attr('xlink:href', (d, i) => {
        return '#middleArc' + i;
      })
      .text((d) => {
        return d.data.value;
      });
};

const createMiddleCircle = () => {
  container.value
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', rayon.value / 10)
      .attr('fill', '#c077ee') // center circle color
      .attr('filter', 'url(#shadow)')
      .attr('stroke-width', 6)
      .attr('stroke', '#8749DC');
};
const createBorderCircle = () => {
  container.value
      .append('g')
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', (wheelSize.value.width - 4) / 2)
      .attr('fill', 'transparent')
      .attr('stroke-width', '8')
      .attr('filter', 'url(#shadow)')
      .attr('stroke', '#8749DC') // main circle border color
      .style('box-shadow', '0px 2px 17px rgba(64, 106, 140, 0.82)') // box-shadow ?
};

const addImgOnCenter = () => {
  const {width, height, src} = props.imgParams;
  container.value
      .append('svg:image')
      .attr('x', `-${ width / 2 }`)
      .attr('y', `-${ width / 2 }`)
      .attr('width', width)
      .attr('height', height)
      .attr('xlink:href', src);
};

const createArrow = () => {
  if (container.value) {
    arrow.value = container.value
        .append('g')
        .append('path')
        .attr('d', `M29.5015 34.8917C27.9007 36.9951 24.7362 36.9951 23.1354 34.8917L1.8143 6.87643C-0.18977 4.24313 1.68818 0.453968 4.99734 0.453968L47.6395 0.453968C50.9487 0.453968 52.8266 4.24313 50.8225 6.87642L29.5015 34.8917Z`)
        .attr('transform', 'translate(-26, -310)')
        .attr('stroke', '#FFD400')
        .attr('fill', '#FFD400')
        .attr('filter', 'url(#shadow)')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', '4');
  }
};

const findCurrentSlice = (index) => {
  return props.modelValue.findIndex((x) => x.id === index) + 1;
};

const animRotation = () => {
  return (t) => {
    return `rotate(${ interpolate(t) })`;
  };
};

const createWheel = () => {
  // Create Svg
  createSvg();
  // Create shadow filter
  createDefs();
  // Create Group container
  createVis();
  // Declare an arc generator function
  createArc();
  // Add the text
  addImage();
  addText();
  // Make circle
  createMiddleCircle();
  createBorderCircle();
  // Add img
  if (props.imgParams) {
    // addImgOnCenter();
  }
  // create arrow
  createArrow();
};

const spin = async () => {
  if (!clicked.value) {
    clicked.value = true;
    // Define current gain
    const slicedGift = findCurrentSlice(props.gift);
    const dataLength = props.modelValue.length;
    const sliceWidth = 360 / dataLength;
    const currentAngle = 360 - sliceWidth * (slicedGift - 1);
    const numberOfRotation = 360 * 5;
    const r = currentAngle + numberOfRotation;
    rotation.value = Math.round(r / sliceWidth) * sliceWidth;
    let picked = Math.round(dataLength - (rotation.value % 360) / sliceWidth);
    picked = picked >= dataLength ? picked % dataLength : picked;
    // Center slice
    const sliceSize = sliceWidth + sliceWidth / 2;
    rotation.value += sliceSize - Math.round(sliceWidth * 2);
    interpolate = d3.interpolate(0, rotation.value);
    const animateVis = () => {
      return vis.value
          .transition()
          .duration(props.animDuration)
          .ease(d3.easeBackOut.overshoot(0.3))
          .attrTween('transform', animRotation)
          .end();
    };
    await animateVis();
    clicked.value = false;
    emit('done', props.modelValue[picked]);
  }
};

defineExpose({
  spin,
});

onMounted(() => {
  rayon.value = Math.min(wheelSize.value.width, wheelSize.value.height) / 2;
  createWheel();
});
</script>

<style>
.wheel {
  /*width: 100%;*/
  /*height: auto;*/
  margin: auto;
}

.wheel textPath {
  letter-spacing: 1px;
  stroke: rgb(0 0 0 / 10%);
}

.wheel_font-size--1,
.wheel_font-size--2,
.wheel_font-size--3,
.wheel_font-size--4 {
  font-size: 16px;
}

.wheel_font-size--5,
.wheel_font-size--6 {
  font-size: 12px;
}

.wheel_font-size--7,
.wheel_font-size--8 {
  font-size: 10px;
}
</style>