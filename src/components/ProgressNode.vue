<template>
  <el-progress type="dashboard" :percentage="percentage" :width="80">
    <template #default="{percentage}">
      <span class="percentage-value">{{ percentage }}%</span>
    </template>
  </el-progress>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "ProgressNode",
  inject: ["getNode"],
  data() {
    return {
      percentage: 0
    };
  },
  mounted() {
    // x6-vue-shape为vue component默认”provide“了getNode方法；
    // 在前面的component定义里显式地”inject“了getNode方法
    const node = (this as any).getNode();
    console.log("调用getNode()", node);
    this.percentage = node.getData().progress;
    node.on("change:data", ({current}: {current: {progress: number}}) => {
      const {progress} = current;
      this.percentage = progress;
    });
  }
});
</script>