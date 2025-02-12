import {
  createRequest,
  jsonp,
  type IRequestSettings,
  type IStaticRequest,
  type Jsonp
} from '@vtj/utils';

import { Access } from '../plugins';

export interface CreateAdapterOptions {
  notify?: (msg: string) => void;
  loading?: () => any;
  settings?: IRequestSettings;
}

export interface ProvideAdapter {
  request: IStaticRequest;
  jsonp: Jsonp;
  metaQuery?: (...args: any[]) => Promise<any>;
  access?: Access;
  startupComponent?: any;
  /**
   * 远程服务 host
   */
  remote?: string;
  [index: string]: any;
}

export function createAdapter(options: CreateAdapterOptions = {}) {
  const { notify, loading, settings = {} } = options;
  let _loading: any = null;
  const request = createRequest({
    settings: {
      type: 'form',
      validSuccess: true,
      originResponse: false,
      loading: true,
      validate: (res: any) => {
        return res.data?.code === 0 || !!res.data?.success;
      },
      failMessage: true,
      showError: (msg: string) => {
        if (notify) {
          notify(msg || '未知错误');
        }
      },
      showLoading: () => {
        if (_loading) {
          _loading.close();
        }
        if (loading) {
          _loading = loading();
        }
      },
      hideLoading: () => {
        if (_loading) {
          _loading.close();
          _loading = null;
        }
      },
      ...settings
    }
  });
  return {
    request,
    jsonp,
    notify,
    loading
  } as ProvideAdapter;
}
