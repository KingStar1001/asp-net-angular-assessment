import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomEventsComponent } from './custom-events.component';

const routes: Routes = [
  {
    path: '',
    component: CustomEventsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomEventsRoutingModule { }
