/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PermaTestModule } from '../../../test.module';
import { TaskingCapabilityDetailComponent } from 'app/entities/tasking-capability/tasking-capability-detail.component';
import { TaskingCapability } from 'app/shared/model/tasking-capability.model';

describe('Component Tests', () => {
    describe('TaskingCapability Management Detail Component', () => {
        let comp: TaskingCapabilityDetailComponent;
        let fixture: ComponentFixture<TaskingCapabilityDetailComponent>;
        const route = ({ data: of({ taskingCapability: new TaskingCapability(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [TaskingCapabilityDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(TaskingCapabilityDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TaskingCapabilityDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.taskingCapability).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
