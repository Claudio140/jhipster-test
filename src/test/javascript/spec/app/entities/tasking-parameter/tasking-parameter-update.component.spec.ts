/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PermaTestModule } from '../../../test.module';
import { TaskingParameterUpdateComponent } from 'app/entities/tasking-parameter/tasking-parameter-update.component';
import { TaskingParameterService } from 'app/entities/tasking-parameter/tasking-parameter.service';
import { TaskingParameter } from 'app/shared/model/tasking-parameter.model';

describe('Component Tests', () => {
    describe('TaskingParameter Management Update Component', () => {
        let comp: TaskingParameterUpdateComponent;
        let fixture: ComponentFixture<TaskingParameterUpdateComponent>;
        let service: TaskingParameterService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [TaskingParameterUpdateComponent]
            })
                .overrideTemplate(TaskingParameterUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TaskingParameterUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TaskingParameterService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new TaskingParameter(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.taskingParameter = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new TaskingParameter();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.taskingParameter = entity;
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
