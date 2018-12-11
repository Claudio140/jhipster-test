import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITaskExecution } from 'app/shared/model/task-execution.model';
import { TaskExecutionService } from './task-execution.service';

@Component({
    selector: 'jhi-task-execution-delete-dialog',
    templateUrl: './task-execution-delete-dialog.component.html'
})
export class TaskExecutionDeleteDialogComponent {
    taskExecution: ITaskExecution;

    constructor(
        private taskExecutionService: TaskExecutionService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.taskExecutionService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'taskExecutionListModification',
                content: 'Deleted an taskExecution'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-task-execution-delete-popup',
    template: ''
})
export class TaskExecutionDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ taskExecution }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TaskExecutionDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.taskExecution = taskExecution;
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
