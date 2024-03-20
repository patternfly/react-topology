/* eslint-disable camelcase */
import { PipelineNodeModel, RunStatus } from '@patternfly/react-topology';

export const NODE_PADDING_VERTICAL = 15;
export const NODE_PADDING_HORIZONTAL = 15;

export const GROUP_PADDING_VERTICAL = 15;
export const GROUP_PADDING_HORIZONTAL = 25;

export const DEFAULT_TASK_WIDTH = 180;
export const DEFAULT_TASK_HEIGHT = 32;

export const createExecution2 = (): [string, PipelineNodeModel[]] => {
  const execution2: PipelineNodeModel = {
    id: 'execution-2',
    label: 'Execution 2',
    type: 'Execution',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [GROUP_PADDING_VERTICAL, GROUP_PADDING_HORIZONTAL]
    },
    group: true,
    runAfterTasks: [],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };

  const task_2_1: PipelineNodeModel = {
    id: 'task_2_1',
    label: 'Task 2-1',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };

  const task_2_2: PipelineNodeModel = {
    id: 'task_2_2',
    label: 'Task 2-2',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: ['task_2_1'],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };

  const task_2_3: PipelineNodeModel = {
    id: 'task_2_3',
    label: 'Task 2-3',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: ['task_2_1'],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };

  const task_2_4: PipelineNodeModel = {
    id: 'task_2_4',
    label: 'Task 2-4',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: ['task_2_1'],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  execution2.children = [task_2_1.id, task_2_2.id, task_2_3.id, task_2_4.id];

  const nodes: PipelineNodeModel[] = [execution2, task_2_1, task_2_2, task_2_3, task_2_4];

  return ['execution-2', nodes];
};

export const createExecution3 = (runAfter?: string): [string, PipelineNodeModel[]] => {
  const execution3: PipelineNodeModel = {
    id: 'execution-3',
    label: 'Execution 3',
    type: 'Execution',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [GROUP_PADDING_VERTICAL, GROUP_PADDING_HORIZONTAL]
    },
    group: true,
    runAfterTasks: runAfter ? [runAfter] : [],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };

  const task_3_1: PipelineNodeModel = {
    id: 'task_3_1',
    label: 'Task 3-1',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_3_2: PipelineNodeModel = {
    id: 'task_3_2',
    label: 'Task 3-2',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_3_1.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_3_3: PipelineNodeModel = {
    id: 'task_3_3',
    label: 'Task 3-3',
    type: 'Execution',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    group: true,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_3_1.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_3_4: PipelineNodeModel = {
    id: 'task_3_4',
    label: 'Task 3-4',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_3_1.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_3_5: PipelineNodeModel = {
    id: 'task_3_5',
    label: 'Task 3-5',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_3_4.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_3_6: PipelineNodeModel = {
    id: 'task_3_6',
    label: 'Task 3-6',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_3_4.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_3_7: PipelineNodeModel = {
    id: 'task_3_7',
    label: 'Task 3-7',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_3_5.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_3_8: PipelineNodeModel = {
    id: 'task_3_8',
    label: 'Task 3-8',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_3_2.id, task_3_7.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };

  const task_3_3_1: PipelineNodeModel = {
    id: 'task_3_3_1',
    label: 'Task 3-3-1',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_3_3_2: PipelineNodeModel = {
    id: 'task_3_3_2',
    label: 'Task 3-3-2',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    runAfterTasks: [task_3_3_1.id],
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_3_3_3: PipelineNodeModel = {
    id: 'task_3_3_3',
    label: 'Task 3-3-3',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_3_3_1.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_3_3_4: PipelineNodeModel = {
    id: 'task_3_3_4',
    label: 'Task 3-3-4',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    runAfterTasks: [task_3_3_3.id],
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  task_3_3.children = [task_3_3_1.id, task_3_3_2.id, task_3_3_3.id, task_3_3_4.id];

  execution3.children = [
    task_3_1.id,
    task_3_2.id,
    task_3_3.id,
    task_3_4.id,
    task_3_5.id,
    task_3_6.id,
    task_3_7.id,
    task_3_8.id
  ];

  const nodes: PipelineNodeModel[] = [
    execution3,
    task_3_1,
    task_3_2,
    task_3_3,
    task_3_4,
    task_3_5,
    task_3_6,
    task_3_7,
    task_3_8,
    task_3_3_1,
    task_3_3_2,
    task_3_3_3,
    task_3_3_4
  ];

  return ['execution-3', nodes];
};

export const createDemoPipelineGroupsNodes = (): PipelineNodeModel[] => {
  const nodes: PipelineNodeModel[] = [];

  const execution1: PipelineNodeModel = {
    id: 'execution-1',
    label: 'Execution 1',
    type: 'Execution',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [GROUP_PADDING_VERTICAL, GROUP_PADDING_HORIZONTAL]
    },
    group: true,
    children: [],
    runAfterTasks: [],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  nodes.push(execution1);

  const [execution2Id, execution2Nodes] = createExecution2();
  execution1.children.push(execution2Id);
  nodes.push(...execution2Nodes);

  const task_1_1: PipelineNodeModel = {
    id: 'task_1_1',
    label: 'Task 1-1',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [execution2Id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_1_2: PipelineNodeModel = {
    id: 'task_1_2',
    label: 'Task 1-2',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_1_1.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_1_3: PipelineNodeModel = {
    id: 'task_1_3',
    label: 'Task 1-3',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_1_1.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_1_4: PipelineNodeModel = {
    id: 'task_1_4',
    label: 'Task 1-4',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_1_3.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  nodes.push(task_1_1, task_1_2, task_1_3, task_1_4);
  execution1.children.push(task_1_1.id, task_1_2.id, task_1_3.id, task_1_4.id);

  const [execution3Id, execution3Nodes] = createExecution3(execution2Id);
  execution1.children.push(execution3Id);
  nodes.push(...execution3Nodes);

  const task_1: PipelineNodeModel = {
    id: 'task_1',
    label: 'Task 1',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [execution1.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_2: PipelineNodeModel = {
    id: 'task_2',
    label: 'Task 2',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [execution1.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_3: PipelineNodeModel = {
    id: 'task_3',
    label: 'Task 3',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [execution1.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_4: PipelineNodeModel = {
    id: 'task_4',
    label: 'Task 4',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_3.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_5: PipelineNodeModel = {
    id: 'task_5',
    label: 'Task 5',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_3.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  const task_6: PipelineNodeModel = {
    id: 'task_6',
    label: 'Task 6',
    type: 'Task',
    width: DEFAULT_TASK_WIDTH,
    height: DEFAULT_TASK_HEIGHT,
    style: {
      padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL]
    },
    runAfterTasks: [task_4.id],
    data: {
      status: RunStatus.Succeeded,
      isDependency: true
    }
  };
  nodes.push(task_1, task_2, task_3, task_4, task_5, task_6);

  return nodes;
};
