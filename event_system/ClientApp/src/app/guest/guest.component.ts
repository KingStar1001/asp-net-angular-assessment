import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Guest } from '../models/guest';
import { GuestService } from '../services/guest.service';

import { Allergy } from '../models/allergy';
import { AllergyService } from '../services/allergy.service';

import { NgForm } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent implements OnInit, OnDestroy{

  protected readonly unsubscribe$ = new Subject<void>();

  @ViewChild("createForm") createForm!: NgForm;
  @ViewChild("editForm") editForm!: NgForm;

  public guest: Guest = { firstName: "", lastName: "", email: "", allergies: [] };
  public dobModel: NgbDateStruct = { year: 1990, month: 6, day: 15 };
  public allergies: Allergy[] = [];



  guests: Guest[] = [];

  createModalRef: NgbModalRef | undefined;
  editModalRef: NgbModalRef | undefined;
  editGuestID?: number;
  constructor(private guestService: GuestService, private modalService: NgbModal, private allergyService: AllergyService) { }

  ngOnInit(): void {
    this.allergyService.getAll().pipe(takeUntil(this.unsubscribe$))
      .subscribe({ next: (res) => this.allergies = res });

    this.guestService.getAll().pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          console.log(res)
          this.guests = res;
        },
        error: (err: Error) => console.log(`Error is ${err.message}`)
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onCustomInit(): void {
    this.guest = { firstName: "", lastName: "", email: "", allergies: [] };
    this.dobModel = { year: 1990, month: 6, day: 15 };
    this.editGuestID = 0;
  }
  /**
   * Write code on Method
   *
   * @return response()
   */
   deleteEvent(id?: number) {
    this.guestService.delete(id!).subscribe(res => {
      this.guests = this.guests.filter(item => item.id !== id);
      console.log('Event deleted successfully!');
    })
  }

  // Display create modal
  onDisplayCreateModal(content: any) {
    this.onCustomInit()
    this.createModalRef = this.modalService.open(content, { centered: true, modalDialogClass: 'create-modal justify-content-center align-items-content', size: 'lg' });
  }
  onSubmit() {
    // dob
    let date: Date = new Date(this.dobModel.year, this.dobModel.month - 1);
    date.setUTCDate(this.dobModel.day);
    this.guest.dob = date.toISOString();

    this.guestService.create(this.guest).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        console.log(`Successfully created `)
        //this.guests.push(this.guest);
        this.ngOnInit();
        this.createModalRef?.close()
      },
      error: (err: Error) => console.log(`Error is ${err.message}`)
    });
  }

  // Edit modal 
  onDisplayEditModal(content: any, id?: number) {
    this.onCustomInit()
    this.editGuestID = id;
    this.guestService
      .find(id!)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: Guest) => {
          this.guest = res;
          if (this.guest.dob) {
            const date: Date = new Date(typeof this.guest.dob === 'string' ?
              Date.parse(this.guest.dob) : this.guest.dob);
            this.dobModel = {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate(),
            };
            this.editModalRef = this.modalService.open(content, { centered: true, modalDialogClass: 'edit-modal justify-content-center align-items-content', size: 'lg' });
          }
        },
        error: (err: Error) => console.log(`Error is ${err.message}`)
      });
    
  }

  onUpdate() {
    let date: Date = new Date(this.dobModel.year, this.dobModel.month - 1);
    date.setUTCDate(this.dobModel.day);
    this.guest.dob = date.toISOString();
    console.log(this.guest);
    this.guestService.update(this.editGuestID!, this.guest).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        const _index = this.guests.findIndex(element => element.id == this.guest.id);
        this.guests[_index] = this.guest
        this.editModalRef?.close()
      },
      error: (err: Error) => {
        console.log(`Error is occurend on update Guest ${err.message}`)
        this.editModalRef?.close()
      }
    });
  }

  onDateSelect(event: any) {
    console.log(event);
  }
}
