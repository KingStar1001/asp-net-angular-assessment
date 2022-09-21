import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomEventsRoutingModule } from './custom-events-routing.module';
import { CustomEventsComponent } from './custom-events.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomEventsComponent],
  exports: [CustomEventsComponent],
  imports: [
    CommonModule,
    FormsModule,
    CustomEventsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomEventsModule { }
