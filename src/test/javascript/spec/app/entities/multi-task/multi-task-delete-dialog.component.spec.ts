/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PermaTestModule } from '../../../test.module';
import { MultiTaskDeleteDialogComponent } from 'app/entities/multi-task/multi-task-delete-dialog.component';
import { MultiTaskService } from 'app/entities/multi-task/multi-task.service';

describe('Component Tests', () => {
    describe('MultiTask Management Delete Component', () => {
        let comp: MultiTaskDeleteDialogComponent;
        let fixture: ComponentFixture<MultiTaskDeleteDialogComponent>;
        let service: MultiTaskService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [MultiTaskDeleteDialogComponent]
            })
                .overrideTemplate(MultiTaskDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(MultiTaskDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MultiTaskService);
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
