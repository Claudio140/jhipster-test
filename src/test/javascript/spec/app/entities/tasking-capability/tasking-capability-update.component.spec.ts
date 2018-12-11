/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PermaTestModule } from '../../../test.module';
import { TaskingCapabilityUpdateComponent } from 'app/entities/tasking-capability/tasking-capability-update.component';
import { TaskingCapabilityService } from 'app/entities/tasking-capability/tasking-capability.service';
import { TaskingCapability } from 'app/shared/model/tasking-capability.model';

describe('Component Tests', () => {
    describe('TaskingCapability Management Update Component', () => {
        let comp: TaskingCapabilityUpdateComponent;
        let fixture: ComponentFixture<TaskingCapabilityUpdateComponent>;
        let service: TaskingCapabilityService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [TaskingCapabilityUpdateComponent]
            })
                .overrideTemplate(TaskingCapabilityUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TaskingCapabilityUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TaskingCapabilityService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new TaskingCapability(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.taskingCapability = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new TaskingCapability();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.taskingCapability = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
