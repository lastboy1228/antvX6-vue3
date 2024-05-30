<template>
    <div ref="chartContainer"></div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Chart} from "@antv/g2";

export default defineComponent({
    name: "G2Chart",
    props: {
        type: String,
        data: []
    },
    data() {
        return {
            progress: 0
        };
    },
    mounted() {
        // 初始化图表实例
        const chart = new Chart({
            container: this.$refs.chartContainer as HTMLElement
        });
        chart
            .data(this.data)
            .encode("x", "year") // 视图层级的编码
            .encode("y", "value");
        chart.line();
        chart.point();
        chart.render();
    }
});
</script>