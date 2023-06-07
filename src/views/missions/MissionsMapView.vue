<template>
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
        :event-handlers="eventHandlers"
    >
      <defs>
        <clipPath id="faceCircle" clipPathUnits="objectBoundingBox">
          <circle cx="0.5" cy="0.5" r="0.5"/>
        </clipPath>
      </defs>
      <template #override-node="{ nodeId, scale, config, ...slotProps }" >
        <!-- circle for filling background -->
        <circle
            class="face-circle"
            :r="config.radius * scale"
            fill="#ffffff"
            v-bind="slotProps"
        />
        <!--
          The base position of the <image /> is top left. The node's
          center should be (0,0), so slide it by specifying x and y.
        -->
        <image
            class="face-picture"
            :x="-config.radius * scale"
            :y="-config.radius * scale"
            :width="config.radius * scale * 2"
            :height="config.radius * scale * 2"
            :xlink:href="`${images[nodeId]}`"
            clip-path="url(#faceCircle)"
        />
        <!-- circle for drawing stroke -->
        <circle
            class="face-circle"
            :r="config.radius * scale"
            fill="none"
            stroke="#808080"
            :stroke-width="1 * scale"
            v-bind="slotProps"
        />
      </template>
    </v-network-graph>
  </div>
</template>

<script setup>

import { onBeforeMount, ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { defineConfigs } from 'v-network-graph';
import dagre from 'dagre/dist/dagre.min.js';

import {
  AchievementRequest,
  AchievementsApiWs,
  ApiClientStomp,
  EntityGraphRequest,
  GraphsApiWs,
} from '@ziqni-tech/member-api-client';

const nodeSize = 90;

const images = {
  with_icon: 'https://first-space.cdn.ziqni.com/Icons/ball-1.png',
  'with_i_2': 'https://first-space.cdn.ziqni.com/Icons/ball-2.png',
  'with_i-3': 'https://first-space.cdn.ziqni.com/Icons/ball-3.png',
}

const router = useRouter();
const goToMissionPage = (nodeId) => {
  console.warn('goToMissionPage', nodeId)
  router.push({
    name: 'MissionDetails',
    params: {
      id: nodeId
    }
  });
}

const eventHandlers = {
  "node:click": ({ node }) => {
    const nodeId = result.value.nodesResult[node].id

    router.push({
      name: 'MissionDetails',
      params: {
        id: nodeId
      }
    });
  },
}

const configs = defineConfigs({
  view: {
    zoomEnabled: false,
    // panEnabled: false
  },
  node: {
    normal: {
      radius: nodeSize / 2,
      color: '#8749DC'
    },
    label: {
      direction: 'south',
      color: '#FDFDFF'
    },
  },
  edge: {
    normal: {
      // color: edge => edge.color,
      color: '#8749DC',
      width: 3,
      dasharray: 8,
      linecap: 'round'
    },
    label: {
      fontFamily: undefined,
      fontSize: 14,
      lineHeight: 17,
      color: '#7781A8',
      padding: 10,
      background: {
        // visible: false,
        color: "#8749DC",
        padding: {
          vertical: 10,
          horizontal: 10,
        },
        borderRadius: nodeSize / 2,
      },
    },
    type: 'curve',
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
      limit: 1,
      statusCode: {
        moreThan: 20,
        lessThan: 30
      },
      constraints: ['hasNoDependancies']
    },
  }, null);

  achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
    mission.value = res.data[0];
    console.warn('MISSION', res.data[0]);
    isLoaded.value = true;
  });
};

onBeforeMount(() => {
  getMissionGraphData();
  getMissionRequest();
});

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
    nodesResult[node.name] = {name: node.name, id: node.entityId};
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
    // res.data.nodes.forEach(node => node.icon = 'https://first-space.cdn.ziqni.com/Icons/kisspng-cat-kitten-free-cat-vector-material-5ae776513daf78.0982279715251185452527.png')
    res.data.nodes.forEach(node => node.icon = 'https://first-space.cdn.ziqni.com/Icons/kisspng-cat-kitten-free-cat-vector-material-5ae776513daf78.0982279715251185452527.png')

    const nodes = res.data.nodes;
    const edges = res.data.graphs[0].edges;
    console.warn('GraphData', nodes)
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

</script>

<style scoped lang="scss">
.graph-wrapper {
  height: 600px;

  .graph {
    width: 100%;
    min-height: 500px;
  }

  .face-circle,
  .face-picture {
    transition: all 0.1s linear;
  }

  // suppress image events so that mouse events are received
  // by the background circle.
  .face-picture {
    pointer-events: none;
  }
}
</style>