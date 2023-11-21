import { builtInWidgets } from './built-in';
import { type Widget, RegionType } from '../framework';
import { logger } from '@vtj/core';

/**
 * Widget管理类
 */
class WidgetManager {
  private widgets: Record<string, Widget> = {};

  constructor() {
    this.widgets = this.createWidgets();
  }

  private createWidgets() {
    const widgets: Record<string, Widget> = {};
    for (const item of builtInWidgets) {
      widgets[item.name] = item;
    }
    return widgets;
  }

  /**
   * 注册一个器件
   * @param widget
   */
  register(widget: Widget) {
    this.widgets[widget.name] = widget;
  }

  /**
   * 根据名称获取器件配置
   * @param name
   * @returns
   */
  get(name: string) {
    return this.widgets[name];
  }

  /**
   * 修改器件
   * @param name
   * @param widget
   * @returns
   */
  set(name: string, widget: Partial<Widget>) {
    const match = this.widgets[name];
    if (!match) {
      logger.warn(`widget '${name}' is not found`);
      return;
    }
    Object.assign(match, widget);
  }
  /**
   * 根据区域名称获取区域内的器件配置
   * @param region
   * @returns
   */
  getWidgets(region?: keyof typeof RegionType) {
    const widgets = Object.values(this.widgets);
    if (region) {
      return widgets.filter((n) => n.region === region);
    }
    return widgets;
  }
}

export const widgetManager = new WidgetManager();
