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
        :is-dark-mode="isDarkMode"
    />
  </div>
</template>

<script setup>
import * as d3 from 'd3';
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import useMobileDevice from '@/hooks/useMobileDevice';
import AwardsModal from '@/components/awards/AwardsModal.vue';
import { useStore } from 'vuex';

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
  emit('claim');
  isShowModal.value = false;

};

const closeModal = () => {
  console.warn('RETURN');
  emit('closeModal');
  isShowModal.value = false;
};

const isShowModal = ref(false);
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
const isMobileDevice = ref(false);

const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);

const checkIsMobile = () => {
  isMobileDevice.value = window.innerWidth <= 450;
};

const wheelStyle = computed(() => {
  const width = isMobileDevice.value ? 230 : 355;
  const height = isMobileDevice.value ? 350 : 395;
  return {
    width: `${ width }px`,
    height: `${ height }px`,
  };
});

const wheelSize = computed(() => {
  const screenWidth = window.innerWidth;
  const width = 480 - margin.value;
  const height = 520 + 20;
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
      .append('defs');

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
      .attr('stroke', '#8D0C71') // items borders
      .attr('stroke-width', '2')
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
        return isMobile.value ? 25 : 37;
      })
      .each(function (d) {
        const text = d3.select(this);
        const isReversed = d.endAngle > (90 * Math.PI) / 180;

        if (isReversed) {
          text.attr('transform', (d) => {
            let rotate;
            switch (d.data.section) {
              case 1: // bonus 1
                rotate = 180;
                break;
              case 2: // free 1
                rotate = 420;
                break;
              case 3: // next time 1
                rotate = 120;
                break;
              case 4: // bonus 2
                rotate = 180;
                break;
              case 5: // free 2
                rotate = 240;
                break;
              case 6: // next 2
                rotate = 300;
                break;
            }
            return `rotate(${ rotate })`;
          });
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
            .text(d.data.value);
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
    const angle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    const radius = rayon.value / 2;
    const imageRadius = radius - imageSize.value / 2;

    const x = (centroid[0] + Math.cos(angle) * imageRadius);

    const y = (centroid[1] + Math.sin(angle) * imageRadius);

    let rotate;
    switch (d.data.section) {
      case 1: // bonus 1
        rotate = 210.5;
        break;
      case 2: // free 1
        rotate = 210;
        break;
      case 3: // next time 1
        rotate = 210;
        break;
      case 4: // bonus 2
        rotate = 210.5;
        break;
      case 5: // free 2
        rotate = 210;
        break;
      case 6: // next 2
        rotate = 210;
        break;
      default:
        rotate = d.endAngle + 30;
        break;
    }
    return `rotate(${ rotate }, ${ x }, ${ y }) translate(${ x }, ${ y })`;
  });

  sections
      .append('image')
      .attr('x', (d) => {
        switch (d.data.section) {
          case 1: // bonus 1
            return isMobile.value ? -122 : -205;
          case 2: // free 1
            return isMobile.value ? -110 : -153;
          case 3: // next time 1
            return isMobile.value ? -143 : -102;
          case 4: // bonus 2
            return isMobile.value ? -187 : -105;
          case 5: // free 2
            return isMobile.value ? -200 : -160;
          case 6: // next 2
            return isMobile.value ? -167 : -209;

        }
      })
      .attr('y', (d) => {
        switch (d.data.section) {
          case 1: // bonus 1
            return isMobile.value ? -212 : -210;
          case 2: // free 1
            return isMobile.value ? -130 : -203;
          case 3: // next time 1
            return isMobile.value ? -180 : -251;
          case 4: // bonus 2
            return isMobile.value ? -125 : -126;
          case 5: // free 2
            return isMobile.value ? -205 : -137;
          case 6: // next 2
            return isMobile.value ? -185 : -112;

        }
      })
      .attr('width', (d) => {
        if (d.data.section === 3) {
          return 255;
        } else {
          return 310;
        }
      })
      .attr('height', (d) => {
        return 335;
      })
      .attr('xlink:href', (d) => `${ d.data.bg }`);

};

const createMiddleCircle = () => {
  container.value
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', rayon.value / 12)
      .attr('fill', '#EE3EC8') // center circle color
      .attr('filter', 'url(#shadow)')
      .attr('stroke-width', 7)
      .attr('stroke', '#8D0C71');
};


const createOuterCircle = () => {
  container.value
      .append('circle')
      .attr('class', 'outer-border')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', rayon.value)
      .attr('fill', 'none')
      .attr('stroke-width', 15)
      .attr('stroke', isDarkMode.value ? '#2F0426' : '#BEE9F3');
};

watch(isDarkMode, (value) => {
  if (container.value) {
    const outerBorder = container.value.selectAll('.outer-border')
    outerBorder.attr('stroke', value ? '#2F0426' : '#BEE9F3')
  }
})

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
  // Make outer circle
  createOuterCircle();
  // create arrow
  createArrow();
};

watch(isDarkMode, (value) => {
  if (value) {}
})

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
                    isGiftSection(d.data.section) ? '5' : '1'
                )
                .attr('stroke', (d, i) =>
                    isGiftSection(d.data.section) ? '#EE3EC8' : '#8D0C71'
                );

            const texts = vis.value.selectAll('.middleArcText');
            texts
                .attr('filter', (d, i) => {
                      return isGiftSection(d.data.section) ? 'none' : 'blur(3px)';
                    }
                )
                .attr('stroke-width', (d, i) =>
                    isGiftSection(d.data.section) ? '15' : '3'
                );

            const images = vis.value.selectAll('.image-section');
            images
                .attr('filter', (d, i) => {
                      return isGiftSection(d.data.section) ? 'none' : 'blur(3px)';
                    }
                );

            // remove outer circle
            const outerBorder = container.value.selectAll('.outer-border');
            outerBorder.remove();

            // Move the prize section to the front
            const prizeSection = sections.filter((d, i) => isGiftSection(d.data.section));
            prizeSection.raise();
            prizeSection.attr('fill', 'none');
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
  window.addEventListener('resize', checkIsMobile);
  checkIsMobile();

  rayon.value = Math.min(wheelSize.value.width, wheelSize.value.height) / 2;
  createWheel();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile);
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
    margin: 0;
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