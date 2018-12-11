import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMultiTask } from 'app/shared/model/multi-task.model';
import { MultiTaskService } from './multi-task.service';

@Component({
    selector: 'jhi-multi-task-delete-dialog',
    templateUrl: './multi-task-delete-dialog.component.html'
})
export class MultiTaskDeleteDialogComponent {
    multiTask: IMultiTask;

    constructor(private multiTaskService: MultiTaskService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.multiTaskService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'multiTaskListModification',
                content: 'Deleted an multiTask'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-multi-task-delete-popup',
    template: ''
})
export class MultiTaskDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ multiTask }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(MultiTaskDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.multiTask = multiTask;
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
