/* eslint-disable camelcase */
import { PipelineNodeModel, RunStatus } from '@patternfly/react-topology';

export const NODE_PADDING_VERTICAL = 0;
export const NODE_PADDING_HORIZONTAL = 15;

export const GROUP_PADDING_VERTICAL = 40;
export const GROUP_PADDING_HORIZONTAL = 25;

export const DEFAULT_TASK_WIDTH = 210;
export const DEFAULT_TASK_HEIGHT = 32;
export const GROUP_TASK_WIDTH = 210;

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

export const createComplexDemoPipelineGroupsNodes = (): PipelineNodeModel[] => (
  [
    {
      id: 'automl-tabular-finalizer',
      label: 'automl-tabular-finalizer',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['exit-handler-1'],
      data: {},
    },
    {
      id: 'feature-attribution-2-feature_attributions',
      label: 'feature-attribution-2-feature_attributions (Type: Metrics)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['exit-handler-1'],
      data: {},
    },
    {
      id: 'feature-attribution-feature_attributions',
      label: 'feature-attribution-feature_attributions (Type: Metrics)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['exit-handler-1'],
      data: {},
    },
    {
      id: 'exit-handler-1',
      label: 'exit-handler-1',
      type: 'EXECUTION_TASK_NODE',
      group: true,
      collapsed: true,
      width: GROUP_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['set-optional-inputs'],
      children: [
        'condition-2',
        'condition-4',
        'dataset_stats',
        'feature_ranking',
        'instance_schema',
        'materialized_data',
        'training_schema',
        'transform_output',
        'feature-transform-engine',
        'materialized_eval_split',
        'materialized_test_split',
        'materialized_train_split',
        'split-materialized-data',
        'string-not-empty',
        'instance_baseline',
        'metadata',
        'training-configurator-and-validator',
      ],
      style: { padding: [15, 15] },
      data: {},
    },
    {
      id: 'condition-2',
      label: 'stage_1_tuning_result_artifact_uri_not_empty',
      type: 'EXECUTION_TASK_NODE',
      group: true,
      collapsed: true,
      width: GROUP_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [
        'feature-transform-engine',
        'split-materialized-data',
        'string-not-empty',
        'training-configurator-and-validator',
      ],
      children: [
        'example_instance',
        'explanation_metadata_artifact',
        'model_architecture',
        'unmanaged_container_model',
        'automl-forecasting-ensemble',
        'tuning_result_output',
        'automl-forecasting-stage-2-tuner',
        'calculate-training-parameters',
        'condition-3',
        'get-or-create-model-description',
        'get-prediction-image-uri',
        'artifact',
        'importer',
        'model',
        'model-upload',
      ],
      style: { padding: [15, 15] },
      data: {},
    },
    {
      id: 'example_instance',
      label: 'example_instance (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['automl-forecasting-ensemble'],
      data: {},
    },
    {
      id: 'explanation_metadata_artifact',
      label: 'explanation_metadata_artifact (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['automl-forecasting-ensemble'],
      data: {},
    },
    {
      id: 'model_architecture',
      label: 'model_architecture (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['automl-forecasting-ensemble'],
      data: {},
    },
    {
      id: 'unmanaged_container_model',
      label: 'unmanaged_container_model (Type: UnmanagedContainerModel)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['automl-forecasting-ensemble'],
      data: {},
    },
    {
      id: 'automl-forecasting-ensemble',
      label: 'automl-forecasting-ensemble',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['automl-forecasting-stage-2-tuner', 'get-prediction-image-uri'],
      data: {},
    },
    {
      id: 'tuning_result_output',
      label: 'tuning_result_output (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['automl-forecasting-stage-2-tuner'],
      data: {},
    },
    {
      id: 'automl-forecasting-stage-2-tuner',
      label: 'automl-forecasting-stage-2-tuner',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['calculate-training-parameters', 'importer'],
      data: {},
    },
    {
      id: 'calculate-training-parameters',
      label: 'calculate-training-parameters',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'condition-3',
      label: 'should_run_model_evaluation',
      type: 'EXECUTION_TASK_NODE',
      group: true,
      collapsed: true,
      width: GROUP_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['automl-forecasting-ensemble', 'model-upload'],
      children: [
        'feature_attributions',
        'feature-attribution',
        'finalize-eval-quantile-parameters',
        'get-predictions-column',
        'batchpredictionjob',
        'bigquery_output_table',
        'gcs_output_directory',
        'model-batch-explanation',
        'model-batch-predict',
        'evaluation_metrics',
        'model-evaluation-forecasting',
        'model-evaluation-import',
        'table-to-uri',
      ],
      style: { padding: [15, 15] },
      data: {},
    },
    {
      id: 'feature_attributions',
      label: 'feature_attributions (Type: Metrics)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['feature-attribution'],
      data: {},
    },
    {
      id: 'feature-attribution',
      label: 'feature-attribution',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['model-batch-explanation'],
      data: {},
    },
    {
      id: 'finalize-eval-quantile-parameters',
      label: 'finalize-eval-quantile-parameters',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'get-predictions-column',
      label: 'get-predictions-column',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['finalize-eval-quantile-parameters'],
      data: {},
    },
    {
      id: 'batchpredictionjob',
      label: 'batchpredictionjob (Type: VertexBatchPredictionJob)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['model-batch-explanation'],
      data: {},
    },
    {
      id: 'bigquery_output_table',
      label: 'bigquery_output_table (Type: BQTable)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['model-batch-explanation'],
      data: {},
    },
    {
      id: 'gcs_output_directory',
      label: 'gcs_output_directory (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['model-batch-explanation'],
      data: {},
    },
    {
      id: 'model-batch-explanation',
      label: 'model-batch-explanation',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'batchpredictionjob',
      label: 'batchpredictionjob (Type: VertexBatchPredictionJob)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['model-batch-predict'],
      data: {},
    },
    {
      id: 'bigquery_output_table',
      label: 'bigquery_output_table (Type: BQTable)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['model-batch-predict'],
      data: {},
    },
    {
      id: 'gcs_output_directory',
      label: 'gcs_output_directory (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['model-batch-predict'],
      data: {},
    },
    {
      id: 'model-batch-predict',
      label: 'model-batch-predict',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'evaluation_metrics',
      label: 'evaluation_metrics (Type: ForecastingMetrics)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['model-evaluation-forecasting'],
      data: {},
    },
    {
      id: 'model-evaluation-forecasting',
      label: 'model-evaluation-forecasting',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [
        'finalize-eval-quantile-parameters',
        'get-predictions-column',
        'model-batch-predict',
        'table-to-uri',
      ],
      data: {},
    },
    {
      id: 'model-evaluation-import',
      label: 'model-evaluation-import',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['feature-attribution', 'model-evaluation-forecasting'],
      data: {},
    },
    {
      id: 'table-to-uri',
      label: 'table-to-uri',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['model-batch-predict'],
      data: {},
    },
    {
      id: 'get-or-create-model-description',
      label: 'get-or-create-model-description',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'get-prediction-image-uri',
      label: 'get-prediction-image-uri',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'artifact',
      label: 'artifact (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['importer'],
      data: {},
    },
    {
      id: 'importer',
      label: 'get-hyperparameter-tuning-results',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'model',
      label: 'model (Type: VertexModel)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['model-upload'],
      data: {},
    },
    {
      id: 'model-upload',
      label: 'model-upload',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['automl-forecasting-ensemble', 'get-or-create-model-description'],
      data: {},
    },
    {
      id: 'condition-4',
      label: 'stage_1_tuning_result_artifact_uri_empty',
      type: 'EXECUTION_TASK_NODE',
      group: true,
      collapsed: true,
      width: GROUP_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [
        'feature-transform-engine',
        'split-materialized-data',
        'string-not-empty',
        'training-configurator-and-validator',
      ],
      children: [
        'automl-forecasting-ensemble-2',
        'automl-forecasting-stage-1-tuner',
        'calculate-training-parameters-2',
        'condition-5',
        'get-or-create-model-description-2',
        'get-prediction-image-uri-2',
        'model-upload-2',
      ],
      style: { padding: [15, 15] },
      data: {},
    },
    {
      id: 'automl-forecasting-ensemble-2',
      label: 'automl-forecasting-ensemble-2',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['automl-forecasting-stage-1-tuner', 'get-prediction-image-uri-2'],
      data: {},
    },
    {
      id: 'automl-forecasting-stage-1-tuner',
      label: 'automl-forecasting-stage-1-tuner',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['calculate-training-parameters-2'],
      data: {},
    },
    {
      id: 'calculate-training-parameters-2',
      label: 'calculate-training-parameters-2',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'condition-5',
      label: 'should_run_model_evaluation',
      type: 'EXECUTION_TASK_NODE',
      group: true,
      collapsed: true,
      width: GROUP_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['automl-forecasting-ensemble-2', 'model-upload-2'],
      children: [
        'feature-attribution-2',
        'finalize-eval-quantile-parameters-2',
        'get-predictions-column-2',
        'model-batch-explanation-2',
        'model-batch-predict-2',
        'model-evaluation-forecasting-2',
        'model-evaluation-import-2',
        'table-to-uri-2',
      ],
      style: { padding: [15, 15] },
      data: {},
    },
    {
      id: 'feature-attribution-2',
      label: 'feature-attribution-2',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['model-batch-explanation-2'],
      data: {},
    },
    {
      id: 'finalize-eval-quantile-parameters-2',
      label: 'finalize-eval-quantile-parameters-2',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'get-predictions-column-2',
      label: 'get-predictions-column-2',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['finalize-eval-quantile-parameters-2'],
      data: {},
    },
    {
      id: 'model-batch-explanation-2',
      label: 'model-batch-explanation-2',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'model-batch-predict-2',
      label: 'model-batch-predict-2',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'model-evaluation-forecasting-2',
      label: 'model-evaluation-forecasting-2',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [
        'finalize-eval-quantile-parameters-2',
        'get-predictions-column-2',
        'model-batch-predict-2',
        'table-to-uri-2',
      ],
      data: {},
    },
    {
      id: 'model-evaluation-import-2',
      label: 'model-evaluation-import-2',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['feature-attribution-2', 'model-evaluation-forecasting-2'],
      data: {},
    },
    {
      id: 'table-to-uri-2',
      label: 'table-to-uri-2',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['model-batch-predict-2'],
      data: {},
    },
    {
      id: 'get-or-create-model-description-2',
      label: 'get-or-create-model-description-2',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'get-prediction-image-uri-2',
      label: 'get-prediction-image-uri-2',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'model-upload-2',
      label: 'model-upload-2',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['automl-forecasting-ensemble-2', 'get-or-create-model-description-2'],
      data: {},
    },
    {
      id: 'dataset_stats',
      label: 'dataset_stats (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['feature-transform-engine'],
      data: {},
    },
    {
      id: 'feature_ranking',
      label: 'feature_ranking (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['feature-transform-engine'],
      data: {},
    },
    {
      id: 'instance_schema',
      label: 'instance_schema (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['feature-transform-engine'],
      data: {},
    },
    {
      id: 'materialized_data',
      label: 'materialized_data (Type: Dataset)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['feature-transform-engine'],
      data: {},
    },
    {
      id: 'training_schema',
      label: 'training_schema (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['feature-transform-engine'],
      data: {},
    },
    {
      id: 'transform_output',
      label: 'transform_output (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['feature-transform-engine'],
      data: {},
    },
    {
      id: 'feature-transform-engine',
      label: 'feature-transform-engine',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'materialized_eval_split',
      label: 'materialized_eval_split (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['split-materialized-data'],
      data: {},
    },
    {
      id: 'materialized_test_split',
      label: 'materialized_test_split (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['split-materialized-data'],
      data: {},
    },
    {
      id: 'materialized_train_split',
      label: 'materialized_train_split (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['split-materialized-data'],
      data: {},
    },
    {
      id: 'split-materialized-data',
      label: 'split-materialized-data',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['feature-transform-engine'],
      data: {},
    },
    {
      id: 'string-not-empty',
      label: 'check-if-hyperparameter-tuning-results-are-supplied-by-user',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
    {
      id: 'instance_baseline',
      label: 'instance_baseline (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['training-configurator-and-validator'],
      data: {},
    },
    {
      id: 'metadata',
      label: 'metadata (Type: Artifact)',
      type: 'ICON_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['training-configurator-and-validator'],
      data: {},
    },
    {
      id: 'training-configurator-and-validator',
      label: 'training-configurator-and-validator',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: ['feature-transform-engine'],
      data: {},
    },
    {
      id: 'set-optional-inputs',
      label: 'set-optional-inputs',
      type: 'DEFAULT_TASK_NODE',
      width: DEFAULT_TASK_WIDTH,
      height: DEFAULT_TASK_HEIGHT,
      runAfterTasks: [],
      data: {},
    },
  ]
);

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
