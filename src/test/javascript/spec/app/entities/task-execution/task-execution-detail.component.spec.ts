/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PermaTestModule } from '../../../test.module';
import { TaskExecutionDetailComponent } from 'app/entities/task-execution/task-execution-detail.component';
import { TaskExecution } from 'app/shared/model/task-execution.model';

describe('Component Tests', () => {
    describe('TaskExecution Management Detail Component', () => {
        let comp: TaskExecutionDetailComponent;
        let fixture: ComponentFixture<TaskExecutionDetailComponent>;
        const route = ({ data: of({ taskExecution: new TaskExecution(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [TaskExecutionDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(TaskExecutionDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TaskExecutionDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.taskExecution).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
