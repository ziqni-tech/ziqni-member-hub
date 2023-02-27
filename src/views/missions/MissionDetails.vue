<template>
  <div class="header">
    <h1 class="title">{{ mission.name}}</h1>
    <img class="share-icon" :src="shareIcon" alt="" />
  </div>
  <MissionDetailsCard :mission="mission" />
  <v-network-graph
      v-if="nodes && edges"
      v-model:selected-nodes="selectedNodes"
      :nodes="nodes"
      :edges="edges"
      :configs="configs"
      class="graph"
  />
</template>

<script setup>
import { onBeforeMount, watchEffect, ref } from 'vue';

import shareIcon from '../../assets/icons/share-icon.svg';
import MissionDetailsCard from '../../components/missions/MissionDetailsCard';

import {
  AchievementRequest,
  AchievementsApiWs,
  ApiClientStomp,
  EntityGraphRequest,
  GraphsApiWs
} from '@ziqni-tech/member-api-client';
import { defineConfigs } from 'v-network-graph';
import { useRoute } from 'vue-router';

const configs = defineConfigs({
  view: {
    // zoomEnabled: false
  },
  edge: {

  },
  node: {
    selectable: false,
  },
});

const result = ref(null);
const nodes = ref(null);
const edges = ref(null);
const route = useRoute()
console.warn('ROUTE', route.params.id);
const mission = ref(null)

const selectedNodes = ref([])

const getMissionRequest = async () => {
  const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

  const achievementsRequest = AchievementRequest.constructFromObject({
    achievementFilter: {
      productIds: [],
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

    console.warn('MISSIONS', res);
    mission.value = res.data[0];
  });
}

onBeforeMount(() => {
  getMissionRequest()
  getMission()
});

const getAchievementOrder = (nodes, edges) => {
  const edgesResult = {};
  const nodesResult = {};

  for (const edge of edges) {
    if (edge.headEntityId !== null) {
      edgesResult['edge' + edge.ordering] = {
        source: nodes.find(n => n.entityId === edge.headEntityId).name,
        target: nodes.find(n => n.entityId === edge.tailEntityId).name
      };
      nodesResult[nodes.find(n => n.entityId === edge.headEntityId).name] = { name: nodes.find(n => n.entityId === edge.headEntityId).name }
      const selectedNode =  nodes.find(n => n.entityId === route.params.id).name;
      selectedNodes.value.push(selectedNode)
    }
  }

  return { edgesResult, nodesResult }
}

const getMission = async () => {
  const graphsApiWsClient = new GraphsApiWs(ApiClientStomp.instance);
  const entityGraphRequest = EntityGraphRequest.constructFromObject({
    ids: [route.params.id],
    constraints: [],
    languageKey: '',
    includes: [],
    entityType: 'Achievement'
  }, null)

  await graphsApiWsClient.getGraph(entityGraphRequest, (res) => {
    console.warn('RES', res.data);
    const nodes = res.data.nodes;
    const edges = res.data.graphs[0].edges

    result.value = getAchievementOrder(nodes, edges)
    console.log('RESULT', result);
  });
}

watchEffect(() => {
  if (result.value) {
    nodes.value = result.value.nodesResult;
    edges.value = result.value.edgesResult;
  }
})

console.log('NODES', nodes.value);
console.log('EDGES', edges.value);
</script>

<style lang="scss">
.graph {
  width: 800px;
  height: 600px;
  border: 1px solid #000;
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
    color: #737478;
  }

  .share-icon {
    height: 30px;
    width: 30px;
    margin-left: 18px;
  }
}
</style>