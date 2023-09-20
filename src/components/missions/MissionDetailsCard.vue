<template>
  <div v-if="isLoaded" class="mission-details-card" :class="{'light-mode': !isDarkMode}">
    <div class="card-header">
      <div class="card-header_btn" @click="goBack">
        <CrossIcon v-if="!isInfo" :width="'30'" :height="'30'" :stroke-color="getIconStrokeColor()" />
        <ArrowLeft v-if="isInfo" :width="'20'" :height="'20'" :stroke-color="getIconStrokeColor()" />
      </div>
      <button v-if="!isInfo" class="info-btn" @click="goToInfo">
        i
      </button>
    </div>
    <div class="mobile-mission-icon" v-if="isMobile">
      <img :src="missionIcon" alt="">
    </div>
    <div class="mission-details-data">
      <div class="mission-icon" v-if="!isMobile">
        <img :src="missionIcon" alt="">
      </div>
      <div v-if="mission" class="mission-data">
        <h2 class="mission-data__title">{{ mission.name }}</h2>
        <div v-if="!isInfo" class="mission-data__description read-more">
          <span class="description_title">Description </span>
          <span class="description_text">{{ removeHTMLTags(description) }}</span>
        </div>
        <div class="prize_data" v-if="!isInfo">
          prize:
          <div class="trophy-icon" v-html="filledTrophyIcon"></div>
          <div class="prize-value">{{ mission.rewardValue }}</div>
        </div>
        <div class="mission-data__description" v-if="isInfo">
          <span class="description_title">Terms & Conditions</span>
          <span class="description_text">{{ removeHTMLTags(termsAndConditions) }}</span>
        </div>
      </div>
    </div>
  </div>
  <v-network-graph
      ref="graph"
      v-if="isInfo && result"
      v-model:selected-nodes="selectedNodes"
      :nodes="result.nodesResult"
      :edges="result.edgesResult"
      :configs="configs"
      class="graph"
      :class="{'light-mode': !isDarkMode}"
      :layouts="layouts"
      :key="rerenderKey"
  >
    <template #edge-label="{ edge, ...slotProps }">
      <v-edge-label
          :text="edge.label"
          align="center"
          vertical-align="above"
          v-bind="slotProps"
      />
    </template>
  </v-network-graph>
</template>

<script setup>
import { ref, onBeforeMount, watch, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import {
  AchievementRequest,
  AchievementsApiWs,
  ApiClientStomp,
  EntityGraphRequest, EntityRequest, FilesApiWs,
  GraphsApiWs, OptInApiWs, OptInStatesRequest, RewardsApiWs,
} from '@ziqni-tech/member-api-client';

import { defineConfigs } from 'v-network-graph';
import dagre from 'dagre/dist/dagre.min.js';
import { useRoute, useRouter } from 'vue-router';
import useMobileDevice from '@/hooks/useMobileDevice';
import { removeHTMLTags } from '@/utils/removeHTMLTags';
import backArrowIcon from '@/assets/icons/back_arrow.png';
import closeIcon from '@/assets/icons/close.svg';
import CrossIcon from '@/shared/components/svg-icons/CrossIcon.vue';
import ArrowLeft from '@/shared/components/svg-icons/ArrowLeft.vue';

const filledTrophyIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.7047 3.14201C3.7047 3.14201 4.0342 2.8125 4.50019 2.8125H13.5002C13.5002 2.8125 13.9662 2.8125 14.2957 3.14201C14.2957 3.14201 14.6252 3.47151 14.6252 3.9375V7.87499C14.6252 7.87499 14.6252 8.99896 14.1933 10.0366C14.1933 10.0366 13.7614 11.0743 12.9639 11.8663C12.9639 11.8663 12.1664 12.6584 11.1257 13.0831C11.1257 13.0831 10.0851 13.5078 8.96079 13.5C8.96079 13.5 7.81817 13.4914 6.77642 13.0356C6.77642 13.0356 5.77399 12.597 5.00211 11.8064C5.00211 11.8064 4.23304 11.0188 3.8112 10.003C3.8112 10.003 3.37519 8.95322 3.37519 7.81172V3.9375C3.37519 3.9375 3.37519 3.47151 3.7047 3.14201Z" fill="#EE3EC8"/>
    <path d="M6.75019 16.3125H11.2502C11.5609 16.3125 11.8127 16.0607 11.8127 15.75C11.8127 15.4393 11.5609 15.1875 11.2502 15.1875H6.75019C6.43953 15.1875 6.18769 15.4393 6.18769 15.75C6.18769 16.0607 6.43953 16.3125 6.75019 16.3125Z" fill="#EE3EC8"/>
    <path d="M8.43769 12.9375V15.75C8.43769 16.0607 8.68953 16.3125 9.00019 16.3125C9.31085 16.3125 9.56269 16.0607 9.56269 15.75V12.9375C9.56269 12.6268 9.31085 12.375 9.00019 12.375C8.68953 12.375 8.43769 12.6268 8.43769 12.9375Z" fill="#EE3EC8"/>
    <path d="M16.3127 4.5H14.0627C13.752 4.5 13.5002 4.75184 13.5002 5.0625C13.5002 5.37316 13.752 5.625 14.0627 5.625H16.3127V6.75C16.3127 7.44899 15.8184 7.94324 15.8184 7.94324C15.3242 8.4375 14.6252 8.4375 14.6252 8.4375H13.9361C13.6255 8.4375 13.3736 8.68934 13.3736 9C13.3736 9.31066 13.6255 9.5625 13.9361 9.5625H14.6252C15.7902 9.5625 16.6139 8.73874 16.6139 8.73874C17.4377 7.91498 17.4377 6.75 17.4377 6.75V5.625C17.4377 5.15901 17.1082 4.82951 17.1082 4.82951C16.7787 4.5 16.3127 4.5 16.3127 4.5Z" fill="#EE3EC8"/>
    <path d="M1.68066 5.625H3.93066C4.24132 5.625 4.49316 5.37316 4.49316 5.0625C4.49316 4.75184 4.24132 4.5 3.93066 4.5H1.68066C1.21467 4.5 0.885169 4.82951 0.885169 4.82951C0.555664 5.15901 0.555664 5.625 0.555664 5.625V6.75C0.555664 7.91498 1.37943 8.73874 1.37943 8.73874C2.20319 9.5625 3.36816 9.5625 3.36816 9.5625H4.07832C4.38898 9.5625 4.64082 9.31066 4.64082 9C4.64082 8.68934 4.38898 8.4375 4.07832 8.4375H3.36816C2.66918 8.4375 2.17492 7.94324 2.17492 7.94324C1.68066 7.44899 1.68066 6.75 1.68066 6.75V5.625Z" fill="#EE3EC8"/>
  </svg>
`;

const { isMobile } = useMobileDevice();

const emit = defineEmits(['joinMission', 'leaveMission']);

const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);
const rerenderKey = ref(0);

const getIconStrokeColor = () => {
  return isDarkMode.value ? '#FFFFFF' : '#080D12';
};

const isInfo = ref(false);
const route = useRoute();
const nodeSize = 40;
const isGraphLoaded = ref(false);
const missionIcon = ref('https://first-space.cdn.ziqni.com/Icons/ball-2.png');

const goBackIcon = computed(() => {
  return !isInfo.value ? closeIcon : backArrowIcon;
});

const layouts = reactive({
  nodes: {},
});

const getEdgeLabelColor = (label) => {
  const edgeLabelColors = {
    MUST: '#6FCF97',
    SHOULD: '#F2994A',
    'MUST-NOT': '#EB5757'
  }
  return edgeLabelColors[label] || '#7781A8';
}

const configs = defineConfigs({
  view: {
    zoomEnabled: false,
    // panEnabled: false
  },
  node: {
    normal: {
      radius: nodeSize / 2,
      color: isDarkMode.value ? '#2F0426' : '#BEE9F3',
      strokeColor: isDarkMode.value ? '#406A8C' : '#F7A1E4',
      strokeWidth: 1
    },
    label: {
      direction: 'south',
      color: isDarkMode.value ? '#FDFDFF' : '#141E28',
      fontFamily: 'Syne-Medium',
      fontSize: 12,
    },
  },
  edge: {
    normal: {
      color: edge => edge.color,
      width: 2,
      dasharray: 8,
    },
    label: {
      color: '#7781A8',
      // color: edge => edge.color,
      fontFamily: 'Syne-Medium',
      fontSize: 12
    },
    margin: 4,
    marker: {
      target: {
        type: 'arrow',
        width: 4,
        height: 4,
      },
    },
  },
});

const graph = ref(null);
const result = ref(null);

let leaveModal = ref(false);

const missions = ref(null);
const mission = ref(null);
const isLoaded = ref(false);

const description = computed(() => {
  return mission.value.description
      ? mission.value.description
      : 'No Description provided';
})

const termsAndConditions = computed(() => {
  return mission.value.termsAndConditions
      ? mission.value.termsAndConditions
      : 'No Terms and conditions provided';
})

const getMissionRequest = async () => {
  try {
    const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

    const achievementsRequest = AchievementRequest.constructFromObject({
      achievementFilter: {
        productTagsFilter: [],
        ids: [route.params.id],
        status: [],
        sortBy: [
          {
            queryField: 'created',
            order: 'Desc'
          },
        ],
        skip: 0,
        limit: 1,
        statusCode: {
          moreThan: -5,
          lessThan: 130
        },
        constraints: []
      },
    }, null);

    achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
      missions.value = res.data;

      if (res.data[0].iconLink) {
        missionIcon.value = res.data[0].iconLink;
      }

      getEntityRewards();
    });
  } catch (err) {
    console.log('getMissionRequest error', err);
  }
};

const getEntityRewards = async () => {
  const rewardsApiWsClient = await new RewardsApiWs(ApiClientStomp.instance);

  const rewardRequest = EntityRequest.constructFromObject({
    entityFilter: [
      {
        entityType: 'Achievement',
        entityIds: [route.params.id]
      },
    ],
    skip: 0,
    limit: 20
  }, null);

  await rewardsApiWsClient.getRewards(rewardRequest, async (res) => {
    for (const mission of missions.value) {
      if (res.data.length) {
        let maxReward = null;
        for (const reward of res.data) {
          if (reward.entityId === mission.id) {
            if (!maxReward || reward.rewardValue > maxReward.rewardValue) {
              maxReward = reward;
            }
          }
        }
        if (maxReward) {
          mission.rewardValue = maxReward.rewardValue;
          mission.rewardType = maxReward.rewardType.key;
          if (maxReward.icon) {
            mission.rewardIcon = await getRewardIcon(maxReward.icon);
          }
        }
      }
    }
    mission.value = missions.value[0];
    isLoaded.value = true;
  });
};

onBeforeMount(() => {
  getMissionGraphData();
  getMissionRequest();
  // getOptInStatus()
});

const getRewardIcon = async (id) => {
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

const getAchievementOrder = (nodes, edges) => {
  const edgesResult = {};
  const nodesResult = {};

  for (const edge of edges) {
    if (edge.headEntityId !== null) {
      let color;
      switch (edge.graphEdgeType) {
        case 'MUST': {
          color = '#6FCF97';
          break;
        }
        case 'SHOULD': {
          color = '#F2994A';
          break;
        }
        case 'MUST-NOT': {
          color = '#EB5757';
          break;
        }
      }
      edgesResult['edge' + edge.ordering] = {
        source: nodes.find(n => n.entityId === edge.headEntityId).name,
        target: nodes.find(n => n.entityId === edge.tailEntityId).name,
        label: edge.graphEdgeType,
        color: color
      };
    }
  }

  for (const node of nodes) {
    nodesResult[node.name] = { name: node.name };
  }
  const selectedNode = nodes.find(n => n.entityId === route.params.id).name;
  // selectedNodes.value.push(selectedNode);

  return { edgesResult, nodesResult };
};

const getMissionGraphData = async () => {
  const graphsApiWsClient = new GraphsApiWs(ApiClientStomp.instance);
  const entityGraphRequest = EntityGraphRequest.constructFromObject({
    ids: [route.params.id],
    constraints: [],
    languageKey: '',
    includes: [],
    entityType: 'Achievement'
  }, null);

  await graphsApiWsClient.getGraph(entityGraphRequest, (res) => {
    const nodes = res.data.nodes;
    const edges = res.data.graphs[0].edges;

    result.value = getAchievementOrder(nodes, edges);
  });
};
const layout = (direction) => {
  if (Object.keys(result.value.nodesResult).length <= 1
      || Object.keys(result.value.edgesResult).length === 0
  ) {
    isGraphLoaded.value = true;
    return;
  }

  const g = new dagre.graphlib.Graph();

  g.setGraph({
    rankdir: direction,
    nodesep: nodeSize * 2,
    edgesep: nodeSize,
    ranksep: nodeSize * 2,
  });

  g.setDefaultEdgeLabel(() => ({}));

  Object.entries(result.value.nodesResult).forEach(([nodeId, node]) => {
    g.setNode(nodeId, { label: node.name, width: nodeSize, height: nodeSize });
  });

  Object.values(result.value.edgesResult).forEach(edge => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const box = {};

  g.nodes().forEach((nodeId) => {
    const x = g.node(nodeId).x;
    const y = g.node(nodeId).y;
    layouts.nodes[nodeId] = { x, y };

    box.top = box.top ? Math.min(box.top, y) : y;
    box.bottom = box.bottom ? Math.max(box.bottom, y) : y;
    box.left = box.left ? Math.min(box.left, x) : x;
    box.right = box.right ? Math.max(box.right, x) : x;
  });

  const graphMargin = nodeSize * 2;
  const viewBox = {
    top: (box.top ?? 0) - graphMargin,
    bottom: (box.bottom ?? 0) + graphMargin,
    left: (box.left ?? 0) - graphMargin,
    right: (box.right ?? 0) + graphMargin,
  };
  graph.value?.setViewBox(viewBox);
  isGraphLoaded.value = true;
};

watch(result, (currentValue, oldValue) => {
  if (currentValue || oldValue) {
    layout('LR');
  }
});

watch(isDarkMode, (newValue) => {
  // Update node colors and other properties here
  configs.node.normal.color = newValue ? '#2F0426' : '#BEE9F3';
  configs.node.normal.strokeColor = newValue ? '#406A8C' : '#F7A1E4';
  configs.node.normal.strokeWidth = 1;

  configs.node.label.color = newValue ? '#FDFDFF' : '#141E28';

  rerenderKey.value += 1;
});

const router = useRouter();

const goBack = () => {
  if (isInfo.value === true) {
    isInfo.value = false;
  } else {
    router.back();
  }
};

const goToInfo = () => {
  isInfo.value = true;
};

const finish = () => {
  console.log('finish');
};

const register = () => {
  emit('joinMission');
};

const leave = () => {
  emit('leaveMission');
  leaveModal.value = false;
};

const openModal = () => {
  leaveModal.value = true;
};

const closeModal = () => {
  leaveModal.value = false;
};

</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';

.graph {
  margin: 20px auto 0;
  border: 1px solid $dark-blue;
  border-radius: $border-radius;
  max-width: 840px;
  height: 400px;

  &.light-mode {
    border: 1px solid $main-border-color-LM;
  }
}

.mission-details-card {
  display: flex;
  flex-direction: column;
  max-width: 840px;
  background: $card-bg-DM;
  overflow: hidden;
  border-radius: $border-radius;
  margin: 0 auto;
  padding: 14px 24px 26px;

  .card-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .prize {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $border-radius;
      background: $prize-btn-bg-DM;
      padding: 15px 40px;

      font-family: $semi-bold;
      font-size: 14px;
      color: $white-color-DM;
      vertical-align: middle;

      .prize-value {
        font-family: $bold;
        padding-top: 3px;
      }

      > img {
        height: 10px;
        width: 12px;
        margin-right: 7px;
      }
    }

    &_btn {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $border-radius-sm;
      background: none;
      border: 1px solid $btn-border-grey;
      color: $white-color-DM;
      cursor: pointer;
    }

    .info-btn {
      width: 30px;
      height: 30px;
      border-radius: $border-radius-sm;
      background: none;
      border: 1px solid $btn-border-grey;
      color: $white-color-DM;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      > img {
        width: 100%;
        height: 31px;
        object-fit: cover;
      }
    }
  }

  .mission-details-data {
    width: 100%;
    display: flex;

    .mission-icon {
      width: 150px;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $border-radius-round;
      overflow: hidden;

      & > img {
        width: 100%;
        height: 100%;
      }
    }

    .mission-data {
      width: 70%;
      display: flex;
      flex-direction: column;
      padding: 20px 0 0 30px;

      &__title {
        font-size: 20px;
        font-family: $bold;
        color: $white-color-DM;
        text-align: start;
      }

      .read-more {
        border-bottom: 1px solid $btn-border-grey;
      }

      .prize_data {
        width: 100%;
        font-size: 14px;
        color: $white-color-DM;
        text-align: left;
        margin-top: 21px;
        display: flex;
        align-items: center;
        font-family: $medium;

        .prize-value {
          font-family: $bold;
        }

        .trophy-icon {
          padding: 0 5px 0 14px;
        }
      }

      &__description {
        color: $white-color-DM;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .description_title {
          font-size: 14px;
          margin: 15px 0;
          font-family: $medium;
        }

        .description_text {
          height: 100%;
          font-size: 12px;
          font-family: $mainFont;
          text-align: start;
          margin-bottom: 20px;
        }
      }
    }

    .register-btn {
      align-self: flex-start;
      margin-top: auto;
      margin-bottom: 10px;
      padding: 10px 55px;
    }
  }

  .bottom-section {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    margin-top: auto;
  }

  &.light-mode {
    background: $card-bg-LM;

    .card-header {

      &_btn {
        width: 30px;
        height: 30px;
        border-radius: $border-radius-sm;
        background: none;
        border: 1px solid $main-border-color-LM;
        color: $white-color-DM;
      }

      .info-btn {
        width: 30px;
        height: 30px;
        border-radius: $border-radius-sm;
        background: none;
        border: 1px solid $main-border-color-LM;
        color: $info-name-color;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        > img {
          width: 100%;
          height: 31px;
          object-fit: cover;
        }
      }
    }

    .mission-details-data {
      width: 100%;
      display: flex;

      .mission-icon {
        width: 150px;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $border-radius-round;
        overflow: hidden;

        & > img {
          width: 100%;
          height: 100%;
        }
      }

      .mission-data {
        width: 70%;
        display: flex;
        flex-direction: column;
        padding: 20px 0 0 30px;

        &__title {
          color: $section-title-color-LM;
          text-align: start;
        }

        .read-more {
          border-bottom: 1px solid $main-border-color-LM;
        }

        .prize_data {
          color: $section-title-color-LM;
        }

        &__description {

          .description_title {
            color: $section-title-color-LM;
          }

          .description_text {
            color: $card-title-color-LM;
          }
        }
      }

      .register-btn {
        align-self: flex-start;
        margin-top: auto;
        margin-bottom: 10px;
        padding: 10px 55px;
      }
    }

    .bottom-section {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: start;
      margin-top: auto;
    }
  }
}

@media screen and (max-width: $tableWidth) {
  .mission-details-card {

    .mobile-mission-icon {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
      border-radius: $border-radius-round;
      overflow: hidden;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    .prize {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $border-radius;
      background: $dark-grey;
      padding: 5px 10px;
      min-height: 34px;
      min-width: 80px;

      font-size: 12px;
      color: $white-color-DM;


      .prize-value {
        font-family: $semi-bold;
        padding-top: 3px;
      }

      > img {
        height: 10px;
        width: 12px;
        margin-right: 7px;
      }
    }

    .mission-details-data {
      width: 100%;
      display: flex;


      .mission-data {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px 0;

        &__title {
          font-size: 22px;
          color: $white-color-DM;
          text-align: center;
        }

        .prize_data {
          width: 100%;

          font-size: 12px;
          color: $white-color-DM;
          text-align: left;
          margin-top: 21px;

          & > img {
            padding: 0 5px 0 15px;
          }
        }

        &__description {
          width: 100%;
          color: $white-color-DM;
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .description_title {
            font-size: 16px;
            margin: 15px 0;
          }

          .description_text {
            height: 100%;
            font-size: 16px;
            font-family: $mainFont;
            text-align: start;
            margin-bottom: 20px;
          }
        }
      }

    }

    .bottom-section {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.space-between {
        justify-content: space-between;
      }

      .register-btn {
        padding: 5px 46px;
      }
    }
  }
}
</style>