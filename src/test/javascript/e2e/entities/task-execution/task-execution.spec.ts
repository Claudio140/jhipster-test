/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TaskExecutionComponentsPage, TaskExecutionDeleteDialog, TaskExecutionUpdatePage } from './task-execution.page-object';

const expect = chai.expect;

describe('TaskExecution e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let taskExecutionUpdatePage: TaskExecutionUpdatePage;
    let taskExecutionComponentsPage: TaskExecutionComponentsPage;
    let taskExecutionDeleteDialog: TaskExecutionDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load TaskExecutions', async () => {
        await navBarPage.goToEntity('task-execution');
        taskExecutionComponentsPage = new TaskExecutionComponentsPage();
        expect(await taskExecutionComponentsPage.getTitle()).to.eq('permaApp.taskExecution.home.title');
    });

    it('should load create TaskExecution page', async () => {
        await taskExecutionComponentsPage.clickOnCreateButton();
        taskExecutionUpdatePage = new TaskExecutionUpdatePage();
        expect(await taskExecutionUpdatePage.getPageTitle()).to.eq('permaApp.taskExecution.home.createOrEditLabel');
        await taskExecutionUpdatePage.cancel();
    });

    it('should create and save TaskExecutions', async () => {
        const nbButtonsBeforeCreate = await taskExecutionComponentsPage.countDeleteButtons();

        await taskExecutionComponentsPage.clickOnCreateButton();
        await promise.all([
            taskExecutionUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            taskExecutionUpdatePage.multiTaskSelectLastOption()
        ]);
        expect(await taskExecutionUpdatePage.getTimestampInput()).to.contain('2001-01-01T02:30');
        await taskExecutionUpdatePage.save();
        expect(await taskExecutionUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await taskExecutionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last TaskExecution', async () => {
        const nbButtonsBeforeDelete = await taskExecutionComponentsPage.countDeleteButtons();
        await taskExecutionComponentsPage.clickOnLastDeleteButton();

        taskExecutionDeleteDialog = new TaskExecutionDeleteDialog();
        expect(await taskExecutionDeleteDialog.getDialogTitle()).to.eq('permaApp.taskExecution.delete.question');
        await taskExecutionDeleteDialog.clickOnConfirmButton();

        expect(await taskExecutionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
