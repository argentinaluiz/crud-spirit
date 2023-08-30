import { describe, it } from "node:test";
import assert from "node:assert";
import { Project, ProjectStatus, Task } from "../entities";

describe("Project Entity", function () {
  describe("constructor", function () {
    it("should create a project", function () {
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
    it("should create a project", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: new Date(),
        forecasted_at: null,
      };
      const project = Project.create(props);
      assert.strictEqual(project.name, "test");
      assert.strictEqual(project.description, "test");
      assert.strictEqual(project.started_at, props.started_at);
      assert.strictEqual(project.cancelled_at, null);
      assert.strictEqual(project.finished_at, null);
      assert.strictEqual(project.forecasted_at, null);
      assert.ok(project.id.length);
    });
  });

  describe("changeName", function () {
    it("should change the name of the project", function () {
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
    it("should change the description of the project", function () {
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
    it("should change the forecasted date of the project", function () {
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
    it("should start the project", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.start();
      assert.strictEqual(project.status, ProjectStatus.Active);
      assert.ok(project.started_at);
    });

    it("should throw an error if the project is already active", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: new Date(),
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.start();
      assert.throws(() => project.start(), /Cannot start active project$/);
    });

    it("should throw an error if the project is already completed", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.complete();
      assert.throws(() => project.start(), /Cannot start completed project$/);
    });

    it("should throw an error if the project is already cancelled", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.cancel();
      assert.throws(() => project.start(), /Cannot start cancelled project$/);
    });
  });

  describe("cancel", function () {
    it("should cancel the project", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.cancel();
      assert.strictEqual(project.status, ProjectStatus.Cancelled);
      assert.ok(project.cancelled_at);
    });

    it("should throw an error if the project is already completed", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.complete();
      assert.throws(() => project.cancel(), /Cannot cancel completed project$/);
    });

    it("should throw an error if the project is already cancelled", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.cancel();
      assert.throws(() => project.cancel(), /Cannot cancel cancelled project$/);
    });

    it("should throw an error if the project is already active", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.start();
      assert.throws(() => project.cancel(), /Cannot cancel active project$/);
    });
  });

  describe("complete", function () {
    it("should complete the project", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
      };
      const project = Project.create(props);
      project.complete();
      assert.strictEqual(project.status, ProjectStatus.Completed);
      assert.ok(project.finished_at);
    });

    it("should throw an error if the project is already completed", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
        finished_at: new Date(),
      };
      const project = Project.create(props);
      project.complete();
      assert.throws(
        () => project.complete(),
        /Cannot complete completed project$/
      );
    });

    it("should throw an error if the project is already cancelled", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
        cancelled_at: new Date(),
      };
      const project = Project.create(props);
      project.cancel();
      assert.throws(
        () => project.complete(),
        /Cannot complete cancelled project$/
      );
    });
  });

  describe("addTask", function () {
    it("should add a task to the project", function () {
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
        started_at: null,
        forecasted_at: null,
        finished_at: null,
      });
      project.addTask(task);
      assert.strictEqual(project.tasks.length, 1);
      assert.strictEqual(project.tasks[0], task);
    });

    it("should throw an error if the project is completed", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
        cancelled_at: null,
        finished_at: new Date(),
      };
      const project = Project.create(props);
      project.complete();
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

    it("should throw an error if the project is cancelled", function () {
      const props = {
        name: "test",
        description: "test",
        started_at: null,
        forecasted_at: null,
        cancelled_at: new Date(),
        finished_at: null,
      };
      const project = Project.create(props);
      project.cancel();
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
