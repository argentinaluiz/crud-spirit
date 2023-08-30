import { describe, it, beforeEach } from "node:test";
import { DataSource } from "typeorm";
import { Project, ProjectStatus, Task } from "../../entities";
import assert from "node:assert";

describe("Project Entity Integration", () => {
  let dataSource: DataSource;
  beforeEach(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      entities: [Project, Task],
    });
    await dataSource.initialize();
    await dataSource.synchronize(true);
  });

  it("should create a project", async () => {
    const project = Project.create({
      name: "test",
      description: "test description",
    });
    await dataSource.manager.save(project);
    const newProject = await dataSource.manager.findOneByOrFail(Project, {
      id: project.id,
    });
    assert.strictEqual(newProject.name, "test");
    assert.strictEqual(newProject.description, "test description");
    assert.strictEqual(newProject.status, ProjectStatus.Pending);
  });

  it("should start a project", async () => {
    const project = Project.create({
      name: "test",
      description: "test description",
    });
    await dataSource.manager.save(project);
    const started_at = new Date();
    project.start(started_at);
    await dataSource.manager.save(project);
    const newProject = await dataSource.manager.findOneByOrFail(Project, {
      id: project.id,
    });
    assert.strictEqual(newProject.status, ProjectStatus.Active);
    assert.strictEqual(newProject.started_at?.getTime(), started_at.getTime());
  });

  it("should cancel a project", async () => {
    const project = Project.create({
      name: "test",
      description: "test description",
    });
    await dataSource.manager.save(project);
    const started_at = new Date();
    project.start(started_at);
    await dataSource.manager.save(project);
    const cancelled_at = new Date();
    project.cancel(cancelled_at);
    await dataSource.manager.save(project);
    const newProject = await dataSource.manager.findOneByOrFail(Project, {
      id: project.id,
    });
    assert.strictEqual(newProject.status, ProjectStatus.Cancelled);
    assert.strictEqual(
      newProject.cancelled_at?.getTime(),
      cancelled_at.getTime()
    );
  });

  it("should complete a project", async () => {
    const project = Project.create({
      name: "test",
      description: "test description",
    });
    await dataSource.manager.save(project);
    const started_at = new Date();
    project.start(started_at);
    await dataSource.manager.save(project);
    const finished_at = new Date();
    project.complete(finished_at);
    await dataSource.manager.save(project);
    const newProject = await dataSource.manager.findOneByOrFail(Project, {
      id: project.id,
    });
    assert.strictEqual(newProject.status, ProjectStatus.Completed);
    assert.strictEqual(
      newProject.finished_at?.getTime(),
      finished_at.getTime()
    );
  });

  it("should add a task in a project", async () => {
    const project = Project.create({
      name: "test",
      description: "test description",
    });
    const task = Task.create({
      name: "test",
      description: "test description",
      started_at: new Date(),
    });
    project.addTask(task);
    await dataSource.manager.save(project);
    const newTask = await dataSource.manager.findOneByOrFail(Project, {
      id: project.id,
    });
    assert.strictEqual(newTask.tasks.length, 1);
  });
});
