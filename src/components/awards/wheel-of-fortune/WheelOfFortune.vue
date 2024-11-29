<template>
  <div
    id="wheel"
    :class="['wheel', `wheel_font-size--${modelValue.length}`]"
    :style="wheelStyle"
  >
    <WheelOfFortuneModal
      v-if="isShowModal"
      class="prize-modal"
      :message="message"
      :title="titleMessage"
      :btnLabel="btnTitle"
      @doFunction="isWinner ? claim() : closeModal()"
      :is-dark-mode="isDarkMode"
      :reward="reward"
    />
  </div>
</template>

<script setup>
import * as d3 from 'd3';
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import useMobileDevice from '@/hooks/useMobileDevice';
import WheelOfFortuneModal from '@/components/awards/wheel-of-fortune/WheelOfFortuneModal.vue';
import { useStore } from 'vuex';
import { ApiClientStomp, FilesApiWs } from '@ziqni-tech/member-api-client';
import { createWheelSections } from '@/components/awards/wheel-of-fortune/helpers/wheelSections';
import {createSpinnerWheel, createSpinnerWheelWithAnimation} from 'spinning-wheel'
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
  wheelSettings: {
    type: Object,
    default: () => ({
      buttonText: '<p><strong class="ql-font-arial" style="color: #F4B41C;">SPIN</strong></p>',
      wheelBackground: '#5E084B',
      spinButtonBackground: '#5E084B',
      icon: '',
      wheelBorderImage: '',
      wheelImage: '',
      wheelButtonImage: '',
      wheelArrowImage: ''
    }),
  },
  messageSettings: {
    type: Object,
    default: () => ({
      celebrationMessage: '<p><em style="background-color: rgb(243, 243, 243); color: rgb(0, 0, 0);">Celebration Message Header</em></p>',
      celebrationText: '<p><em style="background-color: rgb(243, 243, 243); color: rgb(0, 0, 0);">Celebration Message Body</em></p>',
      celebrationImage: '',
      shapeOfCelebrationMessageBox: '',
      isCelebrationAnimation: true,
      sorryMessage: '<p><em style="background-color: rgb(243, 243, 243); color: rgb(0, 0, 0);">Sorry Message Header</em></p>',
      sorryText: '<p><em style="background-color: rgb(243, 243, 243); color: rgb(0, 0, 0);">Sorry Message Body</em></p>',
      sorryImage: '',
      shapeOfSorryMessageBox: '',
      isSorryAnimation: false
    }),
  },
});

const emit = defineEmits(['claim', 'closeModal']);

const defaultWheelBorderUri = 'https://first-space.cdn.ziqni.com/Spinning%20Wheel/frame%204.png';
// import defaultWheelBorderUri from '@/assets/images/instant-wins/single-wheel_bgs/frame 4.png';
const defaultWheelImgUri = 'https://first-space.cdn.ziqni.com/Spinning%20Wheel/middle%20part%204.png';
// import defaultWheelImgUri from '@/assets/images/instant-wins/single-wheel_bgs/middle part 4.png';
// const defaultWheelImgUri = '';
const defaultButtonUri = 'https://first-space.cdn.ziqni.com/Spinning%20Wheel/button%204.png';
// import defaultButtonUri from '@/assets/images/instant-wins/single-wheel_bgs/button 4.png';
const defaultArrowUri = 'https://first-space.cdn.ziqni.com/Spinning%20Wheel/arrow%206.png';
// import defaultArrowUri from '@/assets/images/instant-wins/single-wheel_bgs/arrow 6 .png';

const claim = () => {
  console.warn('CLAIM');
  emit('claim');
  isShowModal.value = false;
  reward.value = null;
  resetWheel();

};

const closeModal = () => {
  emit('closeModal');
  isShowModal.value = false;
  reward.value = null;
  resetWheel();
};

const isShowModal = ref(false);
const titleMessage = ref('');
const message = ref('');
const reward = ref();
const btnTitle = ref('');
const isWinner = ref(false);

const done = async (r) => {
  if (r.reward && r.reward.name) {
    titleMessage.value = props.messageSettings.celebrationMessage
      ? props.messageSettings.celebrationMessage
      : 'Congratulations!';
    message.value = props.messageSettings.celebrationText
      ? props.messageSettings.celebrationText
      : `You won`;
    reward.value = { name: r.reward.name, value: r.reward.rewardValue };
    btnTitle.value = 'Claim';
    isWinner.value = true;
  } else {
    titleMessage.value = props.messageSettings.sorryMessage
      ? props.messageSettings.sorryMessage
      : 'Didn\'t win this time!';
    message.value = props.messageSettings.sorryText
      ? props.messageSettings.sorryText
      : `Wishing you better luck in the future`;
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
const margin = ref(50);
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

const iconUris = ref([]);
const colorScale = ref(['#EE3EC8', '#7ED4E7']);
const radius = rayon.value;
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

// const createDefs = () => {
//   const defs = svg.value
//     .append('defs');
//
//   defs
//     .append('feBlend')
//     .attr('in', 'SourceGraphic')
//     .attr('in2', 'color-out')
//     .attr('mode', 'normal');
// };

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

  vis.value
    .selectAll('.middleArcText')
    .data(pie.value(props.modelValue))
    .enter()
    .append('path')
    .attr('class', 'wheel-section')
    .attr('d', arc)
    .attr('stroke', 'none') // items borders
    .attr('stroke-width', '2')
    .attr('overflow', 'none')
    .attr('fill', 'none');
};

const addTextElements = (modelValue) => {
  const sectionsCount = modelValue.length;
  const angleBetweenSections = 360 / sectionsCount;
  const radius = rayon.value;

  vis.value.selectAll('.section-text')
    .data(pie.value(modelValue))
    .enter()
    .append('foreignObject')
    .attr('class', 'section-text')
    .attr('width', (d, i) => {
      const isVerticallyText = modelValue[i].constraints.includes('isVerticallyText');
      if (modelValue[i] && modelValue[i].text && isVerticallyText) {
        return radius;
      } else {
        const angleInRadians = (angleBetweenSections * Math.PI) / 180;
        return 2 * radius * Math.sin(angleInRadians / 2);
      }
    })
    .attr('height', (d, i) => getHeightFromHeader(modelValue[i].text))
    .attr('transform', (d, i) => {
      const isVerticallyText = props.modelValue[i].constraints.includes('isVerticallyText');

      if (modelValue[i].text && isVerticallyText) {
        d.innerRadius = 0;
        d.outerRadius = radius;
        d.angle = (d.startAngle + d.endAngle) / 2;
        const rotate = (d.angle * 180 / Math.PI - 90);
        return `rotate(${ rotate })translate(0, -14)`;
      } else {
        const angle = i * angleBetweenSections;
        const radians = (angle - 90) * (Math.PI / 180);
        const correction = (360 / sectionsCount / 2);

        const x = radius * Math.cos(radians);
        const y = radius * Math.sin(radians);

        return `translate(${ x },${ y }) rotate(${ angle + correction }, 0, 0)`;
      }
    })
    .append('xhtml:div')
    .style('width', '100%')
    .style('height', '100%')
    .style('padding-left', (d, i) => {
      const isVerticallyText = modelValue[i].constraints.includes('isVerticallyText');

      return modelValue[i].text && isVerticallyText ? '25px' : '15px';
    })
    .style('padding-right', '15px')
    .style('margin', '0')
    .style('color', 'white')
    .style('text-align', (d, i) => {
      const tileText = modelValue[i].text;
      const alignClass = tileText.match(/ql-align-(\w+)/);

      return !tileText ? 'center' : alignClass ? alignClass[1] : 'left';
    })
    .style('font-family', (d, i) => {
      const tileText = modelValue[i].text;
      const fontMatch = tileText.match(/class="ql-font-(\w+)"/);

      return fontMatch ? getFontFamilyFromClass(fontMatch[1]) : 'Arial';
    })
    .html((d, i) => {
      let content = modelValue[i].text.length ? modelValue[i].text : i + 1;

      if (typeof content === 'string' && content.includes('<p')) {
        content = content.replace(/<p/g, '<p style="margin: 0;"');
      }

      if (typeof content === 'string' && content.includes('<h')) {
        content = content.replace(/<h1/g, '<h1 style="margin: 0;"');
        content = content.replace(/<h2/g, '<h2 style="margin: 0;"');
        content = content.replace(/<h3/g, '<h3 style="margin: 0;"');
        content = content.replace(/<h4/g, '<h4 style="margin: 0;"');
        content = content.replace(/<h5/g, '<h5 style="margin: 0;"');
        content = content.replace(/<h6/g, '<h6 style="margin: 0;"');
      }

      return content;
    })
    .attr('text-anchor', (d, i) => {
      const tileText = modelValue[i].text;
      const alignClass = tileText.match(/ql-align-(\w+)/);

      return alignClass ? getSvgTextAnchor(alignClass[1]) : 'start';
    })
    .style('font-size', () => isMobile ? '14px' : '20px');
};

function getHeightFromHeader(text) {
  const regex = /<h(\d)\b/g;
  const match = regex.exec(text);

  if (match) {
    const headerSize = parseInt(match[1]);

    let height = 10;
    switch (headerSize) {
      case 1:
        height = 40;
        break;
      case 2:
        height = 32;
        break;
      case 3:
        height = 28;
        break;
      case 4:
        height = 24;
        break;
      case 5:
        height = 20;
        break;
      case 6:
        height = 18;
        break;
    }
    return height * 2 + 11 + 'px';
  } else {
    return isMobile ? '16px' : '22px';
  }
}

function getSvgTextAnchor(alignClass) {
  switch (alignClass) {
    case 'ql-align-center':
      return 'middle';
    case 'ql-align-right':
      return 'end';
    case 'ql-align-justify':
      return 'start';
    default:
      return 'start';
  }
}

function getFontFamilyFromClass(fontMatch) {
  const fontName = fontMatch[1];
  switch (fontName) {
    case 'arial':
      return 'Arial, sans-serif';
    case 'courier':
      return 'Courier New, Courier, monospace';
    case 'garamond':
      return 'Garamond, serif';
    case 'tahoma':
      return 'Tahoma, sans-serif';
    case 'times-new-roman':
      return 'Times New Roman, Times, serif';
    case 'verdana':
      return 'Verdana, sans-serif';
    default:
      return 'inherit';
  }
}

async function updateSectionImages() {
  const updatedIconUris = [];
  for (let i = 0; i < props.modelValue.length; i++) {
    const iconId = props.modelValue[i].icon;

    if (iconId) {
      const uri = await getIconUri(iconId);

      if (uri) {
        updatedIconUris.push(uri);
      } else {
        updatedIconUris.push(null);
      }
    } else {
      updatedIconUris.push(null);
    }
  }
  iconUris.value = updatedIconUris;
}

const getIconUri = async (id) => {
  const fileApiWsClient = new FilesApiWs(ApiClientStomp.instance);

  const fileRequest = {
    ids: [id],
    limit: 1,
    skip: 0
  };

  return new Promise((resolve) => {
    fileApiWsClient.getFiles(fileRequest, (res) => {
      resolve(res.data[0].uri);
    });
  });
};

function getSectionFill(index) {
  const defs = svg.value.append('defs');
  const iconUri = iconUris.value[index];

  if (iconUri) {
    const patternId = `section-pattern-${ index }`;
    let pattern = defs.select(`#${ patternId }`);
    if (pattern.empty()) {
      pattern = defs.append('pattern')
        .attr('id', patternId)
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('patternContentUnits', 'objectBoundingBox');
      pattern.append('image')
        .attr('class', 'section-image')
        .attr('href', iconUri)
        .attr('width', 1.2)
        .attr('height', 1.2)
        .attr('preserveAspectRatio', 'none')
        .on('error', (err) => {
          console.error(`Error loading image for pattern ${ patternId }`, err);
        });
    } else {
      pattern.select('image')
        .attr('href', iconUri)
        .on('error', (err) => {
          console.error(`Error loading image for pattern ${ patternId }`, err);
        });
    }

    return `url(#${ patternId })`;
  } else {
    if (props.modelValue[index].background) {
      return props.modelValue[index].background;
    } else {
      return colorScale.value[index % colorScale.value.length];
    }
  }
}

// Button
const wheelCenterButton = () => {
  const wheelSettings = props.wheelSettings;
  const stopsData = [
    { offset: '3.08%', color: '#F9DF7B' },
    { offset: '21.59%', color: '#B57E10' },
    { offset: '27.14%', color: '#B78113' },
    { offset: '32.69%', color: '#BE8C1F' },
    { offset: '38.24%', color: '#CB9D32' },
    { offset: '43.79%', color: '#DCB64E' },
    { offset: '48.42%', color: '#F2D570' },
    { offset: '50.27%', color: '#F9DF7B' },
    { offset: '51.19%', color: '#FFF3A6' },
    { offset: '57.67%', color: '#F9DF7B' },
    { offset: '80.8%', color: '#B57E10' },
    { offset: '90.98%', color: '#E5C25B' },
    { offset: '95.61%', color: '#F9DF7B' }
  ];

  const defaultSpinButtonBackground = '#5E084B';

  const buttonRadius = isMobile ? 38 : 25;

  const buttonText = wheelSettings && wheelSettings.buttonText
    ? wheelSettings.buttonText
    : '';

  const spinButtonBackground = wheelSettings && wheelSettings.spinButtonBackground
    ? wheelSettings.spinButtonBackground
    : defaultSpinButtonBackground;

  const spinButtonBorderColor = wheelSettings && wheelSettings.spinButtonBorderColor
    ? wheelSettings.spinButtonBorderColor
    : 'url(#stroke-gradient)';

  const gradient = container.value.append('defs')
    .append('linearGradient')
    .attr('id', 'stroke-gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%');

  gradient.selectAll('stop')
    .data(stopsData)
    .enter()
    .append('stop')
    .attr('offset', d => d.offset)
    .attr('stop-color', d => d.color);

  container.value.append('rect')
    .attr('class', 'spin-button')
    .attr('x', -buttonRadius)
    .attr('y', -buttonRadius)
    .attr('width', buttonRadius * 2)
    .attr('height', buttonRadius * 2)
    .attr('rx', buttonRadius)
    .attr('ry', buttonRadius)
    .attr('fill', () => spinButtonBackground)
    .attr('stroke', spinButtonBorderColor)
    .attr('stroke-width', isMobile ? 6 : 4)
    .style('cursor', 'default');

  const imageForeignObject = container.value.append('foreignObject')
    .attr('class', 'spin-button-image')
    .attr('x', -buttonRadius)
    .attr('y', -buttonRadius)
    .attr('width', buttonRadius * 2)
    .attr('height', buttonRadius * 2);

  if (typeof wheelSettings.spinButtonBackgroundImage === 'string' && wheelSettings.spinButtonBackgroundImage !== '') {
    imageForeignObject.append('xhtml:div')
      .attr('class', 'background-image-container')
      .style('display', 'flex')
      .style('justify-content', 'center')
      .style('align-items', 'center')
      .style('width', buttonRadius * 2 + 'px')
      .style('height', buttonRadius * 2 + 'px')
      .html(`<img src="${ wheelSettings.spinButtonBackgroundImage }" width="${ buttonRadius * 2 - 3 }" height="${ buttonRadius * 2 - 3 }" style="border-radius: 50%;"/>`);
  }

  container.value.append('foreignObject')
    .attr('class', 'spin-button-text')
    .attr('x', -buttonRadius)
    .attr('y', -buttonRadius)
    .attr('width', buttonRadius * 2)
    .attr('height', buttonRadius * 2)
    .html((d, i) => {
      let content;
      let iconHTML = '';

      if (typeof wheelSettings.icon === 'string' && wheelSettings.icon !== '') {
        iconHTML = `<img src="${ wheelSettings.icon }" width="${ buttonRadius }" height="${ buttonRadius }"/>`;
      }

      if (typeof buttonText === 'string' && buttonText.trim() !== '') {
        if (iconHTML !== '') {
          content = `<div>${ iconHTML }</div><div>${ buttonText }</div>`;
        } else {
          content = buttonText;
        }
      } else {
        content = iconHTML;
      }

      if (typeof content === 'string' && content.includes('<p')) {
        content = content.replace(/<p/g, '<p style="margin: 0;"');
      }

      // Add style="margin-bottom: 0;" to tags <h1>, <h2>, <h3>, <h4>, <h5>, <h6>
      if (typeof content === 'string' && content.includes('<h')) {
        content = content.replace(/<h1/g, '<h1 style="margin: 0;"');
        content = content.replace(/<h2/g, '<h2 style="margin: 0;"');
        content = content.replace(/<h3/g, '<h3 style="margin: 0;"');
        content = content.replace(/<h4/g, '<h4 style="margin: 0;"');
        content = content.replace(/<h5/g, '<h5 style="margin: 0;"');
        content = content.replace(/<h6/g, '<h6 style="margin: 0;"');
      }

      return `<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: ${ buttonRadius * 2 }px; height: ${ buttonRadius * 2 }px;">${ content }</div>`;
    })
    .style('cursor', 'default');
};

const createImageButton = (imageUrl) => {
  const buttonSize = 80;
  if (!imageUrl) {
    container.value
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', rayon.value / 12)
      .attr('fill', '#EE3EC8') // center circle color
      .attr('filter', 'url(#shadow)')
      .attr('stroke-width', 7)
      .attr('stroke', '#8D0C71');
  } else {
    container.value.append('image')
      .attr('class', 'wheel-image-button')
      .attr('xlink:href', imageUrl)
      .attr('x', -buttonSize / 2)
      .attr('y', -buttonSize / 2)
      .attr('width', buttonSize)
      .attr('height', buttonSize)
      .style('cursor', () => 'default');
  }
};

watch(isDarkMode, (value) => {
  if (container.value) {
    const outerBorder = container.value.selectAll('.outer-border');
    outerBorder.attr('stroke', value ? '#2F0426' : '#BEE9F3');
  }
});

// Function to insert the border image
const insertBorderImage = async (svg, imageUrl, isPreviewSpin) => {
  const radius = rayon.value; // Use the radius from your existing setup
  const correction = isPreviewSpin ? 100 : 60;
  const imageSize = radius * 2 + 90;
  const borderImageGroup = svg.insert('g').attr('class', 'wheel-border-image');
  const image = await loadImage(imageUrl);

  borderImageGroup
    .append('image')
    .attr('transform', `translate(${ radius + 4 },${ radius + 4 })`)
    .attr('xlink:href', image.src)
    .attr('x', -(imageSize - 41))
    .attr('y', -(imageSize - 41))
    .attr('width', imageSize)
    .attr('height', imageSize);

  // Make sure the border image is behind other elements
  svg.node().insertBefore(borderImageGroup.node(), svg.node().firstChild);
};

// Function to insert the wheel image
const insertWheelImage = async (wheelGroup, imageUrl) => {
  const radius = rayon.value; // Use the radius from your existing setup
  const sectionsCount = props.modelValue.length; // Number of sections
  const angleOffset = 360 / (2 * sectionsCount);
  const imageSize = radius * 2;
  const image = await loadImage(imageUrl);

  wheelGroup
    .insert('image', ':first-child') // Insert before other elements
    .attr('class', 'wheel-image')
    .attr('xlink:href', image.src)
    .attr('transform', `rotate(${ angleOffset })`)
    .attr('x', -(imageSize / 2))
    .attr('y', -(imageSize / 2))
    .attr('width', imageSize)
    .attr('height', imageSize);
};

//Arrow
const createArrow = async () => {
  if (container.value) {
    const arrowGroup = container.value.append('g');
    await createArrowPointerWithImage(arrowGroup, defaultArrowUri);
  }
};

// Function to load an image
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      resolve(this);
    };
    img.onerror = function () {
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

const defaultWheelBackground = '#5E084B';

const outerCircleBordersGradientData = [
  { offset: '16%', color: '#F9DF7B' },
  { offset: '30.36%', color: '#B57E10' },
  { offset: '34.67%', color: '#B78113' },
  { offset: '38.98%', color: '#BE8C1F' },
  { offset: '43.29%', color: '#CB9D32' },
  { offset: '47.6%', color: '#DCB64E' },
  { offset: '51.19%', color: '#F2D570' },
  { offset: '52.63%', color: '#F9DF7B' },
  { offset: '53.35%', color: '#FFF3A6' },
  { offset: '58.38%', color: '#F9DF7B' },
  { offset: '76.34%', color: '#B57E10' },
  { offset: '84.24%', color: '#E5C25B' },
  { offset: '87.83%', color: '#F9DF7B' }
];

// Border
const createCircleBorder = (
  // borderContainer, isPreviewSpin, wheelSettings
) => {
  const radius = rayon.value;
  const borderContainer = svg.value.append('g')
    .attr('class', 'border-container')
    .attr('transform', `translate(${ radius + 4 },${ radius + 4 })`);

  const wheelSettings = props.wheelSettings;
  const wheelBackground = wheelSettings && wheelSettings.wheelBackground
    ? wheelSettings.wheelBackground
    : defaultWheelBackground;

  const gradient = d3.select('body')
    .append('svg')
    .attr('width', 0)
    .attr('height', 0);

  gradient.append('linearGradient')
    .attr('id', 'circle-borders-gradient')
    .attr('x1', '0%')
    .attr('x2', '100%')
    .selectAll('stop')
    .data(outerCircleBordersGradientData)
    .enter().append('stop')
    .attr('offset', d => d.offset)
    .attr('stop-color', d => d.color);

  const wheelBordersColor = wheelSettings && wheelSettings.wheelBordersColor
    ? wheelSettings.wheelBordersColor
    : 'url(#circle-borders-gradient)';

  borderContainer
    .append('circle')
    .attr('class', 'outer-circle-border')
    .attr('cx', -radius - 3)
    .attr('cy', -radius - 3)
    .attr('r', radius + 23)
    .attr('fill', 'none')
    .attr('stroke-width', isMobile ? 40 : 35)
    .attr('stroke', wheelBordersColor);

  borderContainer
    .append('circle')
    .attr('class', 'outer-circle')
    .attr('cx', -radius - 3)
    .attr('cy', -radius - 3)
    .attr('r', radius + 23)
    .attr('fill', 'none')
    .attr('stroke-width', isMobile ? 34 : 28)
    .attr('stroke', wheelBackground);

  svg.value.node().insertBefore(borderContainer.node(), svg.value.node().firstChild);
};

// Function to create arrow pointer with an image
const createArrowPointerWithImage = async (arrowGroup, arrowImgUri) => {
  const radius = rayon.value; // Use the radius from your existing setup

  const isPreviewSpin = true;
  const arrowImage = await loadImage(arrowImgUri);

  const imageSize = {
    width: isPreviewSpin ? arrowImage.width / 2 : arrowImage.width / 3,
    height: isPreviewSpin ? arrowImage.height / 2 : arrowImage.height / 3
  };

  const correction = imageSize.height / 4;

  const translateX = isPreviewSpin
    ? -imageSize.width / 2
    : -imageSize.width / 2;
  const translateY = isPreviewSpin
    ? -radius - imageSize.height / 2 - correction
    : -radius - imageSize.height / 2 - correction;

  let arrowImageElement = arrowGroup.select('.arrow-image');

  if (arrowImageElement.size() > 0) {
    arrowImageElement.attr('href', arrowImgUri);
  } else {
    arrowImageElement = arrowGroup
      .append('image')
      .attr('class', 'arrow-image')
      .attr('href', arrowImgUri);
  }

  arrowImageElement
    .attr('width', imageSize.width)
    .attr('height', imageSize.height)
    .attr('transform', `translate(${ translateX },${ translateY })`)
    .raise();
};

const createWheel = async () => {
  // Create Svg
  createSvg();

  // Create Group container
  createVis();

  // Insert the border image
  if (props.wheelSettings.wheelBorderImage || defaultWheelBorderUri) {
    const imgUri = props.wheelSettings.wheelBorderImage ? props.wheelSettings.wheelBorderImage : defaultWheelBorderUri;
    await insertBorderImage(svg.value, imgUri, false);
  } else {
    createCircleBorder();
  }

  //Whole wheel image
  if (props.wheelSettings.wheelImage || defaultWheelImgUri) {
    createArc();
    const imgUri = props.wheelSettings.wheelImage ? props.wheelSettings.wheelImage : defaultWheelImgUri;
    await insertWheelImage(vis.value, imgUri);
  } else {
    createWheelSections(vis.value, rayon.value, props.modelValue.length, getSectionFill);
  }

  // Add the text
  // addTextElements(props.modelValue);

  // Button
  if (props.wheelSettings.wheelButtonImage || defaultButtonUri) {
    const imgUri = props.wheelSettings.wheelButtonImage ? props.wheelSettings.wheelButtonImage : defaultButtonUri;
    createImageButton(imgUri);
  } else {
    wheelCenterButton();
  }

  // create arrow
  await createArrow();
};

watch(isDarkMode, (value) => {
  if (value) {
  }
});

let isStopped = false;

const spin = async () => {
  if (!clicked.value && !isStopped) {
    clicked.value = true;
    const dataLength = props.modelValue.length;
    const sliceWidth = 360 / dataLength;
    const currentAngle = 360 - sliceWidth * (props.gift - 0.5);
    const numberOfRotation = 360 * 5;
    const targetRotation = currentAngle + numberOfRotation;

    rotation.value = 0;

    interpolate = d3.interpolate(rotation.value, targetRotation);

    const animateVis = () => {
      return vis.value
        .transition()
        .duration(props.animDuration)
        .ease(d3.easeBackOut.overshoot(0.3))
        .tween('rotation', () => (t) => {
          rotation.value = interpolate(t);
          vis.value.attr('transform', `rotate(${ rotation.value })`);
        })
        .end()
        .then(() => {
          isStopped = true; // mark wheel stopped

          const sections = vis.value.selectAll('.wheel-section');

          sections
            .attr('fill', (d, i) => {
              if (defaultWheelImgUri) {
                return !isGiftSection(i + 1) ? 'rgba(0, 0, 0, 0.7)' : 'none';
              } else {
                return !isGiftSection(d.id) ? 'rgba(0, 0, 0, 0.7)' : d.fill;
              }
            })
            .attr('stroke-width', (d, i) => isGiftSection(i + 1) ? '5' : '1')
            .attr('stroke', (d, i) => isGiftSection(i + 1) ? '#EE3EC8' : '#8D0C71');

          const texts = vis.value.selectAll('.section-text');
          texts
            .attr('filter', (d, i) => {
                return isGiftSection(i + 1) ? 'none' : 'blur(3px)';
              }
            );

          // remove outer circle
          const outerBorder = container.value.selectAll('.outer-border');
          outerBorder.remove();

        });
    };

    await animateVis();
    clicked.value = false;
    await done(props.modelValue[props.gift - 1]);
  }
};

function resetWheel() {
  const sections = vis.value.selectAll('.wheel-section');
  const wheelImage = vis.value.selectAll('.wheel-image');

  if (!wheelImage.empty()) {
    sections
      .attr('fill', 'none')
      .attr('stroke-width', 0)
      .attr('stroke', 'none');
  } else {
    sections
      .attr('fill', (d, i) => d.fill)
      .attr('stroke-width', 1)
      .attr('stroke', (d, i) => d.stroke);
  }

  vis.value.selectAll('.section-text')
    .attr('filter', 'none');

  clicked.value = false;
  isStopped = false;
}


defineExpose({
  spin,
});

onMounted(async () => {
  window.addEventListener('resize', checkIsMobile);
  checkIsMobile();
  await updateSectionImages();
  rayon.value = Math.min(wheelSize.value.width, wheelSize.value.height) / 2;
  await createWheel();
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

  .arrow {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%);
  }

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
