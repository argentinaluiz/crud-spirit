import { describe, it, beforeEach } from "node:test";
import { DataSource } from "typeorm";
import { Project, ProjectStatus, Task, TaskStatus } from "../../entities";
import assert from "node:assert";
import { ProjectService } from "../../services";

describe("Project Service Integration", () => {
  let dataSource: DataSource;
  let projectService: ProjectService;
  beforeEach(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      entities: [Project, Task],
    });
    await dataSource.initialize();
    await dataSource.synchronize(true);
    projectService = new ProjectService(
      dataSource.manager.getRepository(Project)
    );
  });

  it("should create a project", async () => {
    let project = await projectService.create({
      name: "test",
      description: "test description",
    });
    assert.strictEqual(project.name, "test");
    assert.strictEqual(project.description, "test description");
    assert.strictEqual(project.status, ProjectStatus.Pending);

    const newProject = await dataSource.manager.findOneByOrFail(Project, {
      id: project.id,
    });
    assert.strictEqual(newProject.name, "test");
    assert.strictEqual(newProject.description, "test description");
    assert.strictEqual(newProject.status, ProjectStatus.Pending);

    project = await projectService.create({
      name: "test",
      description: "test description",
      started_at: new Date(),
    });
    assert.strictEqual(project.status, ProjectStatus.Active);
  });

  it("should start a project", async () => {
    let project = await projectService.create({
      name: "test",
      description: "test description",
    });
    const started_at = new Date();
    project = await projectService.start(project.id, started_at);
    assert.strictEqual(project.status, ProjectStatus.Active);
    assert.strictEqual(project.started_at?.getTime(), started_at.getTime());
  });

  it("should cancel a project", async () => {
    let project = await projectService.create({
      name: "test",
      description: "test description",
      started_at: new Date(),
    });
    const cancelled_at = new Date();
    project = await projectService.cancel(project.id, cancelled_at);
    assert.strictEqual(project.status, ProjectStatus.Cancelled);
    assert.strictEqual(project.cancelled_at?.getTime(), cancelled_at.getTime());
  });

  it("should complete a project", async () => {
    let project = await projectService.create({
      name: "test",
      description: "test description",
      started_at: new Date(),
    });
    const finished_at = new Date();
    project = await projectService.complete(project.id, finished_at);
    assert.strictEqual(project.status, ProjectStatus.Completed);
    assert.strictEqual(project.finished_at?.getTime(), finished_at.getTime());
  });

  it("should add a task to a project", async () => {
    let project = await projectService.create({
      name: "test",
      description: "test description",
    });
    let task = await projectService.addTask({
      project_id: project.id,
      name: "test",
      description: "test description",
      started_at: new Date(),
    });

    const projectUpdated = await dataSource.manager.findOneByOrFail(Project, {
      id: project.id,
    });

    assert.strictEqual(projectUpdated.tasks.length, 1);
    task = projectUpdated.tasks[0];
    assert.strictEqual(task.name, "test");
    assert.strictEqual(task.description, "test description");
    assert.strictEqual(task.status, TaskStatus.Active);
    assert.strictEqual(projectUpdated.status, ProjectStatus.Active);
  });

  it("should start a task in a project", async () => {
    let project = await projectService.create({
      name: "test",
      description: "test description",
    });
    let task = await projectService.addTask({
      project_id: project.id,
      name: "test",
      description: "test description",
      started_at: null,
    });
    task = await projectService.startTask(project.id, task.id, new Date());
    assert.strictEqual(task.status, TaskStatus.Active);
  });

  it("should cancel a task in a project", async () => {
    let project = await projectService.create({
      name: "test",
      description: "test description",
    });
    let task = await projectService.addTask({
      project_id: project.id,
      name: "test",
      description: "test description",
      started_at: null,
    });
    task = await projectService.cancelTask(project.id, task.id, new Date());
    assert.strictEqual(task.status, TaskStatus.Cancelled);
  });

  it("should complete a task in a project", async () => {
    let project = await projectService.create({
      name: "test",
      description: "test description",
    });
    let task = await projectService.addTask({
      project_id: project.id,
      name: "test",
      description: "test description",
      started_at: null,
    });
    task = await projectService.completeTask(project.id, task.id, new Date());
    assert.strictEqual(task.status, TaskStatus.Completed);
  });
});
