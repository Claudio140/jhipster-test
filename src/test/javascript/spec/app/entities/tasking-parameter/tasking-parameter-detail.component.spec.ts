/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PermaTestModule } from '../../../test.module';
import { TaskingParameterDetailComponent } from 'app/entities/tasking-parameter/tasking-parameter-detail.component';
import { TaskingParameter } from 'app/shared/model/tasking-parameter.model';

describe('Component Tests', () => {
    describe('TaskingParameter Management Detail Component', () => {
        let comp: TaskingParameterDetailComponent;
        let fixture: ComponentFixture<TaskingParameterDetailComponent>;
        const route = ({ data: of({ taskingParameter: new TaskingParameter(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [TaskingParameterDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(TaskingParameterDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TaskingParameterDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.taskingParameter).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
