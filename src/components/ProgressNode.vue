<template>
    <div>
        <a-progress type="circle" :percent="progress" :size="100" />
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "ProgressNode",
    inject: ["getNode"],
    data() {
        return {
            progress: 0
        };
    },
    mounted() {
        // x6-vue-shape为vue component默认”provide“了getNode方法；
        // 在前面的component定义里显式地”inject“了getNode方法
        const node = (this as any).getNode();
        this.progress = node.getData().progress;
        node.on("change:data", ({current}: {current: {progress: number}}) => {
            const {progress} = current;
            this.progress = progress;
        });
    }
});
</script>