import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { EventsService } from '../services/events.service';
import { CustomEvent } from '../models/custom-event';
import { Guest } from '../models/guest';
import { GuestService } from '../services/guest.service';

import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { NgForm } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-custom-events',
  templateUrl: './custom-events.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./custom-events.component.scss']
})
export class CustomEventsComponent implements OnInit, OnDestroy {

  protected readonly unsubscribe$ = new Subject<void>();

  @ViewChild("createForm") createForm!: NgForm;
  @ViewChild("editForm") editForm!: NgForm;

  customEvents: CustomEvent[] = [];

  createModalRef: NgbModalRef | undefined;
  editModalRef: NgbModalRef | undefined;

  model: NgbDateStruct | undefined;
  nameModel: string = "";

  public minDate: Date = new Date();
  public minDateStruct: NgbDateStruct = {
    year: this.minDate.getFullYear(),
    month: this.minDate.getMonth() + 1,
    day: this.minDate.getDate()
  };
  public event: CustomEvent = { name: "", guests: [] };
  public dobModel: NgbDateStruct = this.minDateStruct;
  public guests: Guest[] = [];
  public editEventId?: number = 0;


  constructor(private eventService: EventsService, private modalService: NgbModal, private guestService: GuestService) { }

  ngOnInit(): void {
    this.guestService.getAll().pipe(takeUntil(this.unsubscribe$))
      .subscribe({ next: (res) => this.guests = res });

    this.eventService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
       .subscribe({
         next: (data: CustomEvent[]) => {
           this.customEvents = data;
           console.log(data);
           console.log(this.customEvents);
         },
         error: (err: Error) => console.log(`Error is occured in Get All Event API ${err.message}`)
      });
  }

  onCustomInit(): void {
    this.event = { name: "", guests: [] };
    this.dobModel = this.minDateStruct;
    this.editEventId = 0;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  /**
   * Write code on Method
   *
   * @return response()
   */
  deleteEvent(id?: number) {
    this.eventService.delete(id!).subscribe(res => {
      this.customEvents = this.customEvents.filter(item => item.id !== id);
      console.log('Event deleted successfully!');
    })
  }

  // Display create modal
  onDisplayCreateModal(content: any) {
    this.onCustomInit()
    this.createModalRef = this.modalService.open(content, { centered: true, modalDialogClass: 'create-modal justify-content-center align-items-content', size: 'lg' });
  }
  onSubmit() {
    let date: Date = new Date(this.dobModel.year, this.dobModel.month - 1);
    date.setUTCDate(this.dobModel.day);
    this.event.date = date.toISOString();

    // guests
    this.event.guests = this.event.guests?.map(guest => typeof guest === 'number' ? guest : guest.id) as number[];
    if (this.event.guests.length < 2) {
      alert("It is required 2 Guests at least.");
      return;
    } 
    this.eventService.create(this.event)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: () => {
          console.log(`Event Registered successfully`)
          //this.customEvents.push(this.event);
          this.ngOnInit();
          this.createModalRef?.close();
        },
        error: (err: Error) => console.log(`Error is occured in registering Event ${err.message}`)
    });
  }


  // Edit modal 
  onDisplayEditModal(content: any, id?: number) {
    this.onCustomInit()
    this.editEventId = id;
    this.eventService
      .find(id!)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: CustomEvent) => {
          this.event = res;
          if (this.event.date) {
            const date: Date = new Date(typeof this.event.date === 'string' ?
              Date.parse(this.event.date) : this.event.date);
            this.dobModel = {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate(),
            };
          }
          
          this.editModalRef = this.modalService.open(content, { centered: true, modalDialogClass: 'edit-modal justify-content-center align-items-content', size: 'lg' });
        },
        error: (err: Error) => console.log(`Error is occured in Get Event ${err.message}`)
      });
    
  }

  onUpdate() {
    let date: Date = new Date(this.dobModel.year, this.dobModel.month - 1);
    date.setUTCDate(this.dobModel.day);
    this.event.date = date.toISOString();

    // guests
    this.event.guests = this.event.guests?.map(guest => typeof guest === 'number' ? guest : guest.id) as number[];

    if (this.event.guests.length < 2) {
      alert("It is required 2 Guests at least. Please Add Guest.");
      return;
    }

    this.eventService.update(this.editEventId!, this.event)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: () => {
          console.log(`Updated successfully `)
          this.editModalRef?.close();
        },
        error: (err: Error) => console.log(`Error is occured ${err.message}`)
      });
  }

  public isChecked(guestId: number) {
    return this.event.guests?.some(guest => {
      if (typeof guest === 'number') return guest === guestId;
      return guest.id === guestId;
    });
  }

  public onGuestsChanged(guestId: number) {
    let index = this.event.guests?.findIndex(guest => {
      if (typeof guest === 'number') return guest === guestId;
      return guest.id === guestId;
    })
    if (index === undefined || index == -1) (this.event.guests as number[]).push(guestId);
    else this.event.guests?.splice(index, 1);
  }
}
