<template>
    <div id="app-main">
        <div id="app-header">
            <a-button type="primary" @click="exportConfig">导出配置</a-button>
            <a-button @click="importConfig">导入配置</a-button>
        </div>
        <div id="app-container">
            <div id="stencil" ref="stencilContainer">Nav</div>
            <div id="graph-container" ref="graphContainer">Content</div>
        </div>
        <div id="mini-graph-container" ref="miniGraphContainer"></div>
        <!-- 自定义component被渲染时，在逻辑关系上都位于这个Container内 -->
        <!-- 然后被teleport到对应节点的foreignObject内 -->
        <TeleportContainer />
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {getTeleport} from "@antv/x6-vue-shape";
import {Graph, Node, Shape} from "@antv/x6";
import {Stencil} from "@antv/x6-plugin-stencil";
import {Transform} from "@antv/x6-plugin-transform";
import {Selection} from "@antv/x6-plugin-selection";
import {Snapline} from "@antv/x6-plugin-snapline";
import {Keyboard} from "@antv/x6-plugin-keyboard";
import {Clipboard} from "@antv/x6-plugin-clipboard";
import {History} from "@antv/x6-plugin-history";
import {Scroller} from "@antv/x6-plugin-scroller";
import {MiniMap} from "@antv/x6-plugin-minimap";
import "./initShapes";

const TeleportContainer = getTeleport();

export default defineComponent({
    name: "App",
    components: {
        TeleportContainer
    },
    mounted() {
        // #region 初始化画布
        const graph = new Graph({
            container: this.$refs.graphContainer as HTMLElement,
            grid: true,
            mousewheel: {
                enabled: true,
                zoomAtMousePosition: true,
                modifiers: "ctrl",
                minScale: 0.5,
                maxScale: 3
            },
            connecting: {
                router: "manhattan",
                connector: {
                    name: "rounded",
                    args: {
                        radius: 8
                    }
                },
                anchor: "center",
                connectionPoint: "anchor",
                allowBlank: false,
                snap: {
                    radius: 20
                },
                createEdge() {
                    return new Shape.Edge({
                        attrs: {
                            line: {
                                stroke: "#A2B1C3",
                                strokeWidth: 2,
                                targetMarker: {
                                    name: "block",
                                    width: 12,
                                    height: 8
                                }
                            }
                        },
                        zIndex: 0
                    });
                },
                validateConnection({targetMagnet}) {
                    return !!targetMagnet;
                }
            },
            highlighting: {
                magnetAdsorbed: {
                    name: "stroke",
                    args: {
                        attrs: {
                            fill: "#5F95FF",
                            stroke: "#5F95FF"
                        }
                    }
                }
            }
        });
        window.__x6_instances__ = [];
        window.__x6_instances__.push(graph);
        // #endregion

        // #region 使用插件
        graph
            .use(
                new Transform({
                    resizing: {
                        enabled(node: Node) {
                            return node.shape !== "none";
                        }
                    },
                    rotating: false
                })
            )
            .use(
                new Selection({
                    rubberband: false,
                    strict: true,
                    showNodeSelectionBox: true,
                    showEdgeSelectionBox: true,
                    // 选中后，可操作内部html元素
                    pointerEvents: "none"
                })
            )
            .use(
                new Scroller({
                    enabled: true,
                    pageVisible: true,
                    pageBreak: true
                })
            )
            .use(
                new MiniMap({
                    container: this.$refs.miniGraphContainer as HTMLElement,
                    width: 200,
                    height: 160
                })
            )
            .use(new Snapline())
            .use(new Keyboard())
            .use(new Clipboard())
            .use(new History());
        // #endregion

        // #region 初始化 stencil
        const stencil = new Stencil({
            title: "流程图",
            target: graph,
            stencilGraphWidth: 200,
            stencilGraphHeight: 200,
            collapsable: false,
            groups: [
                {
                    name: "group1"
                },
                {
                    title: "系统设计图",
                    name: "group2",
                    graphHeight: 250,
                    layoutOptions: {
                        rowHeight: 70
                    }
                },
                {
                    title: "vue组件",
                    name: "group3",
                    graphHeight: 300,
                    layoutOptions: {
                        columns: 1,
                        rowHeight: 150,
                        columnWidth: 150
                    }
                }
            ],
            layoutOptions: {
                columns: 2,
                columnWidth: 80,
                rowHeight: 55
            }
        });
        (this.$refs.stencilContainer as HTMLElement).appendChild(stencil.container);
        // #endregion

        // #region 快捷键与事件
        graph.bindKey(["meta+c", "ctrl+c"], () => {
            const cells = graph.getSelectedCells();
            if (cells.length) {
                graph.copy(cells);
            }
            return false;
        });
        graph.bindKey(["meta+x", "ctrl+x"], () => {
            const cells = graph.getSelectedCells();
            if (cells.length) {
                graph.cut(cells);
            }
            return false;
        });
        graph.bindKey(["meta+v", "ctrl+v"], () => {
            if (!graph.isClipboardEmpty()) {
                const cells = graph.paste({offset: 32});
                graph.cleanSelection();
                graph.select(cells);
            }
            return false;
        });

        // undo redo
        graph.bindKey(["meta+z", "ctrl+z"], () => {
            if (graph.canUndo()) {
                graph.undo();
            }
            return false;
        });
        graph.bindKey(["meta+shift+z", "ctrl+shift+z"], () => {
            if (graph.canRedo()) {
                graph.redo();
            }
            return false;
        });

        // select all
        graph.bindKey(["meta+a", "ctrl+a"], () => {
            const nodes = graph.getNodes();
            if (nodes) {
                graph.select(nodes);
            }
        });

        // delete
        graph.bindKey(["Delete", "Backspace"], () => {
            const cells = graph.getSelectedCells();
            if (cells.length) {
                graph.removeCells(cells);
            }
        });

        // zoom
        graph.bindKey(["ctrl+1", "meta+1"], () => {
            const zoom = graph.zoom();
            if (zoom < 1.5) {
                graph.zoom(0.1);
            }
        });
        graph.bindKey(["ctrl+2", "meta+2"], () => {
            const zoom = graph.zoom();
            if (zoom > 0.5) {
                graph.zoom(-0.1);
            }
        });

        graph.on("edge:dblclick", ({edge}) => {
            // 当用户点击边时，选中这个边
            graph.removeCell(edge);
        });
        graph.on("edge:mouseenter", ({edge}) => {
            if (!edge.hasTool("vertices")) {
                edge.addTools({
                    name: "vertices",
                    args: {
                        removable: false,
                        removeRedundancies: true
                    }
                });
            }
        });
        graph.on("edge:mouseleave", ({edge}) => {
            if (edge.hasTool("vertices")) {
                edge.removeTool("vertices");
            }
        });

        // 控制连接桩显示/隐藏
        const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
            for (let i = 0, len = ports.length; i < len; i += 1) {
                ports[i].style.visibility = show ? "visible" : "hidden";
            }
        };
        graph.on("node:mouseenter", () => {
            const container = this.$refs.graphContainer as HTMLElement;
            const ports = container.querySelectorAll(".x6-port-body") as NodeListOf<SVGElement>;
            showPorts(ports, true);
        });
        graph.on("node:mouseleave", () => {
            const container = this.$refs.graphContainer as HTMLElement;
            const ports = container.querySelectorAll(".x6-port-body") as NodeListOf<SVGElement>;
            showPorts(ports, false);
        });
        // #endregion

        // #region 初始化stencil内的图形
        const r1 = graph.createNode({
            shape: "custom-rect",
            label: "开始",
            attrs: {
                body: {
                    rx: 20,
                    ry: 26
                }
            }
        });
        const r2 = graph.createNode({
            shape: "custom-rect",
            label: "过程"
        });
        const r3 = graph.createNode({
            shape: "custom-rect",
            attrs: {
                body: {
                    rx: 6,
                    ry: 6
                }
            },
            label: "可选过程"
        });
        const r4 = graph.createNode({
            shape: "custom-polygon",
            attrs: {
                body: {
                    refPoints: "0,10 10,0 20,10 10,20"
                }
            },
            label: "决策"
        });
        const r5 = graph.createNode({
            shape: "custom-polygon",
            attrs: {
                body: {
                    refPoints: "10,0 40,0 30,20 0,20"
                }
            },
            label: "数据"
        });
        const r6 = graph.createNode({
            shape: "custom-circle",
            label: "连接"
        });
        stencil.load([r1, r2, r3, r4, r5, r6], "group1");

        const imageShapes = [
            {
                label: "Client",
                image: "https://gw.alipayobjects.com/zos/bmw-prod/687b6cb9-4b97-42a6-96d0-34b3099133ac.svg"
            },
            {
                label: "Http",
                image: "https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg"
            },
            {
                label: "Api",
                image: "https://gw.alipayobjects.com/zos/bmw-prod/c55d7ae1-8d20-4585-bd8f-ca23653a4489.svg"
            },
            {
                label: "Sql",
                image: "https://gw.alipayobjects.com/zos/bmw-prod/6eb71764-18ed-4149-b868-53ad1542c405.svg"
            },
            {
                label: "Clound",
                image: "https://gw.alipayobjects.com/zos/bmw-prod/c36fe7cb-dc24-4854-aeb5-88d8dc36d52e.svg"
            },
            {
                label: "Mq",
                image: "https://gw.alipayobjects.com/zos/bmw-prod/2010ac9f-40e7-49d4-8c4a-4fcf2f83033b.svg"
            }
        ];
        const imageNodes = imageShapes.map(item =>
            graph.createNode({
                shape: "custom-image",
                label: item.label,
                attrs: {
                    image: {
                        "xlink:href": item.image
                    }
                }
            })
        );
        stencil.load(imageNodes, "group2");

        const customProgress = graph.createNode({
            shape: "custom-progress",
            width: 100,
            height: 100,
            data: {
                progress: 10
            }
        });
        const customServiceContainer = graph.createNode({
            shape: "custom-service-container",
            width: 150,
            height: 40,
            data: {
                txt: "test"
            }
        });
        stencil.load([customProgress, customServiceContainer], "group3");
        // #endregion
    },
    methods: {
        exportConfig() {
            const graph = window.__x6_instances__ && window.__x6_instances__[0];
            if (graph) {
                console.log(graph.toJSON());
                // 弹出保存对话框，把配置保存为文件
                const config = graph.toJSON();
                const json = JSON.stringify(config, null, 2);
                const blob = new Blob([json], {type: "text/plain"});
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "config.json";
                a.click();

                // 释放这个URL
                URL.revokeObjectURL(url);
            }
        },
        importConfig() {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = async () => {
                console.log("准备加载配置文件");
                const file = input.files && input.files[0];
                if (file) {
                    const text = await file.text();
                    console.log("已读取配置文件");
                    const config = JSON.parse(text);
                    const graph = window.__x6_instances__ && window.__x6_instances__[0];
                    if (graph) {
                        graph.fromJSON(config);
                    }
                }
                // 移除input
                input.remove();
            };
            input.click();
        }
    }
});
</script>

<style scoped>
#app-main {
    display: flex;
    flex-direction: column;
    height: 99vh;
}

#app-header {
    height: 30px;
}

#app-container {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
}

#stencil {
    width: 180px;
    position: relative;
    border-right: 1px solid #dfe3e8;
}

#graph-container {
    flex-grow: 1;
    position: relative;
}

#graph-container {
    position: relative;
    width: calc(100% - 180px);
    height: 100%;
}

#mini-graph-container {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 200px;
    height: 160px;
    background-color: rgb(224, 213, 213);
}
.x6-widget-stencil {
    background-color: #fff;
}
.x6-widget-stencil-title {
    background-color: #fff;
}
.x6-widget-stencil-group-title {
    background-color: #fff !important;
}
.x6-widget-transform {
    margin: -1px 0 0 -1px;
    padding: 0px;
    border: 1px solid #239edd;
}
.x6-widget-transform > div {
    border: 1px solid #239edd;
}
.x6-widget-transform > div:hover {
    background-color: #3dafe4;
}
.x6-widget-transform-active-handle {
    background-color: #3dafe4;
}
.x6-widget-transform-resize {
    border-radius: 0;
}
.x6-widget-selection-inner {
    border: 1px solid #239edd;
}
.x6-widget-selection-box {
    opacity: 0;
}
</style>