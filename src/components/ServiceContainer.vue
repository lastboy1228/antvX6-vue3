<template>
    <div>
        <a-collapse v-model:activeKey="activeKey" @change="changeActivekey">
            <a-collapse-panel key="1" header="header1">
                <a-collapse default-active-key="4">
                    <a-collapse-panel key="4" header="This is panel nest panel">
                        <p>{{ txt }}</p>
                    </a-collapse-panel>
                </a-collapse>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="2">
                <p>{{ txt }}</p>
            </a-collapse-panel>
            <a-collapse-panel key="3" header="3">
                <p>{{ txt }}</p>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
    name: "ProgressNode",
    inject: ["getNode"],
    data() {
        return {
            activeKey: ref([]),
            txt: ""
        };
    },
    methods: {
        changeActivekey(key: string) {
            console.log(key);
        }
    },
    mounted() {
        // x6-vue-shape为vue component默认”provide“了getNode方法；
        // 在前面的component定义里显式地”inject“了getNode方法
        const node = (this as any).getNode();
        this.txt = node.getData().txt;
        node.on("change:data", ({current}: {current: {txt: string}}) => {
            const {txt} = current;
            this.txt = txt;
        });
        
    }
});
</script>