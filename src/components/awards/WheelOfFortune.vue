<template>
  <div
      id="wheel"
      :class="['wheel', `wheel_font-size--${modelValue.length}`]"
      :style="wheelStyle"
  >
    <AwardsModal
        v-if="isShowModal"
        class="prize-modal"
        :message="message"
        :title="titleMessage"
        :btnLabel="btnTitle"
        @doFunction="isWinner ? claim() : closeModal()"
    />
  </div>
</template>

<script setup>
import * as d3 from 'd3';
import { computed, ref, onMounted } from 'vue';
import useMobileDevice from '@/hooks/useMobileDevice';
import AwardsModal from '@/components/awards/AwardsModal.vue';

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

const emit = defineEmits(['claim', 'closeModal']);

const claim = () => {
  console.warn('CLAIM');
  emit('claim')
  isShowModal.value = false;

};

const closeModal = () => {
  console.warn('RETURN');
  emit('closeModal')
  isShowModal.value = false;
};

const isShowModal = ref(false)
const titleMessage = ref('');
const message = ref('');
const btnTitle = ref('');
const isWinner = ref(false);
const done = (r) => {
  if (r.value !== 'Next time') {
    titleMessage.value = 'Congratulations!';
    message.value = `You won ${ r.value }`;
    btnTitle.value = 'Claim';
    isWinner.value = true;
  } else {
    titleMessage.value = 'Didn\'t win this time!';
    message.value = `Wishing you better luck in the future`;
    btnTitle.value = 'Return';
    isWinner.value = false;
  }

  isShowModal.value = true;
};

const arrow = ref(null);
const clicked = ref(false);
const container = ref();
const pie = ref(null);
const rayon = ref(0);
const rotation = ref(0);
const { isMobile } = useMobileDevice();
const style = ref({
  width: 500,
  height: 500,
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
  const height = Math.min(screenWidth, style.value.width) + 20;
  return {
    width,
    height,
  };
});

let interpolate = d3.interpolate(0, 0);

const isGiftSection = (index) => {
  return props.gift === index;
};

const createSvg = () => {
  svg.value = d3
      .select('#wheel')
      .append('svg')
      .attr('font-size', '16px')
      .attr('height', '100%')
      .attr('width', '100%')
      .attr('filter', 'drop-shadow(0px 2px 17px rgba(64, 106, 140, 0.82))')
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
      .attr('overflow', 'none')
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
              const [x, y] = arc.centroid(d);
              return `translate(${ x }, ${ y })`;
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

const imageSize = computed(() => isMobile.value ? 55 : 90);

const addImage = () => {
  const arc = d3.arc().innerRadius(0).outerRadius(rayon.value);

  const sections = vis.value
      .selectAll('.middleArcText')
      .data(pie.value(props.modelValue))
      .enter()
      .append('g')
      .attr('class', 'section');

  sections.attr('transform', (d) => {
    const centroid = arc.centroid(d);
    const rotationAngle = d.endAngle > (90 * Math.PI) / 180 ? -35 : 42;
    const x = (centroid[0] + imageSize.value / 20) - 5;
    const y = (centroid[1] + imageSize.value / 20) - 5;
    return `rotate(${rotationAngle}, ${x}, ${y}) translate(${x}, ${y})`;
  });

  sections
      .append('image')
      .attr('x', -imageSize.value / 2)
      .attr('y', -imageSize.value / 2)
      .attr('width', imageSize.value)
      .attr('height', imageSize.value)
      .attr('xlink:href', (d) => d.data.image)
      .attr('clip-path', 'url(#clip-path)');

  sections
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip-path')
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', imageSize.value / 2);
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

const createArrow = () => {
  if (container.value) {
    arrow.value = container.value
        .append('g')
        .append('path')
        .attr('d', `M29.5015 34.8917C27.9007 36.9951 24.7362 36.9951 23.1354 34.8917L1.8143 6.87643C-0.18977 4.24313 1.68818 0.453968 4.99734 0.453968L47.6395 0.453968C50.9487 0.453968 52.8266 4.24313 50.8225 6.87642L29.5015 34.8917Z`)
        .attr('transform', `translate(-26, -${ (wheelSize.value.height / 2) })`)
        .attr('stroke', '#FFD400')
        .attr('fill', '#FFD400')
        .attr('filter', 'url(#shadow)')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', '4');
  }
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
  // create arrow
  createArrow();
};

let isStopped = false;

const spin = async () => {
  if (!clicked.value && !isStopped) {
    clicked.value = true;
    const dataLength = props.modelValue.length;
    const sliceWidth = 360 / dataLength;
    const currentAngle = 360 - sliceWidth * (props.gift - 0.5);
    const numberOfRotation = 360 * 5;
    const targetRotation = currentAngle + numberOfRotation;

    rotation.value = 0; // Сбросить текущий угол вращения

    // Создать интерполяцию для плавного перехода
    interpolate = d3.interpolate(rotation.value, targetRotation);

    const animateVis = () => {
      return vis.value
          .transition()
          .duration(props.animDuration)
          .ease(d3.easeBackOut.overshoot(0.3))
          .tween('rotation', () => (t) => {
            rotation.value = interpolate(t); // Обновить текущий угол вращения
            vis.value.attr('transform', `rotate(${ rotation.value })`);
          })
          .end()
          .then(() => {
            isStopped = true; // Отметить, что колесо остановлено
            const prizeSection = Math.floor(
                ((360 - rotation.value) % 360) / sliceWidth
            );
            const sections = vis.value.selectAll('.slice');
            sections
                .attr('stroke-width', (d, i) =>
                    isGiftSection(i + 1) ? '8' : '2'
                )
                .attr('stroke', (d, i) =>
                    isGiftSection(i + 1) ? '#c077ee' : '#8749DC'
                )
                .attr('filter', (d, i) =>
                    isGiftSection(i + 1) ? 'none' : 'blur(5px)'
                );
            // Move the prize section to the front
            const prizeNode = sections.nodes()[prizeSection];
            sections.nodes().forEach((node) => {
              if (node === prizeNode) {
                node.parentNode.appendChild(node);
              }
            });
          });
    };

    await animateVis();
    clicked.value = false;
    // emit('done', props.modelValue[props.gift - 1]);
    done(props.modelValue[props.gift - 1]);
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
  position: relative;

  .prize-modal {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -60%);
    z-index: 10;
  }
}

@media screen and (max-width: $tableWidth) {
  .wheel {
    /*width: 100%;*/
    height: 400px;
    margin: auto;
  }
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