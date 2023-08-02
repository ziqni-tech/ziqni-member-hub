<template>
  <h1 class="mission-map-title">Mission map</h1>
  <div class="graph-wrapper">
    <v-network-graph
        ref="graph"
        v-if="result"
        v-model:selected-nodes="selectedNodes"
        :nodes="result.nodesResult"
        :edges="result.edgesResult"
        :configs="configs"
        class="graph"
        :layouts="layouts"
        :event-handlers="eventHandlers"
    >
      <defs>
        <clipPath id="faceCircle" clipPathUnits="objectBoundingBox">
          <circle cx="0.5" cy="0.5" r="0.5"/>
        </clipPath>
      </defs>
      <template #override-node="{ nodeId, scale, config, ...slotProps }">
        <!-- circle for filling background -->
        <circle
            class="face-circle"
            :r="config.radius * scale"
            fill="#262C41"
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
            stroke="#38ACCF"
            :stroke-width="1 * scale"
            v-bind="slotProps"
        />
        <!-- stars for mission completion -->
        <g v-if="missionCompleted && missionCompleted[nodeId]" class="mission-stars" :transform="getStarTransform()">
          <text
              v-for="index in totalStars"
              :key="index"
              class="star"
              :x="getStarX(index, config.radius * scale)"
              :y="getStarY(index, config.radius * scale)"
              font-family="Material Icons"
              text-anchor="middle"
              dominant-baseline="central"
              :font-size="starSize"
              :fill="getStarFill(index, missionCompleted[nodeId]?.percentageComplete)"
          >
            &#x2605
          </text>
        </g>
      </template>
    </v-network-graph>
  </div>
</template>

<script setup>

import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
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
  OptInApiWs,
  OptInStatesRequest,
} from '@ziqni-tech/member-api-client';
import useMobileDevice from '@/hooks/useMobileDevice';

const { isMobile } = useMobileDevice();

const nodeSize = computed(() => isMobile.value ? 50 : 90);
const starSize = computed(() => isMobile.value ? 16 : 25);
const images = ref(null);

const missionCompleted = ref(null);
const store = useStore();

onBeforeMount(async () => {
  ApiClientStomp.instance.client.debug = () => {
  };
  await ApiClientStomp.instance.connect({ token: localStorage.getItem('token') });
  await store.dispatch('setIsConnectedClient', true);
});

const totalStars = 3;

const getStarAngle = () => {
  return 180;
};

const getStarTransform = () => {
  const angle = getStarAngle();
  return `rotate(${ angle })`;
};

const getStarX = (index, radius) => {
  if (index === 2) {
    return 0;
  } else if (index === 1) {
    return radius - (radius / 2) + 3;
  } else {
    return -radius + (radius / 2) - 3;
  }
};

const getStarY = (index, radius) => {
  if (index === 2) {
    return radius + 10;
  } else {
    return radius + 5;
  }
};

const router = useRouter();

const eventHandlers = {
  'node:click': ({ node }) => {
    const nodeId = result.value.nodesResult[node].id;

    router.push({
      name: 'MissionDetails',
      params: {
        id: nodeId
      }
    });
  },
};

const configs = computed(() => {
  return defineConfigs({
    view: {
      zoomEnabled: false,
      // panEnabled: false
    },
    node: {
      normal: {
        radius: nodeSize.value / 2,
        color: '#8749DC',
        strokeColor: '#38ACCF',
        strokeWidth: 1
      },
      label: {
        direction: 'south',
        color: '#FDFDFF',
        fontFamily: 'Syne-Medium',
        fontSize: 16
      },
    },
    edge: {
      normal: {
        // color: edge => edge.color,
        color: '#B9CEDF',
        // width: 3,
        dasharray: 4,
        linecap: 'round'
      },
      summarized: {
        shape: {
          type: 'circle',
          width: 4,
          height: 4,
          borderRadius: 2
        }
      },
      label: {
        fontFamily: 'Syne-Medium',
        fontSize: 16,
        lineHeight: 17,
        color: '#7781A8',
        padding: 10,
        background: {
          // visible: false,
          color: '#8749DC',
          padding: {
            vertical: 10,
            horizontal: 10,
          },
          borderRadius: nodeSize.value / 2,
        },
      },
      type: 'curve',
    },
  });
});

const graph = ref(null);

const result = ref(null);

const route = useRoute();
const mission = ref(null);
const isLoaded = ref(false);
const isGraphLoaded = ref(false);

const selectedNodes = ref([]);

const layouts = reactive({
  nodes: {},
});

const getStarFill = (index, percentageComplete) => {
  if (percentageComplete >= 1 && percentageComplete <= 33 && index === 1) {
    return '#D7A321';
  } else if (percentageComplete >= 34 && percentageComplete <= 77 && index === 2) {
    return '#D7A321';
  } else if (percentageComplete === 100 && index === 3) {
    return '#D7A321';
  } else {
    return '#223241';
  }
};

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
          moreThan: 20,
          lessThan: 30
        },
        constraints: ['mission']
      },
    }, null);

    achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
      mission.value = res.data[0];
      isLoaded.value = true;
    });
  } catch (err) {
    console.log('getMissionRequest error => ', err);
  }
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
    nodesResult[node.name] = { name: node.name, id: node.entityId };
  }
  const selectedNode = nodes.find(n => n.entityId === route.params.id).name;
  // selectedNodes.value.push(selectedNode);

  return { edgesResult, nodesResult };
};

const getMissionGraphData = async () => {
  try {
    const graphsApiWsClient = new GraphsApiWs(ApiClientStomp.instance);
    const entityGraphRequest = EntityGraphRequest.constructFromObject({
      ids: [route.params.id],
      constraints: [],
      languageKey: '',
      includes: [],
      entityType: 'Achievement'
    }, null);

    await graphsApiWsClient.getGraph(entityGraphRequest, async (res) => {
      const nodes = res.data.nodes;

      for (const node of nodes) {
        const missionIcon = await getAchievementRequest(node.entityId);
        node.icon = missionIcon ? missionIcon : 'https://first-space.cdn.ziqni.com/Icons/ball-2.png';
      }

      const icons = {};
      for (const node of nodes) {
        const key = node.name;
        icons[key] = node.icon;
      }

      images.value = icons;

      const edges = res.data.graphs[0].edges;
      const ids = nodes.map(item => item.entityId);
      await getOptInStatus(ids, nodes);
      result.value = getAchievementOrder(nodes, edges);
    });
  } catch (err) {
    console.log('getMissionGraphData error => ', err);
  }
};

const getAchievementRequest = async (entityId) => {
  try {
    const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

    const achievementsRequest = AchievementRequest.constructFromObject({
      achievementFilter: {
        productTagsFilter: [],
        ids: [entityId],
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

    return new Promise((resolve) => {
      achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
        resolve(res.data[0].iconLink);
      });
    });
  } catch (err) {
    console.log('getAchievementRequest error => ', err);
  }
};

const getOptInStatus = async (ids, nodes) => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInStateRequest = OptInStatesRequest.constructFromObject({
    optinStatesFilter: {
      entityTypes: ['Achievement'],
      ids: ids,
      statusCodes: {
        gt: -5,
        lt: 40
      },
      skip: 0,
      limit: 10
    }
  }, null);

  await optInApiWsClient.optInStates(optInStateRequest, res => {
    const missionCompletedStatus = {};
    const statuses = res.data;

    for (const node of nodes) {
      const key = node.name;
      const matchingStatus = statuses.find(status => status.entityId === node.entityId);
      const percentageComplete = matchingStatus ? matchingStatus.percentageComplete : null;

      missionCompletedStatus[key] = {
        percentageComplete: percentageComplete,
      };
    }
    missionCompleted.value = missionCompletedStatus;
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
    nodesep: nodeSize.value * 2,
    edgesep: nodeSize.value,
    ranksep: nodeSize.value * 2,
  });

  g.setDefaultEdgeLabel(() => ({}));

  Object.entries(result.value.nodesResult).forEach(([nodeId, node]) => {
    g.setNode(nodeId, { label: node.name, width: nodeSize.value, height: nodeSize.value });
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

  const graphMargin = nodeSize.value * 2;
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

const getNodeStyles = (nodeId) => {
  const percentageComplete = missionCompleted && missionCompleted.value ? missionCompleted.value[nodeId] : null;

  if (percentageComplete === 100) {
    return {
      opacity: 0.5,
      background: 'radial-gradient(50% 50.00% at 50% 50.00%, #38ACCF 0%, rgba(56, 172, 207, 0.00) 100%)',
      filter: 'blur(37.5px)'
    };
  } else if (percentageComplete > 0 && percentageComplete < 100) {
    return {
      opacity: 0.5,
      background: 'radial-gradient(50% 50.00% at 50% 50.00%, #EE3EC9 0%, rgba(238, 62, 201, 0.00) 100%)',
      filter: 'blur(37.5px)'
    };
  } else {
    return {
      background: 'radial-gradient(50% 50.00% at 50% 50.00%, #223241 0%, rgba(34, 50, 65, 0.00) 100%)',
      filter: 'blur(37.5px)'
    };
  }
};

</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables";

.mission-map-title {
  font-family: $mainFont;
  font-size: 24px;
  color: $body-text-white;
  margin: 20px auto 0;
}

.graph {
  width: 100%;
  height: 800px;
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

@media screen and (max-width: $tableWidth) {

  .mission-map-title {
    font-size: 22px;
  }
}

@media screen and (max-width: 380px) {
  .graph {
    height: 500px;
  }
}

.custom-node {
  opacity: 0.5;
  background: radial-gradient(50% 50.00% at 50% 50.00%, #38ACCF 0%, rgba(56, 172, 207, 0.00) 100%);
  filter: blur(37.5px);
}

.custom-node-in-progress {
  opacity: 0.5;
  background: radial-gradient(50% 50.00% at 50% 50.00%, #EE3EC9 0%, rgba(238, 62, 201, 0.00) 100%);
  filter: blur(37.5px);
}

.custom-node-closed {
  background: radial-gradient(50% 50.00% at 50% 50.00%, #223241 0%, rgba(34, 50, 65, 0.00) 100%);
  filter: blur(37.5px);
}
</style>