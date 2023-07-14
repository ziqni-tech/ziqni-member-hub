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

const isGiftSection = (section) => {
  return props.gift === section;
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
        return isMobile.value ? 25 :  37;
      })
      .each(function (d) {
        const text = d3.select(this);
        const isReversed = d.endAngle > (90 * Math.PI) / 180

        if (isReversed) {
          text.attr('transform', (d) => {
            let rotate;
            switch (d.data.section) {
              case 1: // bonus 1
                rotate = 180
                break;
              case 2: // free 1
                rotate = 420
                break;
              case 3: // next time 1
                rotate = 120
                break;
              case 4: // bonus 2
                rotate = 180
                break;
              case 5: // free 2
                rotate = 240
                break;
              case 6: // next 2
                rotate = 300;
                break;
            }
            return `rotate(${rotate})`;
          })
        }

        text
            .append('textPath')
            .attr('startOffset', '50%')
            .attr('text-anchor', 'middle')
            .attr('fill', (d, i) => {
              return d.data.color;
            })
            .attr('xlink:href', (d, i) => {
              return '#middleArc' + i;
            })
            .text(d.data.value)
      });
};


const imageSize = computed(() => isMobile.value ? 165 : 330);

const addImage = () => {
  const arc = d3.arc().innerRadius(0).outerRadius(rayon.value);

  const sections = vis.value
      .selectAll('.middleArcText')
      .data(pie.value(props.modelValue))
      .enter()
      .append('g')
      .attr('class', 'image-section');

  sections.attr('transform', (d) => {
    const centroid = arc.centroid(d);
    const angle = d.startAngle + (d.endAngle - d.startAngle) / 2
    const radius = rayon.value / 2
    const imageRadius = radius - imageSize.value / 2

    const x = (centroid[0] + Math.cos(angle) * imageRadius);

    const y = (centroid[1] + Math.sin(angle) * imageRadius);

    let rotate;
    switch (d.data.section) {
      case 1: // bonus 1
        rotate = 210.5
        break;
      case 2: // free 1
        rotate = 210
        break;
      case 3: // next time 1
        rotate = 210
        break;
      case 4: // bonus 2
        rotate = 210.5
        break;
      case 5: // free 2
        rotate = 210
        break;
      case 6: // next 2
        rotate = 210;
        break;
      default:
        rotate = d.endAngle + 30
        break
    }
    return `rotate(${rotate}, ${x}, ${y}) translate(${x}, ${y})`;
  });

  sections
      .append('image')
      .attr('x', (d) => {
        switch (d.data.section) {
          case 1: // bonus 1
            return isMobile.value ? -114 : -210;
          case 2: // free 1
            return isMobile.value ? -95 : -157;
          case 3: // next time 1
            return isMobile.value ? -101 : -111;
          case 4: // bonus 2
            return isMobile.value ? -126 : -118;
          case 5: // free 2
            return isMobile.value ? -145 : -173;
          case 6: // next 2
            return isMobile.value ? -139 : -219;

        }
      })
      .attr('y', (d) => {
        switch (d.data.section) {
          case 1: // bonus 1
            return isMobile.value ? -202 : -215;
          case 2: // free 1
            return isMobile.value ? -155 : -195;
          case 3: // next time 1
            return isMobile.value ? -193 : -249;
          case 4: // bonus 2
            return isMobile.value ? -135 : -122;
          case 5: // free 2
            return isMobile.value ? -185 : -142;
          case 6: // next 2
            return isMobile.value ? -164 : -117;

        }
      })
      .attr('width', (d) => {
        if (d.data.section === 3) {
          return isMobile.value ? 195 : 265
        } else {
          return isMobile.value ? 240 : 329
        }
      })
      .attr('height', (d) => {
        return d.data.section === 5 ? 340 : 335
      })
      .attr('xlink:href', (d) => `${d.data.bg}`)

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
  // Add the image
  addImage();
  // Add the text
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
            isStopped = true; // mark wheel stopped

            const sections = vis.value.selectAll('.slice');
            sections
                .attr('stroke-width', (d, i) =>
                    isGiftSection(d.data.section) ? '10' : '2'
                )
                .attr('stroke', (d, i) =>
                    isGiftSection(d.data.section) ? '#c077ee' : '#8749DC'
                )
            const texts = vis.value.selectAll('.middleArcText');
            texts
                .attr('filter', (d, i) => {
                      return isGiftSection(d.data.section) ? 'none' : 'blur(3px)'
                    }
                );
            const images = vis.value.selectAll('.image-section');
            images
                .attr('filter', (d, i) => {
                      return isGiftSection(d.data.section) ? 'none' : 'blur(3px)'
                    }
                );
          });
    };

    await animateVis();
    clicked.value = false;
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
    top: 61%;
    left: 50%;
    transform: translate(-50%, -50%);
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