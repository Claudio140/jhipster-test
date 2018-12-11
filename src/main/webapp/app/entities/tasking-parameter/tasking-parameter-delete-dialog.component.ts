import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITaskingParameter } from 'app/shared/model/tasking-parameter.model';
import { TaskingParameterService } from './tasking-parameter.service';

@Component({
    selector: 'jhi-tasking-parameter-delete-dialog',
    templateUrl: './tasking-parameter-delete-dialog.component.html'
})
export class TaskingParameterDeleteDialogComponent {
    taskingParameter: ITaskingParameter;

    constructor(
        private taskingParameterService: TaskingParameterService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.taskingParameterService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'taskingParameterListModification',
                content: 'Deleted an taskingParameter'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-tasking-parameter-delete-popup',
    template: ''
})
export class TaskingParameterDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ taskingParameter }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TaskingParameterDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.taskingParameter = taskingParameter;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
