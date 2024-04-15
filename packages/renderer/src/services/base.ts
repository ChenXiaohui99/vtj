import {
  type ProjectSchema,
  type PageFile,
  type BlockFile,
  type BlockSchema,
  type MaterialDescription,
  type HistorySchema,
  type HistoryItem,
  type Service,
  type StaticFileInfo
} from '@vtj/core';
import { Request } from '@vtj/utils';
import { ElNotification } from 'element-plus';

const request = new Request({
  settings: {
    type: 'json',
    validSuccess: true,
    originResponse: false,
    failMessage: true,
    validate: (res: any) => {
      return res.data?.code === 0;
    },
    showError: (msg: string) => {
      ElNotification.error({
        message: msg || '未知错误'
      });
    }
  }
});

const createApi = (url: string = '/vtj/local/repository/${type}.json') => {
  return (type: string, data?: any) => {
    return request.send({
      url,
      method: 'post',
      query: { type },
      data: {
        type,
        data
      }
    });
  };
};

const createUploader = (url: string = '/vtj/local/repository/uploader') => {
  return (files: File[]) => {
    return request.send({
      url,
      method: 'post',
      data: {
        files
      },
      settings: {
        type: 'data'
      }
    });
  };
};

export class BaseService implements Service {
  protected api: (type: string, data: any) => Promise<any>;
  protected uploader: (files: File[]) => Promise<StaticFileInfo[]>;
  constructor() {
    this.api = createApi();
    this.uploader = createUploader();
  }

  async init(project: ProjectSchema): Promise<ProjectSchema> {
    console.log('BaseService.init', project);
    return {} as ProjectSchema;
  }

  async saveProject(project: ProjectSchema): Promise<boolean> {
    const res = await this.api('saveProject', project).catch(() => false);
    return !!res;
  }

  async saveMaterials(
    project: ProjectSchema,
    materials: Map<string, MaterialDescription>
  ): Promise<boolean> {
    console.log('BaseService.saveMaterials', project, materials);
    return false;
  }

  async saveFile(file: BlockSchema): Promise<boolean> {
    console.log('BaseService.saveFile', file);
    return false;
  }
  async getFile(id: string): Promise<BlockSchema> {
    console.log('BaseService.getFile', id);
    return {} as BlockSchema;
  }

  async removeFile(id: string): Promise<boolean> {
    console.log('BaseService.removeFile', id);
    return false;
  }

  async saveHistory(history: HistorySchema): Promise<boolean> {
    console.log('BaseService.saveHistory', history);
    return false;
  }

  async removeHistory(id: string): Promise<boolean> {
    console.log('BaseService.removeHistory', id);
    return false;
  }

  async getHistory(id: string): Promise<HistorySchema> {
    console.log('BaseService.getHistory', id);
    return {} as HistorySchema;
  }

  async getHistoryItem(fId: string, id: string): Promise<HistoryItem> {
    console.log('BaseService.getHistoryItem', fId, id);
    return {} as HistoryItem;
  }

  async saveHistoryItem(fId: string, item: HistoryItem): Promise<boolean> {
    console.log('BaseService.saveHistoryItem', fId, item);
    return false;
  }

  async removeHistoryItem(fId: string, ids: string[]): Promise<boolean> {
    console.log('BaseService.removeHistoryItem', fId, ids);
    return false;
  }

  async publish(project: ProjectSchema): Promise<boolean> {
    return !!(await this.api('publish', project).catch(() => false));
  }

  async publishFile(
    project: ProjectSchema,
    file: PageFile | BlockFile
  ): Promise<boolean> {
    return !!(await this.api('publishFile', { project, file }).catch(
      () => false
    ));
  }

  async genVueContent(
    project: ProjectSchema,
    dsl: BlockSchema
  ): Promise<string> {
    return await this.api('genVueContent', { project, dsl }).catch(() => '');
  }

  async createRawPage(file: PageFile): Promise<boolean> {
    return await this.api('createRawPage', file).catch(() => '');
  }

  async removeRawPage(id: string): Promise<boolean> {
    return await this.api('removeRawPage', id).catch(() => '');
  }

  async uploadStaticFiles(files: File[]): Promise<StaticFileInfo[]> {
    return await this.uploader(files).catch(() => []);
  }
  async getStaticFiles(): Promise<StaticFileInfo[]> {
    const res = await this.api('getStaticFiles', undefined).catch(() => []);
    return res as StaticFileInfo[];
  }
  async removeStaticFile(name: string): Promise<boolean> {
    return await this.api('removeStaticFile', name).catch(() => '');
  }
  async clearStaticFiles(): Promise<boolean> {
    return await this.api('clearStaticFiles', undefined).catch(() => '');
  }
}
