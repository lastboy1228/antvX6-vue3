<template>
  <div class="app-content">
    <div id="container" style="position: relative; width: 100%; height: 100%"></div>
    <div id="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none"></div>

    <!-- 自定义component被渲染时，在逻辑关系上都位于这个Container内 -->
    <!-- 然后被teleport到对应节点的foreignObject内 -->
    <TeleportContainer />
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ProgressNode from "./components/ProgressNode.vue";
import {Graph} from "@antv/x6";
import {getTeleport, register} from "@antv/x6-vue-shape";
// import {Dnd} from "@antv/x6-plugin-dnd";
// import {Snapline} from "@antv/x6-plugin-snapline";

const TeleportContainer = getTeleport();

register({
  shape: "custom-progress",
  component: ProgressNode
});

export default defineComponent({
  name: "App",
  components: {
    TeleportContainer
  },
  mounted() {
    const graph = new Graph({
      container: document.getElementById("container")!,
      background: {
        color: "#F2F7FA"
      },
      autoResize: true
    });
    window.__x6_instances__ = [];
    window.__x6_instances__.push(graph);

    const node = graph.addNode({
      shape: "custom-progress",
      x: 60,
      y: 60,
      width: 100,
      height: 100,
      data: {
        progress: 10
      }
    });

    // 自动更新进度条
    setInterval(() => {
      const {progress} = node.getData();
      var newProgress;
      if (progress >= 100) {
        newProgress = 0;
      } else if (progress > 90) {
        newProgress = (progress + 10) % 100;
      } else {
        newProgress = progress + 10;
      }
      node.setData({
        progress: newProgress
      });
    }, 1000);
  }
});
</script>
<style scoped>
.app-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 98vh;
}
</style>