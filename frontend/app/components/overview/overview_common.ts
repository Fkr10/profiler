import {ElementRef, OnDestroy} from '@angular/core';
import {ErrorMessageTableOrNull, GeneralAnalysisOrNull, InputPipelineAnalysisOrNull, NormalizedAcceleratorPerformanceOrNull, OverviewDataTuple, RecommendationResultOrNull, RunEnvironmentOrNull} from 'org_xprof/frontend/app/common/interfaces/data_table';

const GENERAL_ANALYSIS_INDEX = 0;
const INPUT_PIPELINE_ANALYSIS_INDEX = 1;
const RUN_ENVIRONMENT_INDEX = 2;
const RECOMMENDATION_RESULT_INDEX = 3;
const NORMALIZED_ACCELERATOR_PERFORMANCE_INDEX = 5;
const ERROR_INDEX = 6;

/** A common class of overview page component. */
export class OverviewCommon implements OnDestroy {
  errors: string[] = [];
  generalAnalysis: GeneralAnalysisOrNull = null;
  inputPipelineAnalysis: InputPipelineAnalysisOrNull = null;
  recommendationResult: RecommendationResultOrNull = null;
  runEnvironment: RunEnvironmentOrNull = null;
  normalizedAcceleratorPerformance: NormalizedAcceleratorPerformanceOrNull =
      null;
  statement = '';
  timer = 0;

  constructor(readonly elementRef: ElementRef) {}

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  errorMessageTableToArray(errorData: ErrorMessageTableOrNull): string[] {
    if (!errorData || !errorData.rows || !errorData.rows.length) return [];
    /** Convert data to string arrays */
    return errorData.rows.map(row => String(row.c![0].v!));
  }

  parseOverviewData(data: OverviewDataTuple) {
    this.generalAnalysis = data[GENERAL_ANALYSIS_INDEX];
    this.inputPipelineAnalysis = data[INPUT_PIPELINE_ANALYSIS_INDEX];
    this.runEnvironment = data[RUN_ENVIRONMENT_INDEX];
    this.recommendationResult = data[RECOMMENDATION_RESULT_INDEX];
    this.normalizedAcceleratorPerformance =
        data[NORMALIZED_ACCELERATOR_PERFORMANCE_INDEX];
    this.errors = this.errorMessageTableToArray(data[ERROR_INDEX]);
  }

  updateStyle() {
    if (!this.elementRef) {
      this.timer = setTimeout(() => {
        this.updateStyle();
      }, 100);
      return;
    }

    let color = 'green';
    if (this.statement.includes('HIGHLY')) {
      color = 'red';
    } else if (this.statement.includes('MODERATE')) {
      color = 'orange';
    }
    if (this.elementRef.nativeElement) {
      this.elementRef.nativeElement.style.setProperty('--summary-color', color);
    }
  }
}
