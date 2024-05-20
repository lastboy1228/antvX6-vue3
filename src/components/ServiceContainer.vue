<template>
    <div ref="serviceContainer">
        <a-input-search v-model:value="serviceName" placeholder="" enter-button="添加" size="large" @search="onSearch" />
        <li v-for="service in services" :key="service">{{ service }}</li>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "ProgressNode",
    inject: ["getNode"],
    data() {
        return {
            services: [] as string[],
            serviceName: "",
            txt: ""
        };
    },
    mounted() {
        // x6-vue-shape为vue component默认”provide“了getNode方法；
        // 在前面的component定义里显式地”inject“了getNode方法
        const node = (this as any).getNode();
        this.txt = node.getData().txt;
        this.serviceName = node.getData().services || [];
        node.on("change:data", ({current}: {current: {txt: string}}) => {
            const {txt} = current;
            this.txt = txt;
        });
    },
    methods: {
        onSearch() {
            if (this.serviceName == "") {
                return;
            }
            this.services.includes(this.serviceName) || this.services.push(this.serviceName);
            this.serviceName = "";
            const el = this.$refs.serviceContainer as HTMLElement;
            // 保持node的size和html元素的size一致
            this.$nextTick(() => {
                const node = (this as any).getNode();
                node.setData({services: this.services}, {silent: true});
                console.log(el.offsetWidth, el.offsetHeight);
                node.prop("size", {width: el.offsetWidth, height: el.offsetHeight});
            });
        }
    }
});
</script>