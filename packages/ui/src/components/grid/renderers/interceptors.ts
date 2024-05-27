import { registerInterceptor } from '../utils';

registerInterceptor('event.clearEdit', (params) => {
  const { $grid, $event, $table } = params;
  const parent = $table.getParentElem();
  // 如果不是表格组件后代节点触发的clearEdit事件，阻止关闭编辑模式
  if (parent.contains($event.target)) {
    $grid.clearValidate();
  } else {
    return false;
  }
});

registerInterceptor('event.clearFilter', (params) => {
  const { $event, $table } = params;
  const parent = $table.getParentElem();
  // 如果不是表格组件后代节点触发的clearEdit事件，阻止关闭编辑模式
  if (parent.contains($event.target)) {
    // $grid.clearValidate();
  } else {
    return false;
  }
});
