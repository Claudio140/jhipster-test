import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITaskingCapability } from 'app/shared/model/tasking-capability.model';
import { TaskingCapabilityService } from './tasking-capability.service';

@Component({
    selector: 'jhi-tasking-capability-delete-dialog',
    templateUrl: './tasking-capability-delete-dialog.component.html'
})
export class TaskingCapabilityDeleteDialogComponent {
    taskingCapability: ITaskingCapability;

    constructor(
        private taskingCapabilityService: TaskingCapabilityService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.taskingCapabilityService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'taskingCapabilityListModification',
                content: 'Deleted an taskingCapability'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-tasking-capability-delete-popup',
    template: ''
})
export class TaskingCapabilityDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ taskingCapability }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TaskingCapabilityDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.taskingCapability = taskingCapability;
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
