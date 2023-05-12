<template>
  <div v-if="isLoaded" class="wrapper">
    <div class="header">
      <h1 class="title">{{ mission.name }}</h1>
<!--      <img class="share-icon" :src="shareIcon" alt=""/>-->
    </div>
    <MissionDetailsCard :mission="mission" @joinMission="joinMission" @leaveMission="leaveMission"/>
    <div class="graph-wrapper">
      <v-network-graph
          ref="graph"
          v-if="result"
          v-model:selected-nodes="selectedNodes"
          :nodes="result.nodesResult"
          :edges="result.edgesResult"
          :configs="configs"
          class="m-graph"
          :layouts="layouts"
      >
        <template #edge-label="{ edge, ...slotProps }">
          <v-edge-label :text="edge.label" align="center" vertical-align="above" v-bind="slotProps"/>
        </template>
      </v-network-graph>
    </div>
  </div>
  <Loader v-else/>
</template>

<script setup>
import { onBeforeMount, ref, reactive, watch } from 'vue';
import dagre from 'dagre/dist/dagre.min.js';

// import shareIcon from '../../assets/icons/share-icon.svg';
import MissionDetailsCard from '../../components/missions/MissionDetailsCard';

import {
  AchievementRequest,
  AchievementsApiWs,
  ApiClientStomp,
  EntityGraphRequest,
  GraphsApiWs,
  ManageOptinRequest,
  OptInApiWs,
  OptInStatesRequest
} from '@ziqni-tech/member-api-client';
import { defineConfigs } from 'v-network-graph';
import { useRoute } from 'vue-router';
import Loader from '../../components/Loader';
import { useStore } from 'vuex';

const nodeSize = 40;

const configs = defineConfigs({
  view: {
    zoomEnabled: false,
    // panEnabled: false
  },
  node: {
    normal: { radius: nodeSize / 2, color: '#3da1d2' },
    label: { direction: 'south', color: '#3da1d2' },
  },
  edge: {
    normal: {
      color: edge => edge.color,
      width: 3,
    },
    label: {
      color: '#3da1d2'
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

const route = useRoute();
const mission = ref(null);
const isLoaded = ref(false);
const isGraphLoaded = ref(false);

const selectedNodes = ref([]);

const store = useStore();

const layouts = reactive({
  nodes: {},
});

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
      limit: 20,
      statusCode: {
        moreThan: 20,
        lessThan: 30
      },
      constraints: ['hasNoDependancies']
    },
  }, null);

  await achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
    mission.value = res.data[0];
    console.warn('MISSION', res.data[0]);
    isLoaded.value = true;
  });
};

const getOptInStatus = async () => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInStateRequest = OptInStatesRequest.constructFromObject({
    optinStatesFilter: {
      entityTypes: ['Achievement'],
      ids: [route.params.id],
      statusCodes: {
        gt: 0,
        lt: 40
      },
      skip: 0,
      limit: 10
    }
  }, null);

  await optInApiWsClient.optInStates(optInStateRequest, (res) => {
    if (res.data.length) {
      const status = res.data[0].status;
      const percentage = res.data[0].percentageComplete;

      mission.value.entrantStatus = status ? status : '';
      mission.value.percentageComplete = percentage ? percentage : 0;
    } else {
      mission.value.percentageComplete = 0;
      mission.value.entrantStatus = '';
    }
    store.dispatch('setCurrentMissionAction', mission.value);
  });
};

onBeforeMount(() => {
  getMissionGraphData();
  getMissionRequest();
  getOptInStatus();
});

const getAchievementOrder = (nodes, edges) => {
  const edgesResult = {};
  const nodesResult = {};

  for (const edge of edges) {
    if (edge.headEntityId !== null) {
      let color;
      switch (edge.graphEdgeType) {
        case 'MUST': {
          color = '#1ECE30';
          break;
        }
        case 'SHOULD': {
          color = 'rgb(238, 187, 0)';
          break;
        }
        case 'MUST-NOT': {
          color = '#CE624B';
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
  selectedNodes.value.push(selectedNode);

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

const joinMission = async () => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: route.params.id,
    entityType: 'Achievement',
    action: 'join'
  }, null);

  await optInApiWsClient.manageOptin(optInRequest, (res) => {
    if (res.data) {
      const message = `You successfully joined the ${mission.value.name} mission`;
      store.dispatch('setAlertMessage', message);
      getOptInStatus();
    }
  });
};

const leaveMission = async () => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: route.params.id,
    entityType: 'Achievement',
    action: 'leave'
  }, null);

  await optInApiWsClient.manageOptin(optInRequest, (res) => {
    if (res.data) {
      const message = `You successfully leaved the ${mission.value.name} mission`;
      store.dispatch('setAlertMessage', message);
      getOptInStatus();
    }
  });
};

</script>

<style lang="scss">
.graph-wrapper {
  height: 700px;

  .graph {
    width: 100%;
    min-height: 500px;
  }
}

.wrapper {
  width: 100%;
}

.header {
  display: flex;
  justify-content: flex-start;
  background: none;
  border: none;

  .title {
    font-family: 'Montserrat', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 27px;
  }

  .share-icon {
    height: 30px;
    width: 30px;
    margin-left: 18px;
  }
}
</style>