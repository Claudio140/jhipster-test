import { element, by, ElementFinder } from 'protractor';

export class TaskExecutionComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-task-execution div table .btn-danger'));
    title = element.all(by.css('jhi-task-execution div h2#page-heading span')).first();

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

export class TaskExecutionUpdatePage {
    pageTitle = element(by.id('jhi-task-execution-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    timestampInput = element(by.id('field_timestamp'));
    multiTaskSelect = element(by.id('field_multiTask'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setTimestampInput(timestamp) {
        await this.timestampInput.sendKeys(timestamp);
    }

    async getTimestampInput() {
        return this.timestampInput.getAttribute('value');
    }

    async multiTaskSelectLastOption() {
        await this.multiTaskSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async multiTaskSelectOption(option) {
        await this.multiTaskSelect.sendKeys(option);
    }

    getMultiTaskSelect(): ElementFinder {
        return this.multiTaskSelect;
    }

    async getMultiTaskSelectedOption() {
        return this.multiTaskSelect.element(by.css('option:checked')).getText();
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

export class TaskExecutionDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-taskExecution-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-taskExecution'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
