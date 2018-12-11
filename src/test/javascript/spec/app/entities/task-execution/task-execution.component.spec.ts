/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PermaTestModule } from '../../../test.module';
import { TaskExecutionComponent } from 'app/entities/task-execution/task-execution.component';
import { TaskExecutionService } from 'app/entities/task-execution/task-execution.service';
import { TaskExecution } from 'app/shared/model/task-execution.model';

describe('Component Tests', () => {
    describe('TaskExecution Management Component', () => {
        let comp: TaskExecutionComponent;
        let fixture: ComponentFixture<TaskExecutionComponent>;
        let service: TaskExecutionService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [TaskExecutionComponent],
                providers: []
            })
                .overrideTemplate(TaskExecutionComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TaskExecutionComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TaskExecutionService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new TaskExecution(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.taskExecutions[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
