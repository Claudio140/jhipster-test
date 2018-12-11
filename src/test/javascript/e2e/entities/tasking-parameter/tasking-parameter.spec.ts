/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TaskingParameterComponentsPage, TaskingParameterDeleteDialog, TaskingParameterUpdatePage } from './tasking-parameter.page-object';

const expect = chai.expect;

describe('TaskingParameter e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let taskingParameterUpdatePage: TaskingParameterUpdatePage;
    let taskingParameterComponentsPage: TaskingParameterComponentsPage;
    let taskingParameterDeleteDialog: TaskingParameterDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load TaskingParameters', async () => {
        await navBarPage.goToEntity('tasking-parameter');
        taskingParameterComponentsPage = new TaskingParameterComponentsPage();
        expect(await taskingParameterComponentsPage.getTitle()).to.eq('permaApp.taskingParameter.home.title');
    });

    it('should load create TaskingParameter page', async () => {
        await taskingParameterComponentsPage.clickOnCreateButton();
        taskingParameterUpdatePage = new TaskingParameterUpdatePage();
        expect(await taskingParameterUpdatePage.getPageTitle()).to.eq('permaApp.taskingParameter.home.createOrEditLabel');
        await taskingParameterUpdatePage.cancel();
    });

    it('should create and save TaskingParameters', async () => {
        const nbButtonsBeforeCreate = await taskingParameterComponentsPage.countDeleteButtons();

        await taskingParameterComponentsPage.clickOnCreateButton();
        await promise.all([taskingParameterUpdatePage.setNameInput('name')]);
        expect(await taskingParameterUpdatePage.getNameInput()).to.eq('name');
        await taskingParameterUpdatePage.save();
        expect(await taskingParameterUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await taskingParameterComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last TaskingParameter', async () => {
        const nbButtonsBeforeDelete = await taskingParameterComponentsPage.countDeleteButtons();
        await taskingParameterComponentsPage.clickOnLastDeleteButton();

        taskingParameterDeleteDialog = new TaskingParameterDeleteDialog();
        expect(await taskingParameterDeleteDialog.getDialogTitle()).to.eq('permaApp.taskingParameter.delete.question');
        await taskingParameterDeleteDialog.clickOnConfirmButton();

        expect(await taskingParameterComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
