/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
    TaskingCapabilityComponentsPage,
    TaskingCapabilityDeleteDialog,
    TaskingCapabilityUpdatePage
} from './tasking-capability.page-object';

const expect = chai.expect;

describe('TaskingCapability e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let taskingCapabilityUpdatePage: TaskingCapabilityUpdatePage;
    let taskingCapabilityComponentsPage: TaskingCapabilityComponentsPage;
    let taskingCapabilityDeleteDialog: TaskingCapabilityDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load TaskingCapabilities', async () => {
        await navBarPage.goToEntity('tasking-capability');
        taskingCapabilityComponentsPage = new TaskingCapabilityComponentsPage();
        expect(await taskingCapabilityComponentsPage.getTitle()).to.eq('permaApp.taskingCapability.home.title');
    });

    it('should load create TaskingCapability page', async () => {
        await taskingCapabilityComponentsPage.clickOnCreateButton();
        taskingCapabilityUpdatePage = new TaskingCapabilityUpdatePage();
        expect(await taskingCapabilityUpdatePage.getPageTitle()).to.eq('permaApp.taskingCapability.home.createOrEditLabel');
        await taskingCapabilityUpdatePage.cancel();
    });

    it('should create and save TaskingCapabilities', async () => {
        const nbButtonsBeforeCreate = await taskingCapabilityComponentsPage.countDeleteButtons();

        await taskingCapabilityComponentsPage.clickOnCreateButton();
        await promise.all([
            taskingCapabilityUpdatePage.setNameInput('name'),
            taskingCapabilityUpdatePage.setDescriptionInput('description'),
            taskingCapabilityUpdatePage.setTaskingParametersInput('taskingParameters'),
            taskingCapabilityUpdatePage.setPropertiesInput('properties'),
            taskingCapabilityUpdatePage.actorSelectLastOption(),
            taskingCapabilityUpdatePage.multiTaskSelectLastOption()
        ]);
        expect(await taskingCapabilityUpdatePage.getNameInput()).to.eq('name');
        expect(await taskingCapabilityUpdatePage.getDescriptionInput()).to.eq('description');
        expect(await taskingCapabilityUpdatePage.getTaskingParametersInput()).to.eq('taskingParameters');
        expect(await taskingCapabilityUpdatePage.getPropertiesInput()).to.eq('properties');
        await taskingCapabilityUpdatePage.save();
        expect(await taskingCapabilityUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await taskingCapabilityComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last TaskingCapability', async () => {
        const nbButtonsBeforeDelete = await taskingCapabilityComponentsPage.countDeleteButtons();
        await taskingCapabilityComponentsPage.clickOnLastDeleteButton();

        taskingCapabilityDeleteDialog = new TaskingCapabilityDeleteDialog();
        expect(await taskingCapabilityDeleteDialog.getDialogTitle()).to.eq('permaApp.taskingCapability.delete.question');
        await taskingCapabilityDeleteDialog.clickOnConfirmButton();

        expect(await taskingCapabilityComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
