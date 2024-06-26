import { Graph } from "@antv/x6";
import { register } from "@antv/x6-vue-shape";
import ProgressNode from "./components/ProgressNode.vue";
import ServiceContainer from "./components/ServiceContainer.vue";

// 所有节点默认上下左右4个连接桩
const ports = {
    groups: {
        top: {
            position: "top",
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: "#5F95FF",
                    strokeWidth: 1,
                    fill: "#fff",
                    style: {
                        visibility: "hidden"
                    }
                }
            }
        },
        right: {
            position: "right",
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: "#5F95FF",
                    strokeWidth: 1,
                    fill: "#fff",
                    style: {
                        visibility: "hidden"
                    }
                }
            }
        },
        bottom: {
            position: "bottom",
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: "#5F95FF",
                    strokeWidth: 1,
                    fill: "#fff",
                    style: {
                        visibility: "hidden"
                    }
                }
            }
        },
        left: {
            position: "left",
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: "#5F95FF",
                    strokeWidth: 1,
                    fill: "#fff",
                    style: {
                        visibility: "hidden"
                    }
                }
            }
        }
    },
    items: [
        {
            group: "top"
        },
        {
            group: "right"
        },
        {
            group: "bottom"
        },
        {
            group: "left"
        }
    ]
};

// #region 定义图形
Graph.registerNode(
    "custom-rect",
    {
        inherit: "rect",
        width: 66,
        height: 36,
        attrs: {
            body: {
                strokeWidth: 1,
                stroke: "#5F95FF",
                fill: "#EFF4FF"                
            },
            text: {
                fontSize: 12,
                fill: "#262626"
            }
        },
        ports: { ...ports }
    },
    true
);

Graph.registerNode(
    "custom-container",
    {
        inherit: "rect",
        width: 66,
        height: 36,
        attrs: {
            body: {
                strokeWidth: 1,
                stroke: "#5F95FF",
                strokeDasharray: '5,5', // 设置虚线边框
                fill: "transparent", // 设置透明背景
            },
            text: {
                fontSize: 12,
                fill: "#262626"
            }
        }
    },
    true
);

Graph.registerNode(
    "custom-polygon",
    {
        inherit: "polygon",
        width: 66,
        height: 36,
        attrs: {
            body: {
                strokeWidth: 1,
                stroke: "#5F95FF",
                fill: "#EFF4FF"
            },
            text: {
                fontSize: 12,
                fill: "#262626"
            }
        },
        ports: {
            ...ports,
            items: [
                {
                    group: "top"
                },
                {
                    group: "bottom"
                }
            ]
        }
    },
    true
);

Graph.registerNode(
    "custom-circle",
    {
        inherit: "circle",
        width: 45,
        height: 45,
        attrs: {
            body: {
                strokeWidth: 1,
                stroke: "#5F95FF",
                fill: "#EFF4FF"
            },
            text: {
                fontSize: 12,
                fill: "#262626"
            }
        },
        ports: { ...ports }
    },
    true
);

Graph.registerNode(
    "custom-image",
    {
        inherit: "rect",
        width: 52,
        height: 52,
        markup: [
            {
                tagName: "rect",
                selector: "body"
            },
            {
                tagName: "image"
            },
            {
                tagName: "text",
                selector: "label"
            }
        ],
        attrs: {
            body: {
                stroke: "#5F95FF",
                fill: "#5F95FF"
            },
            image: {
                width: 26,
                height: 26,
                refX: 13,
                refY: 16
            },
            label: {
                refX: 3,
                refY: 2,
                textAnchor: "left",
                textVerticalAnchor: "top",
                fontSize: 12,
                fill: "#fff"
            }
        },
        ports: { ...ports }
    },
    true
);

register({
    shape: "custom-progress",
    component: ProgressNode,
    ports: { ...ports }
});
register({
    shape: "custom-service-container",
    component: ServiceContainer,
    ports: { ...ports }
});
// #endregion