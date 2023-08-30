import { describe, test } from "node:test";
import assert from "node:assert";
import { Project, ProjectStatus, Task } from "../../entities";

describe("Project Entity", function () {
  describe("constructor", function () {
    test("should create a project", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: new Date(),
        cancelled_at: null,
        finished_at: null,
        forecasted_at: null,
      };
      const project = new Project(props);
      assert.strictEqual(project.name, "test");
      assert.strictEqual(project.description, "test");
      assert.strictEqual(project.started_at, props.started_at);
      assert.strictEqual(project.cancelled_at, null);
      assert.strictEqual(project.finished_at, null);
      assert.strictEqual(project.forecasted_at, null);
      assert.ok(project.id.length);
    });
  });

  describe("create", function () {
    test("should create a project", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      
      let project = Project.create(props);
      
      assert.strictEqual(project.name, "test");
      assert.strictEqual(project.description, "test");
      assert.strictEqual(project.started_at, props.started_at);
      assert.strictEqual(project.cancelled_at, null);
      assert.strictEqual(project.finished_at, null);
      assert.strictEqual(project.forecasted_at, null);
      assert.strictEqual(project.status, ProjectStatus.Pending);
      assert.ok(project.id.length);

      project = Project.create({
        ...props,
        started_at: new Date(),
      });

      assert.strictEqual(project.status, ProjectStatus.Active);
    });
  });

  describe("changeName", function () {
    test("should change the name of the project", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: new Date(),
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.changeName("new name");
      assert.strictEqual(project.name, "new name");
    });
  });

  describe("changeDescription", function () {
    test("should change the description of the project", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: new Date(),
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.changeDescription("new description");
      assert.strictEqual(project.description, "new description");
    });
  });

  describe("changeForecastedDate", function () {
    test("should change the forecasted date of the project", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: new Date(),
        forecasted_at: null,
      };
      const project = Project.create(props);
      const date = new Date();
      project.changeForecastedDate(date);
      assert.strictEqual(project.forecasted_at, date);
    });
  });

  describe("start", function () {
    test("should start the project", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      const started_at = new Date();
      project.start(started_at);
      assert.strictEqual(project.status, ProjectStatus.Active);
      assert.strictEqual(project.started_at, started_at);
    });

    test("should throw an error if the project is already active", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: new Date(),
        forecasted_at: null,
      };
      const project = Project.create(props);
      assert.throws(() => project.start(new Date()), /Cannot start active project$/);
    });

    test("should throw an error if the project is already completed", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.complete(new Date());
      assert.throws(() => project.start(new Date()), /Cannot start completed project$/);
    });

    test("should throw an error if the project is already cancelled", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.cancel(new Date());
      assert.throws(() => project.start(new Date()), /Cannot start cancelled project$/);
    });
  });

  describe("cancel", function () {
    test("should cancel the project", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      const cancelled_at = new Date();
      project.cancel(cancelled_at);
      assert.strictEqual(project.status, ProjectStatus.Cancelled);
      assert.strictEqual(project.cancelled_at, cancelled_at);
    });

    test("should throw an error if the project is already completed", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.complete(new Date());
      assert.throws(() => project.cancel(new Date()), /Cannot cancel completed project$/);
    });

    test("should throw an error if the project is already cancelled", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.cancel(new Date());
      assert.throws(() => project.cancel(new Date()), /Cannot cancel cancelled project$/);
    });
  });

  describe("complete", function () {
    test("should complete the project", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      const finished_at = new Date();
      project.complete(finished_at);
      assert.strictEqual(project.status, ProjectStatus.Completed);
      assert.strictEqual(project.finished_at, finished_at);
    });

    test("should throw an error if the project is already completed", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
        finished_at: new Date(),
      };
      const project = Project.create(props);
      project.complete(new Date());
      assert.throws(
        () => project.complete(new Date()),
        /Cannot complete completed project$/
      );
    });

    test("should throw an error if the project is already cancelled", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
        cancelled_at: new Date(),
      };
      const project = Project.create(props);
      project.cancel(new Date());
      assert.throws(
        () => project.complete(new Date()),
        /Cannot complete cancelled project$/
      );
    });
  });

  describe("addTask", function () {
    test("should add a task to the project", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
        cancelled_at: null,
        finished_at: null,
      };
      const project = Project.create(props);
      const task = Task.create({
        name: "test",
        description: "test",
        started_at: new Date(),
        forecasted_at: null,
        finished_at: null,
      });
      project.addTask(task);
      assert.strictEqual(project.status, ProjectStatus.Active);
      assert.strictEqual(project.tasks.length, 1);
      assert.strictEqual(project.tasks[0], task);
    });

    test("should throw an error if the project is completed", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
        cancelled_at: null,
        finished_at: new Date(),
      };
      const project = Project.create(props);
      project.complete(new Date());
      const task = Task.create({
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
        finished_at: null,
      });
      assert.throws(
        () => project.addTask(task),
        /Cannot add task to completed project$/
      );
    });

    test("should throw an error if the project is cancelled", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
        cancelled_at: new Date(),
        finished_at: null,
      };
      const project = Project.create(props);
      project.cancel(new Date());
      const task = Task.create({
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
        finished_at: null,
      });
      assert.throws(
        () => project.addTask(task),
        /Cannot add task to cancelled project$/
      );
    });
  });
});
