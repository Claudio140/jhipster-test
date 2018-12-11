import { element, by, ElementFinder } from 'protractor';

export class TaskingCapabilityComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-tasking-capability div table .btn-danger'));
    title = element.all(by.css('jhi-tasking-capability div h2#page-heading span')).first();

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

export class TaskingCapabilityUpdatePage {
    pageTitle = element(by.id('jhi-tasking-capability-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    nameInput = element(by.id('field_name'));
    descriptionInput = element(by.id('field_description'));
    taskingParametersInput = element(by.id('field_taskingParameters'));
    propertiesInput = element(by.id('field_properties'));
    actorSelect = element(by.id('field_actor'));
    multiTaskSelect = element(by.id('field_multiTask'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setNameInput(name) {
        await this.nameInput.sendKeys(name);
    }

    async getNameInput() {
        return this.nameInput.getAttribute('value');
    }

    async setDescriptionInput(description) {
        await this.descriptionInput.sendKeys(description);
    }

    async getDescriptionInput() {
        return this.descriptionInput.getAttribute('value');
    }

    async setTaskingParametersInput(taskingParameters) {
        await this.taskingParametersInput.sendKeys(taskingParameters);
    }

    async getTaskingParametersInput() {
        return this.taskingParametersInput.getAttribute('value');
    }

    async setPropertiesInput(properties) {
        await this.propertiesInput.sendKeys(properties);
    }

    async getPropertiesInput() {
        return this.propertiesInput.getAttribute('value');
    }

    async actorSelectLastOption() {
        await this.actorSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async actorSelectOption(option) {
        await this.actorSelect.sendKeys(option);
    }

    getActorSelect(): ElementFinder {
        return this.actorSelect;
    }

    async getActorSelectedOption() {
        return this.actorSelect.element(by.css('option:checked')).getText();
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

export class TaskingCapabilityDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-taskingCapability-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-taskingCapability'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
