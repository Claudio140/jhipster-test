/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ActorComponentsPage, ActorDeleteDialog, ActorUpdatePage } from './actor.page-object';

const expect = chai.expect;

describe('Actor e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let actorUpdatePage: ActorUpdatePage;
    let actorComponentsPage: ActorComponentsPage;
    let actorDeleteDialog: ActorDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Actors', async () => {
        await navBarPage.goToEntity('actor');
        actorComponentsPage = new ActorComponentsPage();
        expect(await actorComponentsPage.getTitle()).to.eq('permaApp.actor.home.title');
    });

    it('should load create Actor page', async () => {
        await actorComponentsPage.clickOnCreateButton();
        actorUpdatePage = new ActorUpdatePage();
        expect(await actorUpdatePage.getPageTitle()).to.eq('permaApp.actor.home.createOrEditLabel');
        await actorUpdatePage.cancel();
    });

    it('should create and save Actors', async () => {
        const nbButtonsBeforeCreate = await actorComponentsPage.countDeleteButtons();

        await actorComponentsPage.clickOnCreateButton();
        await promise.all([actorUpdatePage.setNameInput('name'), actorUpdatePage.setDescriptionInput('description')]);
        expect(await actorUpdatePage.getNameInput()).to.eq('name');
        expect(await actorUpdatePage.getDescriptionInput()).to.eq('description');
        await actorUpdatePage.save();
        expect(await actorUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await actorComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Actor', async () => {
        const nbButtonsBeforeDelete = await actorComponentsPage.countDeleteButtons();
        await actorComponentsPage.clickOnLastDeleteButton();

        actorDeleteDialog = new ActorDeleteDialog();
        expect(await actorDeleteDialog.getDialogTitle()).to.eq('permaApp.actor.delete.question');
        await actorDeleteDialog.clickOnConfirmButton();

        expect(await actorComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
