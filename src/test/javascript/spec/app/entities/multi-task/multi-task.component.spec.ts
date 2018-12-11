/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PermaTestModule } from '../../../test.module';
import { MultiTaskComponent } from 'app/entities/multi-task/multi-task.component';
import { MultiTaskService } from 'app/entities/multi-task/multi-task.service';
import { MultiTask } from 'app/shared/model/multi-task.model';

describe('Component Tests', () => {
    describe('MultiTask Management Component', () => {
        let comp: MultiTaskComponent;
        let fixture: ComponentFixture<MultiTaskComponent>;
        let service: MultiTaskService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [MultiTaskComponent],
                providers: []
            })
                .overrideTemplate(MultiTaskComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(MultiTaskComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MultiTaskService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new MultiTask(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.multiTasks[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
