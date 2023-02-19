const Generator = require('yeoman-generator');
const chalk = require('chalk');
const fs = require('fs');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'componentName',
        message: 'What is the name of the form component?'
      },
      {
        type: 'input',
        name: 'jsonFilePath',
        message: 'What is the path to the JSON file with the form fields?'
      }
    ]);
  }

  writing() {
    // Leggi i dati forniti dall'utente attraverso il prompt
    const componentName = this.answers.componentName.toLowerCase();
    const formFieldsPath = this.answers.jsonFilePath;

    // Leggi i campi del form dal file JSON
    const formFieldsFile = fs.readFileSync(formFieldsPath, 'utf8');
    const formFields = JSON.parse(formFieldsFile);

    // Aggiungi la dichiarazione del componente nel file app.module.ts
    const appModuleFilePath = this.destinationPath('src/app/app.module.ts');
    let appModuleFile = fs.readFileSync(appModuleFilePath, 'utf8');
    const componentDeclaration = `    ${componentName}Component,\n`;
    appModuleFile = appModuleFile.replace(/(declarations:\s*\[\r?\n)([\s\S]*?)(^\])/m, (match, p1, p2, p3) => {
      const existingDeclarations = p2.trim().split('\n');
      existingDeclarations.push(componentDeclaration);
      existingDeclarations.sort();
      const newDeclarations = existingDeclarations.map(declaration => {
        return `    ${declaration}`;
      }).join(',\n');
      return `${p1}${newDeclarations}\n${p3}`;
    });
    this.fs.write(appModuleFilePath, appModuleFile);

    // Crea i file per il componente
    const componentFilePath = this.destinationPath(`src/app/${componentName}/${componentName}.component.ts`);
    const componentTemplatePath = this.destinationPath(`src/app/${componentName}/${componentName}.component.html`);
    this.fs.copyTpl(
      this.templatePath('form-component/form-component.ts'),
      componentFilePath,
      { componentName, formFields: JSON.stringify(formFields, null, 2) }
    );
    this.fs.copyTpl(
      this.templatePath('form-component/form-component.html'),
      componentTemplatePath,
      { componentName }
    );
  }

  end() {
    this.log(chalk.green(`\nAngular form component successfully created!`));
  }
};