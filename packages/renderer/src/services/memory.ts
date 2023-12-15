import {
  type Service,
  type ProjectSchema,
  type BlockSchema,
  type HistorySchema,
  ProjectModel
} from '@vtj/core';

export class MemoryService implements Service {
  private projects: Record<string, ProjectSchema> = {};
  private files: Record<string, BlockSchema> = {};
  private histories: Record<string, HistorySchema> = {};

  public init(project: ProjectSchema): Promise<ProjectSchema> {
    const model = new ProjectModel(project);
    const match = this.projects[model.id] || {};
    const dsl = Object.assign(model.toDsl(), match);
    this.projects[dsl.id as string] = dsl;
    return Promise.resolve(dsl);
  }
  public saveProject(project: ProjectSchema): Promise<boolean> {
    const model = new ProjectModel(project);
    this.projects[model.id] = model.toDsl();
    return Promise.resolve(true);
  }
  public saveFile(file: BlockSchema): Promise<boolean> {
    this.files[file.id as string] = file;
    return Promise.resolve(true);
  }
  public getFile(id: string): Promise<BlockSchema> {
    const file = this.files[id];
    return file ? Promise.resolve(file) : Promise.reject(null);
  }
  public removeFile(id: string): Promise<boolean> {
    delete this.files[id];
    return Promise.resolve(true);
  }
  public saveHistory(history: HistorySchema): Promise<boolean> {
    this.histories[history.id] = history;
    return Promise.resolve(true);
  }
  public removeHistory(id: string): Promise<boolean> {
    delete this.histories[id];
    return Promise.resolve(true);
  }

  public getHistory(id: string): Promise<HistorySchema> {
    const history = this.histories[id];
    return Promise.resolve(history);
  }
}
