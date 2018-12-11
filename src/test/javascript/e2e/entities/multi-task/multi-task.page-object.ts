import { element, by, ElementFinder } from 'protractor';

export class MultiTaskComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-multi-task div table .btn-danger'));
    title = element.all(by.css('jhi-multi-task div h2#page-heading span')).first();

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

export class MultiTaskUpdatePage {
    pageTitle = element(by.id('jhi-multi-task-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    creationTimeInput = element(by.id('field_creationTime'));
    taskingParameterInput = element(by.id('field_taskingParameter'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setCreationTimeInput(creationTime) {
        await this.creationTimeInput.sendKeys(creationTime);
    }

    async getCreationTimeInput() {
        return this.creationTimeInput.getAttribute('value');
    }

    async setTaskingParameterInput(taskingParameter) {
        await this.taskingParameterInput.sendKeys(taskingParameter);
    }

    async getTaskingParameterInput() {
        return this.taskingParameterInput.getAttribute('value');
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

export class MultiTaskDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-multiTask-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-multiTask'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
