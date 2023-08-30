import { Task, TaskStatus } from "../../entities";
import { describe, test } from "node:test";
import assert from "node:assert";

describe("Task Entity", () => {
  const props = {
    name: "Test Task",
    description: "This is a test task",
    started_at: null,
    cancelled_at: null,
    finished_at: null,
    forecasted_at: null,
  };
  describe("constructor", () => {
    test("should create a task with the provided properties and a unique ID", () => {
      const task = new Task(props);
      assert.strictEqual(task.name, props.name);
      assert.strictEqual(task.description, props.description);
      assert.strictEqual(task.started_at, props.started_at);
      assert.strictEqual(task.cancelled_at, props.cancelled_at);
      assert.strictEqual(task.finished_at, props.finished_at);
      assert.strictEqual(task.forecasted_at, props.forecasted_at);
      assert.strictEqual(task.status, TaskStatus.Pending);
      assert.ok(task.id);
    });

    test("should create a task with the provided ID", () => {
      const id = "test-id";
      const task = new Task(props, id);
      assert.strictEqual(task.name, props.name);
      assert.strictEqual(task.description, props.description);
      assert.strictEqual(task.started_at, props.started_at);
      assert.strictEqual(task.cancelled_at, props.cancelled_at);
      assert.strictEqual(task.finished_at, props.finished_at);
      assert.strictEqual(task.forecasted_at, props.forecasted_at);
      assert.strictEqual(task.status, TaskStatus.Pending);
      assert.strictEqual(task.id, id);
    });
  });

  describe("create", () => {
    test("should create a task with the provided properties and a unique ID", () => {
      const props = {
        name: "Test Task",
        description: "This is a test task",
        started_at: new Date(),
        finished_at: null,
        forecasted_at: null,
      };
      const task = Task.create({
        ...props,
        started_at: null
      });
      assert.strictEqual(task.name, props.name);
      assert.strictEqual(task.description, props.description);
      assert.strictEqual(task.started_at, null);
      assert.strictEqual(task.finished_at, props.finished_at);
      assert.strictEqual(task.forecasted_at, props.forecasted_at);
      assert.strictEqual(task.status, TaskStatus.Pending);
      assert.ok(task.id);

      const startedTask = Task.create({
        ...props,
        started_at: new Date(),
      });
      assert.strictEqual(startedTask.status, TaskStatus.Active);
    });
  });

  test("should start a task", () => {
    const task = new Task(props);
    const started_at = new Date();
    task.start(started_at);
    assert.ok(task.started_at);
    assert.strictEqual(task.status, TaskStatus.Active);
  });

  test("should not start an active task", () => {
    const task = new Task(props);
    task.start(new Date());
    assert.throws(() => task.start(new Date()), "/Cannot start active task$/");
  });

  test("should not start a completed task", () => {
    const task = new Task(props);
    task.complete(new Date());
    assert.throws(() => task.start(new Date()), "/Cannot start completed task/");
  });

  test("should not start a cancelled task", () => {
    const task = new Task(props);
    task.cancel(new Date());
    assert.throws(() => task.start(new Date()), "/Cannot start cancelled task/");
  });

  test("should cancel a task", () => {
    const task = new Task(props);
    task.cancel(new Date());
    assert.ok(task.cancelled_at);
    assert.strictEqual(task.status, "cancelled");
  });

  test("should not cancel a completed task", () => {
    const task = new Task(props);
    task.complete(new Date());
    assert.throws(() => task.cancel(new Date()), "/Cannot cancel completed task/");
  });

  test("should not cancel a cancelled task", () => {
    const task = new Task(props);
    task.cancel(new Date());
    assert.throws(() => task.cancel(new Date()), "/Cannot cancel cancelled task/");
  });

  test("should complete a task", () => {
    const task = new Task(props);
    const finished_at = new Date();
    task.complete(finished_at);
    assert.strictEqual(task.finished_at, finished_at);
    assert.strictEqual(task.status, TaskStatus.Completed);
  });

  test("should not complete a completed task", () => {
    const task = new Task(props);
    task.complete(new Date());
    assert.throws(() => task.complete(new Date()), "/Cannot complete completed task/");
  });

  test("should not complete a cancelled task", () => {
    const task = new Task(props);
    task.cancel(new Date());
    assert.throws(() => task.complete(new Date()), "/Cannot complete cancelled task/");
  });

  test("should change the name of a task", () => {
    const task = new Task(props);
    const newName = "New Test Task";
    task.changeName(newName);
    assert.strictEqual(task.name, newName);
  });

  test("should change the description of a task", () => {
    const task = new Task(props);
    const newDescription = "This is a new test task";
    task.changeDescription(newDescription);
    assert.strictEqual(task.description, newDescription);
  });

  test("should change the forecasted date of a task", () => {
    const task = new Task(props);
    const newForecastedDate = new Date();
    task.changeForecastedDate(newForecastedDate);
    assert.strictEqual(task.forecasted_at, newForecastedDate);
  });
});
