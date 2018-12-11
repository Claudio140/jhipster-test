/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PermaTestModule } from '../../../test.module';
import { TaskExecutionDeleteDialogComponent } from 'app/entities/task-execution/task-execution-delete-dialog.component';
import { TaskExecutionService } from 'app/entities/task-execution/task-execution.service';

describe('Component Tests', () => {
    describe('TaskExecution Management Delete Component', () => {
        let comp: TaskExecutionDeleteDialogComponent;
        let fixture: ComponentFixture<TaskExecutionDeleteDialogComponent>;
        let service: TaskExecutionService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [TaskExecutionDeleteDialogComponent]
            })
                .overrideTemplate(TaskExecutionDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TaskExecutionDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TaskExecutionService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
