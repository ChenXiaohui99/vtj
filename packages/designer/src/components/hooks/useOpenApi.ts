import { jsonp } from '@vtj/utils';
import type { BlockSchema } from '@vtj/core';
import { useEngine } from '../../framework';

export interface PublishTemplateDto {
  name: string;
  label: string;
  category: string;
  cover: Blob;
  share: boolean;
  version: string;
  latest?: string;
  dsl: string;
  id?: string;
}

export interface TemplateDto {
  id: string;
  name: string;
  label: string;
  vip: boolean;
  share: boolean;
  cover: string;
  author: string;
  userId: string;
  category: string;
  latest: string;
}

export function useOpenApi() {
  const engine = useEngine();
  const { access, remote, auth = '#/auth' } = engine.adapter || {};

  const toRemoteAuth = () => {
    if (remote) {
      // const { protocol, host, pathname } = location;
      // const clientUrl = `${protocol}//${host}${pathname}${auth}`;
      // const redirectUrl =
      //   clientUrl +
      //   '?redirect=' +
      //   encodeURIComponent(location.hash.substring(1));
      // location.href = `${remote}/auth.html?r=${encodeURIComponent(redirectUrl)}`;
      location.href = `${remote}/auth.html?r=${encodeURIComponent(location.href)}`;
    }
  };

  const isLogined = async () => {
    const token = access?.getData()?.token;
    if (token) {
      const api = `${remote}/api/open/user/${token}`;
      const res = await jsonp(api).catch(() => null);
      if (res && res.data) {
        return true;
      }
      return false;
    }
    return false;
  };

  const getTemplates = async () => {
    const api = `${remote}/api/open/templates`;
    const token = access?.getData()?.token;
    const res = await jsonp(api, { query: token ? { token } : {} });
    return (res?.data || []) as TemplateDto[];
  };

  const getTemplateById = async (id: string) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/template/${token}`;
    const res = await jsonp(api, { query: { id } });
    return (res?.data || null) as TemplateDto;
  };

  const removeTemplate = async (id: string) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/template/remove/${token}`;
    const res = await jsonp(api, { query: { id } });
    return !!res?.data;
  };

  const getTemplateDsl = async (id: string) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/dsl/${token}`;
    const res = await jsonp(api, { query: { id } });
    if (res?.data) {
      return res.data as BlockSchema;
    }
    return null;
  };

  const getDictOptions = async (code: string) => {
    const api = `${remote}/api/open/dict/${code}`;
    const res = await jsonp(api);
    return res?.data || [];
  };

  const getTemplateCategories = () => getDictOptions('TemplateCategory');

  const publishTemplate = async (dto: PublishTemplateDto) => {
    const token = access?.getData()?.token;
    const api = `${remote}/api/open/template/publish/${token}`;
    const data = new FormData();
    for (const [name, value] of Object.entries(dto)) {
      if (value !== undefined) {
        data.append(name, value);
      }
    }
    return window
      .fetch(api, {
        method: 'post',
        body: data
      })
      .then((res) => res.json());
  };

  return {
    engine,
    access,
    remote,
    auth,
    toRemoteAuth,
    isLogined,
    getTemplates,
    getTemplateDsl,
    getDictOptions,
    getTemplateCategories,
    publishTemplate,
    getTemplateById,
    removeTemplate
  };
}
