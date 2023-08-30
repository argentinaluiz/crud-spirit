import crypto from "crypto";
import { Column, PrimaryColumn } from "typeorm";

export enum ProjectStatus {
  Pending = "pending",
  Active = "active",
  Cancelled = "cancelled",
  Completed = "completed",
}

export class Project {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  started_at: Date | null = null;

  @Column({ nullable: true })
  cancelled_at: Date | null = null;

  @Column({ nullable: true })
  finished_at: Date | null = null;

  @Column({ nullable: true })
  forecasted_at: Date | null = null;

  @Column()
  status: ProjectStatus = ProjectStatus.Pending;

  tasks: Task[] = [];

  constructor(
    props: {
      name: string;
      description: string;
      started_at?: Date | null;
      cancelled_at?: Date | null;
      finished_at?: Date | null;
      forecasted_at?: Date | null;
    },
    id?: string
  ) {
    Object.assign(this, props);
    this.id = id ?? crypto.randomUUID();
  }

  static create(props: {
    name: string;
    description: string;
    started_at?: Date| null;
    forecasted_at?: Date | null;
  }) {
    return new Project(props);
  }

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string) {
    this.description = description;
  }

  changeForecastedDate(date: Date) {
    this.forecasted_at = date;
  }

  start() {
    if (this.status === ProjectStatus.Active) {
      throw new Error("Cannot start active project");
    }

    if (this.status === ProjectStatus.Completed) {
      throw new Error("Cannot start completed project");
    }

    if (this.status === ProjectStatus.Cancelled) {
      throw new Error("Cannot start cancelled project");
    }

    this.started_at = new Date();
    this.status = ProjectStatus.Active;
  }

  cancel() {
    if (this.status === ProjectStatus.Completed) {
      throw new Error("Cannot cancel completed project");
    }

    if (this.status === ProjectStatus.Cancelled) {
      throw new Error("Cannot cancel cancelled project");
    }

    if (this.status === ProjectStatus.Active) {
      throw new Error("Cannot cancel active project");
    }

    this.cancelled_at = new Date();
    this.status = ProjectStatus.Cancelled;

    this.tasks.forEach((task) => task.cancel());
  }

  complete() {
    if (this.status === ProjectStatus.Completed) {
      throw new Error("Cannot complete completed project");
    }

    if (this.status === ProjectStatus.Cancelled) {
      throw new Error("Cannot complete cancelled project");
    }

    this.finished_at = new Date();
    this.status = ProjectStatus.Completed;

    const pendingOrActiveTasks = this.tasks.filter(
      (task) => task.status === TaskStatus.Pending || task.status === TaskStatus.Active
    );

    if(pendingOrActiveTasks.length > 0) {
      throw new Error("Cannot complete project with pending or active tasks");
    }
  }

  addTask(task: Task) {
    if (this.status === ProjectStatus.Completed) {
      throw new Error("Cannot add task to completed project");
    }

    if (this.status === ProjectStatus.Cancelled) {
      throw new Error("Cannot add task to cancelled project");
    }

    if (task.started_at && this.started_at && task.started_at < this.started_at) {
      throw new Error("Cannot add task to project before project started");
    }

    this.tasks.push(task);
  }
}

export enum TaskStatus {
  Pending = "pending",
  Active = "active",
  Cancelled = "cancelled",
  Completed = "completed",
}

export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  started_at: Date | null = null;

  @Column({ nullable: true })
  cancelled_at: Date | null = null;

  @Column({ nullable: true })
  finished_at: Date | null = null;

  @Column({ nullable: true })
  forecasted_at: Date | null = null;

  @Column()
  status = TaskStatus.Pending;

  constructor(
    props: {
      name: string;
      description: string;
      started_at: Date | null;
      cancelled_at?: Date | null;
      finished_at?: Date | null;
      forecasted_at?: Date | null;
    },
    id?: string
  ) {
    Object.assign(this, props);
    this.id = id ?? crypto.randomUUID();
  }

  static create(props: {
    name: string;
    description: string;
    started_at: Date | null;
    finished_at?: Date | null;
    forecasted_at?: Date | null;
  }) {
    return new Task(props);
  }

  start() {
    if (this.status === TaskStatus.Active) {
      throw new Error("Cannot start active task");
    }

    if (this.status === TaskStatus.Completed) {
      throw new Error("Cannot start completed task");
    }

    if (this.status === TaskStatus.Cancelled) {
      throw new Error("Cannot start cancelled task");
    }

    this.started_at = new Date();
    this.status = TaskStatus.Active;
  }

  cancel() {
    if (this.status === TaskStatus.Completed) {
      throw new Error("Cannot cancel completed task");
    }

    if (this.status === TaskStatus.Cancelled) {
      throw new Error("Cannot cancel cancelled task");
    }

    this.cancelled_at = new Date();
    this.status = TaskStatus.Cancelled;
  }

  complete() {
    if (this.status === TaskStatus.Completed) {
      throw new Error("Cannot complete completed task");
    }

    if (this.status === TaskStatus.Cancelled) {
      throw new Error("Cannot complete cancelled task");
    }

    this.finished_at = new Date();
    this.status = TaskStatus.Completed;
  }

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string) {
    this.description = description;
  }

  changeForecastedDate(date: Date) {
    this.forecasted_at = date;
  }
}
