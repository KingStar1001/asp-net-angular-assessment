import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { GuestComponent } from './guest.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [GuestComponent],
  exports: [GuestComponent],
  imports: [
    CommonModule,
    GuestRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule
  ]
})
export class GuestModule { }
