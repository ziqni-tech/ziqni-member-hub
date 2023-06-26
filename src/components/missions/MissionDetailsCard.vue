<template>
  <div v-if="isLoaded" class="mission-details-card">
    <div class="card-header">
      <button class="card-header_btn" @click="goBack">
        <img src="@/assets/icons/back_arrow.png" alt="">
      </button>
      <button v-if="isReadMore" class="card-header_btn" @click="goToInfo">i</button>
      <div v-if="!isInfo && !isReadMore && !isMobile" class="prize">
        <img v-if="mission.rewardIcon" :src="mission.rewardIcon" alt="">
        <div class="prize-value">{{ mission.rewardValue }}</div>
      </div>
    </div>
    <div class="mobile-mission-icon" v-if="isMobile">
      <img src="https://first-space.cdn.ziqni.com/Icons/ball-2.png" alt="">
    </div>
    <div class="mission-details-data">
      <div class="mission-details-card__img" v-if="!isMobile">
        <img :src="banner" alt="">
      </div>
      <div v-if="mission" class="mission-data">
        <h2 class="mission-data__title">{{ mission.name }}</h2>
        <div v-if="isReadMore" class="mission-data__description" :class="{'read-more': isReadMore}">
          <span class="description_title">Description </span>
          <span class="description_text">{{ mission.description }}</span>
        </div>
        <div class="prize_data" v-if="isReadMore">
          prize: <img src="@/assets/icons/tournament/prize.png" alt=""> {{ mission.rewardValue }}
        </div>
        <div class="mission-data__description" v-if="isInfo">
          <span class="description_title">Terms & Conditions</span>
          <span class="description_text">{{ mission.termsAndConditions }}</span>
        </div>
        <CButton v-if="!isReadMore && !isInfo && !isMobile" class="m-btn register-btn" @click="readMore">
          <span class="b-btn__text">read more</span>
        </CButton>
      </div>
    </div>
    <div
        v-if="!isInfo && !isReadMore && isMobile"
        class="bottom-section"
        :class="{'space-between': !isInfo && !isReadMore && isMobile}"
    >
      <div class="prize">
        <img v-if="mission.rewardIcon" :src="mission.rewardIcon" alt="">
        <div class="prize-value">{{ mission.rewardValue }}</div>
      </div>
      <CButton v-if="!isReadMore && !isInfo" class="m-btn register-btn" @click="readMore">
        <span class="b-btn__text">read more</span>
      </CButton>
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
      :layouts="layouts"
  >
    <template #edge-label="{ edge, ...slotProps }">
      <v-edge-label :text="edge.label" align="center" vertical-align="above" v-bind="slotProps"/>
    </template>
  </v-network-graph>
</template>

<script setup>
import { ref, onBeforeMount, watch, reactive } from 'vue';
import { CButton } from '@coreui/vue';
import banner from '@/assets/images/missions/mission-details.png';
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
import { useRoute, useRouter } from "vue-router";
import useMobileDevice from "@/hooks/useMobileDevice";

const { isMobile } = useMobileDevice();

const emit = defineEmits(['joinMission', 'leaveMission']);

const store = useStore();

const isReadMore = ref(false)
const isInfo = ref(false)
const route = useRoute();
const nodeSize = 40;
const isGraphLoaded = ref(false);

const layouts = reactive({
  nodes: {},
});

const configs = defineConfigs({
  view: {
    zoomEnabled: false,
    // panEnabled: false
  },
  node: {
    normal: {radius: nodeSize / 2, color: '#8749DC'},
    label: {direction: 'south', color: '#FDFDFF'},
  },
  edge: {
    normal: {
      color: edge => edge.color,
      width: 2,
      dasharray: 8,
    },
    label: {
      color: '#7781A8'
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

const getMissionRequest = async () => {
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
        moreThan: 20,
        lessThan: 30
      },
      constraints: []
    },
  }, null);

  achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
    missions.value = res.data;
    getEntityRewards();
  });
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
}

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
}

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
          color = 'rgb(238, 187, 0)';
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
    nodesResult[node.name] = {name: node.name};
  }
  const selectedNode = nodes.find(n => n.entityId === route.params.id).name;
  // selectedNodes.value.push(selectedNode);

  return {edgesResult, nodesResult};
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
    g.setNode(nodeId, {label: node.name, width: nodeSize, height: nodeSize});
  });

  Object.values(result.value.edgesResult).forEach(edge => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const box = {};

  g.nodes().forEach((nodeId) => {
    const x = g.node(nodeId).x;
    const y = g.node(nodeId).y;
    layouts.nodes[nodeId] = {x, y};

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

// const getOptInStatus = async () => {
//   const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);
//
//   const optInStateRequest = OptInStatesRequest.constructFromObject({
//     optinStatesFilter: {
//       entityTypes: ['Achievement'],
//       ids: [route.params.id],
//       statusCodes: {
//         gt: 0,
//         lt: 40
//       },
//       skip: 0,
//       limit: 10
//     }
//   }, null);
//
//   await optInApiWsClient.optInStates(optInStateRequest, (res) => {
//     console.warn('optIn', res)
// if (res.data.length) {
//   console.warn('optIn', res)
//   const status = res.data[0].status;
//   const percentage = res.data[0]?.percentageComplete;
//
//   mission.value.entrantStatus = status ? status : '';
//   mission.value.percentageComplete = percentage ? percentage : 0;
// } else {
//   mission.value.percentageComplete = 0;
//   mission.value.entrantStatus = '';
// }
//     store.dispatch('setCurrentMissionAction', mission.value);
//   });
// };

const readMore = () => {
  isReadMore.value = true
  // isInfo.value = false
  console.warn('Read More')
}

const router = useRouter()

const goBack = () => {
  if (isInfo.value === true) {
    isInfo.value = false
    isReadMore.value = true
  } else if (isReadMore.value === true) {
    isReadMore.value = false
  } else {
    router.back()
  }
}

const goToInfo = () => {
  isReadMore.value = false
  isInfo.value = true
}

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
}

.mission-details-card {
  display: flex;
  flex-direction: column;
  max-width: 840px;
  background: $light-grey;
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
      background: $dark-grey;
      padding: 15px 40px;

      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $text-color-white;
      vertical-align: middle;

      .prize-value {
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
      border-radius: $border-radius-sm;
      background: none;
      border: 1px solid $dark-blue;
      color: $text-color-white;
    }
  }

  .mission-details-data {
    width: 100%;
    display: flex;

    &__img {
      width: 25%;
      display: flex;
      align-items: center;
      justify-content: center;

      & > img {
        //width: 150px;
        //height: 150px;
      }
    }

    .mission-data {
      width: 70%;
      display: flex;
      flex-direction: column;
      padding: 20px 0 0 30px;

      &__title {
        font-weight: 700;
        font-size: 24px;
        line-height: 36px;
        color: $text-color-white;
        text-align: start;
      }

      .read-more {
        border-bottom: 1px solid $dark-blue;
      }

      .prize_data {
        width: 100%;

        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        color: $text-color-white;
        text-align: left;
        margin-top: 21px;

        & > img {
          padding: 0 5px 0 15px;
        }
      }

      &__description {
        color: $text-color-white;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .description_title {
          font-weight: 500;
          font-size: 14px;
          line-height: 17px;
          margin: 15px 0;
        }

        .description_text {
          height: 100%;
          font-weight: 400;
          font-size: 12px;
          line-height: 146.5%;
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
}

@media screen and (max-width: $tableWidth) {
  .mission-details-card {

    .mobile-mission-icon {

      > img {
        width: 100px;
        height: 100px;
        object-fit: contain;
      }
    }
    .prize {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $border-radius;
      background: $dark-grey;
      padding: 5px 10px;
      min-height: 25px;

      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $text-color-white;


      .prize-value {
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

      &__img {
        width: 25%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mission-data {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px 0;

        &__title {
          font-weight: 700;
          font-size: 24px;
          line-height: 36px;
          color: $text-color-white;
          text-align: start;
        }

        .prize_data {
          width: 100%;

          font-weight: 500;
          font-size: 14px;
          line-height: 17px;
          color: $text-color-white;
          text-align: left;
          margin-top: 21px;

          & > img {
            padding: 0 5px 0 15px;
          }
        }

        &__description {
          width: 100%;
          color: $text-color-white;
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .description_title {
            font-weight: 500;
            font-size: 14px;
            line-height: 17px;
            margin: 15px 0;
          }

          .description_text {
            height: 100%;
            font-weight: 400;
            font-size: 12px;
            line-height: 146.5%;
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