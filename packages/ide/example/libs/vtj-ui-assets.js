(function(e,t){typeof exports=="object"&&typeof module!="undefined"?module.exports=t():typeof define=="function"&&define.amd?define(t):(e=typeof globalThis!="undefined"?globalThis:e||self,e.VtjUIAssets=t())})(this,function(){"use strict";return{name:"vtj-ui",label:"UI",categories:[{id:"base",category:"元件"}],components:[{name:"XIcon",title:"图标",categoryId:"base",package:"@vtj/ui",props:[{name:"icon",label:"图标",setters:"IconSetter"},{name:"size",label:"尺寸",setters:["SelectSetter","NumberSetter"],options:["default","small","large"]},{name:"color",label:"颜色",setters:"ColorSetter"},{name:"src",label:"图片Url",setters:"InputSetter"}],snippet:{props:{icon:"Star"}}},{name:"XContainer",title:"容器",categoryId:"base",package:"@vtj/ui",props:[{name:"tag",label:"标签名",defaultValue:"div",setters:"InputSetter"},{name:"fit",label:"自适应",setters:"BooleanSetter",defaultValue:!1},{name:"width",label:"宽度",setters:["NumberSetter","InputSetter"]},{name:"height",label:"高度",setters:["NumberSetter","InputSetter"]},{name:"flex",label:"flex布局",setters:"BooleanSetter",defaultValue:!0},{name:"inline",label:"inline-flex",setters:"BooleanSetter",defaultValue:!1},{name:"direction",label:"主轴方向",setters:"SelectSetter",options:["row","row-reverse","column","column-reverse"],defaultValue:"row"},{name:"wrap",label:"换行",setters:"SelectSetter",options:["nowrap","wrap","wrap-reverse"],defaultValue:"nowrap"},{name:"justify",label:"主轴对齐",setters:"SelectSetter",options:["flex-start","flex-end","center","space-between","space-around"],defaultValue:"flex-start"},{name:"align",label:"副轴对齐",setters:"SelectSetter",options:["flex-start","flex-end","center","baseline","stretch"],defaultValue:"flex-start"},{name:"alignContent",label:"多轴对齐",setters:"SelectSetter",options:["flex-start","flex-end","center","space-between","space-around","stretch"],defaultValue:"stretch",title:"多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用"},{name:"grow",label:"自动放大",setters:"BooleanSetter",defaultValue:!1},{name:"shrink",label:"自动缩小",setters:"BooleanSetter",defaultValue:!1},{name:"alignSelf",label:"alignSelf",setters:"SelectSetter",options:["auto","flex-start","flex-end","center","baseline","stretch"],defaultValue:"auto",title:"单个项目有与其他项目不一样的对齐方式。可覆盖容器的align-items属性"},{name:"overflow",label:"overflow",setters:"SelectSetter",options:["auto","hidden","visible"]},{name:"padding",label:"开启内边距",setters:"BooleanSetter",defaultValue:!1}],snippet:{props:{fit:!0,auto:!0}}},{name:"XHeader",title:"标题",categoryId:"base",package:"@vtj/ui",props:[{name:"size",label:"尺寸",setters:"SelectSetter",options:["default","small","large"]},{name:"content",label:"内容",setters:"InputSetter"},{name:"subtitle",label:"子标题",setters:"InputSetter"},{name:"icon",label:"图标",setters:"IconSetter"},{name:"border",label:"边框",setters:"BooleanSetter"},{name:"more",label:"更多链接",setters:"BooleanSetter"}],slots:["default","subtitle","actions"],snippet:{props:{content:"标题文本内容"}}},{name:"XAction",title:"动作",categoryId:"base",package:"@vtj/ui",props:[{name:"name",label:"名称",setters:"InputSetter"},{name:"label",label:"文本",setters:"InputSetter"},{name:"value",label:"动作值",setters:"InputSetter"},{name:"icon",label:"图标",setters:"IconSetter"},{name:"mode",label:"模式",setters:"SelectSetter",options:["button","text","icon"],defaultValue:"button"},{name:"disabled",label:"禁用",setters:"BooleanSetter",defaultValue:!1},{name:"size",label:"尺寸",setters:"SelectSetter",options:["default","small","large"],defaultValue:"default"},{name:"type",label:"类型",setters:"SelectSetter",options:["primary","success","warning","danger","info"],defaultValue:"primary"},{name:"background",label:"背景",setters:"SelectSetter",options:["always","hover"],defaultValue:"always",title:"icon 背景设置，当 mode为 icon 时有效"},{name:"circle",label:"圆形图标",setters:"BooleanSetter",title:"icon 背景样式圆形，当 mode为 icon 时有效"},{name:"menus",label:"下拉菜单",setters:"JSONSetter"},{name:"tooltip",label:"tooltip",setters:["InputSetter","JSONSetter"]},{name:"badge",label:"徽章",setters:["InputSetter","NumberSetter","JSONSetter"]},{name:"dropdown",label:"Dropdown",setters:"JSONSetter"},{name:"button",label:"按钮组件",setters:"JSONSetter",title:"ElButton 组件配置，mode为button时有效"}],events:[{name:"click",params:["props"]},{name:"command",params:["item"]}],snippet:{props:{label:"操作"}}},{name:"XPanel",title:"面板",categoryId:"base",package:"@vtj/ui",props:[{name:"fit",label:"自适应",setters:"BooleanSetter"},{name:"width",label:"宽度",setters:["InputSetter","NumberSetter"]},{name:"height",label:"高度",setters:["InputSetter","NumberSetter"]},{name:"border",label:"边框",setters:"BooleanSetter",defaultValue:!0},{name:"radius",label:"圆角",setters:"BooleanSetter",defaultValue:!0},{name:"card",label:"卡片模式",setters:"BooleanSetter",defaultValue:!1},{name:"size",label:"尺寸",setters:"SelectSetter",options:["default","small","large"]},{name:"shadow",label:"阴影",setters:"SelectSetter",options:["none","always","hover"],defaultValue:"none"},{name:"header",label:"标题",setters:["InputSetter","JSONSetter"]},{name:"bodyPadding",label:"bodyPadding",setters:"BooleanSetter"},{name:"footerPadding",label:"footerPadding",setters:"BooleanSetter"},{name:"body",label:"body",setters:"JSONSetter"},{name:"footer",label:"footer",setters:"JSONSetter"}],slots:["default","header","footer","actions","title"],snippet:{props:{header:"面板标题"}}},{name:"XDialog",title:"弹窗",categoryId:"base",package:"@vtj/ui",props:[{name:"modelValue",label:"显示",setters:"BooleanSetter",defaultValue:!0},{name:"title",label:"标题",setters:"InputSetter"},{name:"subtitle",label:"副标题",setters:"InputSetter"},{name:"icon",label:"图标",setters:"IconSetter"},{name:"size",label:"尺寸",setters:"SelectSetter",options:["default","small","large"],defaultValue:"default"},{name:"width",label:"宽度",setters:["InputSetter","NumberSetter"],defaultValue:"70%"},{name:"height",label:"高度",setters:["InputSetter","NumberSetter"],defaultValue:"70%"},{name:"modal",label:"蒙层",setters:"BooleanSetter",defaultValue:!0},{name:"draggable",label:"draggable",setters:"BooleanSetter",defaultValue:!0},{name:"resizable",label:"拖动",setters:"BooleanSetter",defaultValue:!0},{name:"closable",label:"可关闭",setters:"BooleanSetter",defaultValue:!0},{name:"maximizable",label:"可最大化",setters:"BooleanSetter",defaultValue:!0},{name:"minimizable",label:"可最小化",setters:"BooleanSetter",defaultValue:!0},{name:"primary",label:"primary",setters:"BooleanSetter"},{name:"src",label:"页面URL",setters:"InputSetter"},{name:"submit",label:"提交按钮",setters:["BooleanSetter","InputSetter"]},{name:"cancel",label:"取消按钮",setters:["BooleanSetter","InputSetter"]}],events:["update:modelValue","open","close","destroy","maximized","minimized","normal","modeChange","dragStart","dragging","dragEnd","resizeStart","resizeEnd","resizing","submit","cancel"],slots:["default","actions","footer"],snippet:{props:{title:"弹窗标题"},children:[{props:{fit:!0,auto:!0},name:"XContainer"}]}},{name:"XForm",title:"表单",categoryId:"base",package:"@vtj/ui",props:[{name:"model",label:"表单模型",setters:"JSONSetter"},{name:"inline",label:"横向排版",setters:"BooleanSetter"},{name:"inlineColumns",label:"横向显示列",setters:"NumberSetter"},{name:"footer",label:"显示底部",setters:"BooleanSetter"},{name:"submitText",label:"提交按钮",setters:"InputSetter",defaultValue:"提交"},{name:"resetText",label:"重置按钮",setters:"InputSetter",defaultValue:"重置"},{name:"submitMethod",label:"提交回调函数",setters:"FunctionSetter"},{name:"rules",defaultValue:"",setters:"JSONSetter"},{name:"labelPosition",defaultValue:"right",options:["left","right","top"],setters:"SelectSetter"},{name:"labelWidth",defaultValue:"",setters:["InputSetter","NumberSetter"]},{name:"labelSuffix",defaultValue:"",setters:"InputSetter"},{name:"hideRequiredAsterisk",defaultValue:!1,title:"是否显示必填字段的标签旁边的红色星号",label:"隐藏必填星号",setters:"BooleanSetter"},{name:"requireAsteriskPosition",defaultValue:"left",title:"星号的位置",label:"星号位置",options:["left","right"],setters:"SelectSetter"},{name:"showMessage",defaultValue:!0,title:"是否显示校验错误信息",label:"显示错误",setters:"BooleanSetter"},{name:"inlineMessage",defaultValue:!1,title:"是否以行内形式展示校验信息",setters:"BooleanSetter"},{name:"statusIcon",defaultValue:!1,title:"是否在输入框中显示校验结果反馈图标",setters:"BooleanSetter"},{name:"validateOnRuleChange",defaultValue:!0,title:"是否在 rules 属性改变后立即触发一次验证",label:"validate",setters:"BooleanSetter"},{name:"size",defaultValue:"",options:["large","default","small"],setters:"SelectSetter"},{name:"disabled",defaultValue:!1,setters:"BooleanSetter"},{name:"scrollToError",defaultValue:!1,setters:"BooleanSetter"}],events:["change","submit","reset"],slots:["default","footer"],snippet:{children:[{name:"XField",props:{name:"title",label:"标题"}},{name:"XField",props:{name:"type",label:"分类",editor:"select",options:[{label:"类别一",value:1},{label:"类别二",value:2},{label:"类别三",value:3}]}}]}},{name:"XField",title:"表单字段",categoryId:"base",package:"@vtj/ui",props:[{name:"name",label:"字段名称",setters:"InputSetter"},{name:"label",label:"字段标题",setters:"InputSetter"},{name:"modelValue",label:"字段值",setters:"InputSetter"},{name:"editor",label:"编辑器",setters:"SelectSetter",options:["none","text","textarea","select","checkbox","radio","number","date","time","datetime","switch","slider","rate","cascader"],defaultValue:"text"},{name:"props",label:"编辑器参数",setters:"JSONSetter"},{name:"size",defaultValue:"",options:["large","default","small"],setters:"SelectSetter"},{name:"width",label:"宽度",setters:["InputSetter","NumberSetter"]},{name:"tooltipMessage",label:"tooltipMessage",setters:"BooleanSetter",title:"是否在tooltip显示校验信息"},{name:"tooltipPosition",defaultValue:"outer",options:["inner","outer","small"],setters:["SelectSetter","NumberSetter"],title:"tooltip信息显示相对输入框的位置"},{name:"options",label:"选项数据",setters:["JSONSetter","FunctionSetter"]},{name:"visible",label:"显示控制",setters:["BooleanSetter","JSONSetter","FunctionSetter"],defaultValue:!0},{name:"cascader",label:"级联字段",setters:["InputSetter","JSONSetter"]},{name:"labelWidth",defaultValue:"",setters:["InputSetter","NumberSetter"]},{name:"required",defaultValue:!1,setters:"BooleanSetter"},{name:"rules",defaultValue:"",setters:"JSONSetter"},{name:"error",defaultValue:"",setters:"InputSetter"},{name:"showMessage",defaultValue:!0,title:"是否显示校验错误信息",label:"错误信息",setters:"BooleanSetter"},{name:"inlineMessage",defaultValue:!1,title:"是否在行内显示校验信息",label:"校验信息",setters:"BooleanSetter"}],events:["update:modelValue","change","focus","blur"],slots:["label","editor","option"],snippet:{}}]}});
