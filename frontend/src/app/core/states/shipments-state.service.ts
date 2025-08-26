import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, tap, throwError } from 'rxjs';
import { CreateShipmentDto, Shipment } from '../models/warehouse-shipment.interface';
import { ShipmentsApiService } from '../services/shipments-api.service';

export interface ShipmentsState {
  shipments: Shipment[];
  loading: boolean;
  error: string | null;
}

const initialState: ShipmentsState = {
  shipments: [],
  loading: false,
  error: null,
};

// this CRUD state can definitely be extracted to be generic so we dont repeat ourselves
// copied the items state for assignment purposes, otherwise not nice :(
@Injectable()
export class ShipmentsStateService {
  private state$ = new BehaviorSubject<ShipmentsState>(initialState);

  public readonly shipments$ = this.state$.pipe(map(state => state.shipments));
  public readonly loading$ = this.state$.pipe(map(state => state.loading));
  public readonly error$ = this.state$.pipe(map(state => state.error));

  constructor(private shipmentsApi: ShipmentsApiService) { }

  public loadShipments() {
    this.updateState({ loading: true, error: null });

    return this.shipmentsApi.getAll().pipe(
      tap(shipments => this.updateState({ shipments } )),
      catchError(error => {
        this.updateState({error: 'Unable to load shipments'})
        return throwError(() => error);
      }),
      finalize(()=>this.updateState({ loading: false}))
    )
  }

  public createShipment(item: CreateShipmentDto) {
    this.updateState({ loading: true, error: null });

    return this.shipmentsApi.create(item).pipe(
      tap(newItem => {
        const currentItems = this.state$.value.shipments;
        this.updateState({ shipments: [...currentItems, newItem] });
      }),
      catchError(error => {
        const errorMessage = error?.error?.message?.join("<br>") || 'Failed to create shipment';
        this.updateState({ error: errorMessage});
        return throwError(() => errorMessage);
      }),
      finalize(() => this.updateState({ loading: false }))
    );
  }

  private updateState(updates: Partial<ShipmentsState>) {
    const currentState = this.state$.value;
    this.state$.next({ ...currentState, ...updates });
  }

  public deleteShipment(id: number) {
    this.updateState({ loading: true, error: null });

    return this.shipmentsApi.delete(id).pipe(
      tap(() => {
        const currentItems = this.state$.value.shipments;
        // again, this is O(n) for a simple deletion,
        // can be optimized to O(1) by using a map
        const filteredItems = currentItems.filter(item => item.id !== id);
        this.updateState({ shipments: filteredItems });
      }),
      catchError(error => {
        const errorMessage = 'Failed to delete shipment'
        this.updateState({ error: errorMessage });
        return throwError(() => errorMessage);
      }),
      finalize(() => this.updateState({ loading: false }))
    );
  }
}
