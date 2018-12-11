/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PermaTestModule } from '../../../test.module';
import { TaskingParameterDeleteDialogComponent } from 'app/entities/tasking-parameter/tasking-parameter-delete-dialog.component';
import { TaskingParameterService } from 'app/entities/tasking-parameter/tasking-parameter.service';

describe('Component Tests', () => {
    describe('TaskingParameter Management Delete Component', () => {
        let comp: TaskingParameterDeleteDialogComponent;
        let fixture: ComponentFixture<TaskingParameterDeleteDialogComponent>;
        let service: TaskingParameterService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [TaskingParameterDeleteDialogComponent]
            })
                .overrideTemplate(TaskingParameterDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TaskingParameterDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TaskingParameterService);
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
