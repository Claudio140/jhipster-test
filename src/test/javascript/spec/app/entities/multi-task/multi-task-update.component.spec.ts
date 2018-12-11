/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PermaTestModule } from '../../../test.module';
import { MultiTaskUpdateComponent } from 'app/entities/multi-task/multi-task-update.component';
import { MultiTaskService } from 'app/entities/multi-task/multi-task.service';
import { MultiTask } from 'app/shared/model/multi-task.model';

describe('Component Tests', () => {
    describe('MultiTask Management Update Component', () => {
        let comp: MultiTaskUpdateComponent;
        let fixture: ComponentFixture<MultiTaskUpdateComponent>;
        let service: MultiTaskService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [MultiTaskUpdateComponent]
            })
                .overrideTemplate(MultiTaskUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(MultiTaskUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MultiTaskService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new MultiTask(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.multiTask = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new MultiTask();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.multiTask = entity;
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
