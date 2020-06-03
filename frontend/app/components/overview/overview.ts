import {Component, ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {OverviewDataTuple} from 'org_xprof/frontend/app/common/interfaces/data_table';
import {NavigationEvent} from 'org_xprof/frontend/app/common/interfaces/navigation_event';
import {DataService} from 'org_xprof/frontend/app/services/data_service/data_service';
import {setLoadingStateAction} from 'org_xprof/frontend/app/store/actions';

import {OverviewCommon} from './overview_common';

/** An overview page component. */
@Component({
  selector: 'overview',
  templateUrl: './overview.ng.html',
  styleUrls: ['./overview.css']
})
export class Overview extends OverviewCommon {
  constructor(
      route: ActivatedRoute, private readonly dataService: DataService,
      private readonly store: Store<{}>, readonly elementRef: ElementRef) {
    super(elementRef);
    route.params.subscribe(params => {
      this.update(params as NavigationEvent);
    });
  }

  parseStatements() {
    const p = ((this.recommendationResult || {}).p || {});
    this.statement = p.statement || '';
  }

  update(event: NavigationEvent) {
    const run = event.run || '';
    const tag = event.tag || 'overview_page';
    const host = event.host || '';

    this.store.dispatch(setLoadingStateAction({
      loadingState: {
        loading: true,
        message: 'Loading data',
      }
    }));

    this.dataService.getData(run, tag, host).subscribe(data => {
      this.store.dispatch(setLoadingStateAction({
        loadingState: {
          loading: false,
          message: '',
        }
      }));

      /** Transfer data to Overview DataTable type */
      this.parseOverviewData((data || []) as OverviewDataTuple);
      this.parseStatements();
      this.updateStyle();
    });
  }
}
