/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PermaTestModule } from '../../../test.module';
import { TaskingCapabilityDeleteDialogComponent } from 'app/entities/tasking-capability/tasking-capability-delete-dialog.component';
import { TaskingCapabilityService } from 'app/entities/tasking-capability/tasking-capability.service';

describe('Component Tests', () => {
    describe('TaskingCapability Management Delete Component', () => {
        let comp: TaskingCapabilityDeleteDialogComponent;
        let fixture: ComponentFixture<TaskingCapabilityDeleteDialogComponent>;
        let service: TaskingCapabilityService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [TaskingCapabilityDeleteDialogComponent]
            })
                .overrideTemplate(TaskingCapabilityDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TaskingCapabilityDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TaskingCapabilityService);
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
