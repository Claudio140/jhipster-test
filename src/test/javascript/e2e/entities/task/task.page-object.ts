import { element, by, ElementFinder } from 'protractor';

export class TaskComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-task div table .btn-danger'));
    title = element.all(by.css('jhi-task div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class TaskUpdatePage {
    pageTitle = element(by.id('jhi-task-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    nameInput = element(by.id('field_name'));
    repetitionsInput = element(by.id('field_repetitions'));
    creationTimeInput = element(by.id('field_creationTime'));
    executionTimeInput = element(by.id('field_executionTime'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setNameInput(name) {
        await this.nameInput.sendKeys(name);
    }

    async getNameInput() {
        return this.nameInput.getAttribute('value');
    }

    async setRepetitionsInput(repetitions) {
        await this.repetitionsInput.sendKeys(repetitions);
    }

    async getRepetitionsInput() {
        return this.repetitionsInput.getAttribute('value');
    }

    async setCreationTimeInput(creationTime) {
        await this.creationTimeInput.sendKeys(creationTime);
    }

    async getCreationTimeInput() {
        return this.creationTimeInput.getAttribute('value');
    }

    async setExecutionTimeInput(executionTime) {
        await this.executionTimeInput.sendKeys(executionTime);
    }

    async getExecutionTimeInput() {
        return this.executionTimeInput.getAttribute('value');
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class TaskDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-task-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-task'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
