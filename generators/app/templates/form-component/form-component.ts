import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-<%= componentName %>',
  templateUrl: './<%= componentName %>.component.html',
  styleUrls: ['./<%= componentName %>.component.css']
})
export class <%= componentName %>Component implements OnInit {
  form: FormGroup;
  formFields = <%= formFields %>;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({});
    this.formFields.forEach(field => {
      this.form.addControl(field.name, this.fb.control(''));
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
