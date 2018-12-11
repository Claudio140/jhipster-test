/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PermaTestModule } from '../../../test.module';
import { MultiTaskDetailComponent } from 'app/entities/multi-task/multi-task-detail.component';
import { MultiTask } from 'app/shared/model/multi-task.model';

describe('Component Tests', () => {
    describe('MultiTask Management Detail Component', () => {
        let comp: MultiTaskDetailComponent;
        let fixture: ComponentFixture<MultiTaskDetailComponent>;
        const route = ({ data: of({ multiTask: new MultiTask(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PermaTestModule],
                declarations: [MultiTaskDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(MultiTaskDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(MultiTaskDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.multiTask).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
