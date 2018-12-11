/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MultiTaskComponentsPage, MultiTaskDeleteDialog, MultiTaskUpdatePage } from './multi-task.page-object';

const expect = chai.expect;

describe('MultiTask e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let multiTaskUpdatePage: MultiTaskUpdatePage;
    let multiTaskComponentsPage: MultiTaskComponentsPage;
    let multiTaskDeleteDialog: MultiTaskDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load MultiTasks', async () => {
        await navBarPage.goToEntity('multi-task');
        multiTaskComponentsPage = new MultiTaskComponentsPage();
        expect(await multiTaskComponentsPage.getTitle()).to.eq('permaApp.multiTask.home.title');
    });

    it('should load create MultiTask page', async () => {
        await multiTaskComponentsPage.clickOnCreateButton();
        multiTaskUpdatePage = new MultiTaskUpdatePage();
        expect(await multiTaskUpdatePage.getPageTitle()).to.eq('permaApp.multiTask.home.createOrEditLabel');
        await multiTaskUpdatePage.cancel();
    });

    it('should create and save MultiTasks', async () => {
        const nbButtonsBeforeCreate = await multiTaskComponentsPage.countDeleteButtons();

        await multiTaskComponentsPage.clickOnCreateButton();
        await promise.all([
            multiTaskUpdatePage.setCreationTimeInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            multiTaskUpdatePage.setTaskingParameterInput('taskingParameter')
        ]);
        expect(await multiTaskUpdatePage.getCreationTimeInput()).to.contain('2001-01-01T02:30');
        expect(await multiTaskUpdatePage.getTaskingParameterInput()).to.eq('taskingParameter');
        await multiTaskUpdatePage.save();
        expect(await multiTaskUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await multiTaskComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last MultiTask', async () => {
        const nbButtonsBeforeDelete = await multiTaskComponentsPage.countDeleteButtons();
        await multiTaskComponentsPage.clickOnLastDeleteButton();

        multiTaskDeleteDialog = new MultiTaskDeleteDialog();
        expect(await multiTaskDeleteDialog.getDialogTitle()).to.eq('permaApp.multiTask.delete.question');
        await multiTaskDeleteDialog.clickOnConfirmButton();

        expect(await multiTaskComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
