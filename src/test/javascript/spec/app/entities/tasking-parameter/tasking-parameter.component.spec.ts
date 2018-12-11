/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PermaTestModule } from '../../../test.module';
import { TaskingParameterComponent } from 'app/entities/tasking-parameter/tasking-parameter.component';
import { TaskingParameterService } from 'app/entities/tasking-parameter/tasking-parameter.service';
import { TaskingParameter } from 'app/shared/model/tasking-parameter.model';

describe('Component Tests', () => {
    describe('TaskingParameter Management Component', () => {
        let comp: TaskingParameterComponent;
        let fixture: ComponentFixture<TaskingParameterComponent>;
        let service: TaskingParameterService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [TaskingParameterComponent],
                providers: []
            })
                .overrideTemplate(TaskingParameterComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TaskingParameterComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TaskingParameterService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new TaskingParameter(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.taskingParameters[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
