import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import formConfig from './form-config.json';


type Field =
  | { Type: 'H1'; Text: string }
  | { ID: string; Type: 'Text'; Placeholder: string }
  | { ID: string; Type: 'Button'; Title: string; AlertMessage: string };

type FormConfig = {
  Title: string;
  Subtitle: string;
  Fields: Field[];
};


@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  config: FormConfig = formConfig as FormConfig;

  fieldValues = signal<{ [key: string]: string }>({});

  ngOnInit(): void {
    const initial: { [key: string]: string } = {};
    
    for (const field of this.config.Fields) {
      if ('ID' in field && field.Type === 'Text') {
        initial[field.ID] = '';
      }
    }
    this.fieldValues.set(initial);
  }
  updateField(id: string, value: string) {
    this.fieldValues.update(vals => ({ ...vals, [id]: value }));
  }

  handleButton(field: Extract<Field, { Type: 'Button' }>) {
    let msg = field.AlertMessage;
  
    msg = msg.replace(/\$\{([^}]+)\}/g, (match, id) =>
      this.fieldValues()[id] ?? ''
    );
    alert(msg);
  }
}
