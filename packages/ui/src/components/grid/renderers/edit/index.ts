import { h } from 'vue';
import { VXETable } from 'vxe-table';
import InputEdit from './InputEdit.vue';
import SelectEdit from './SelectEdit.vue';
import DateEdit from './DateEdit.vue';

export function registerEdit() {
  
  VXETable.renderer.add('InputEdit', {
    cellClassName: 'x-grid__edit',
    autofocus: '.el-input__inner',
    renderEdit(renderOpts, params) {
      return h(InputEdit, { params, renderOpts });
    }
  });

  VXETable.renderer.add('SelectEdit', {
    cellClassName: 'x-grid__edit',
    autofocus: '.el-select__input',
    renderEdit(renderOpts, params) {
      return h(SelectEdit, { params, renderOpts });
    }
  });

  VXETable.renderer.add('DateEdit', {
    cellClassName: 'x-grid__edit',
    autofocus: '.el-input__inner',
    renderEdit(renderOpts, params) {
      return h(DateEdit, { params, renderOpts });
    }
  });

  VXETable.interceptor.add('event.clearEdit', (params) => {
    const { $grid, $event, $table } = params;
    const parent = $table.getParentElem();
    // 如果不是表格组件后代节点触发的clearEdit事件，阻止关闭编辑模式
    if (parent.contains($event.target)) {
      $grid.clearValidate();
    } else {
      return false;
    }
    console.log('event.clearEdit', params);
  });
}
