import { Injectable } from '@angular/core';
import { CreateWarehouseItemDto, UpdateWarehouseItemDto, WarehouseItem } from '../models/warehouse-item.interface';
import { BehaviorSubject, catchError, finalize, map, tap, throwError } from 'rxjs';
import { ItemsApiService } from '../services/items-api.service';

export interface ItemsState {
  items: WarehouseItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

@Injectable()
export class ItemsStateService {
  private state$ = new BehaviorSubject<ItemsState>(initialState);

  public readonly items$ = this.state$.pipe(map(state => state.items));
  public readonly loading$ = this.state$.pipe(map(state => state.loading));
  public readonly error$ = this.state$.pipe(map(state => state.error));

  constructor(private itemsApi: ItemsApiService) {}

  public loadItems() {
    this.updateState({ loading: true, error: null });

    return this.itemsApi.getAll().pipe(
      tap(items => this.updateState({ items } )),
      catchError(error => {
        this.updateState({error: 'Unable to load items'})
        return throwError(() => error);
      }),
      finalize(()=>this.updateState({ loading: false}))
    )
  }

  public createItem(item: CreateWarehouseItemDto) {
    this.updateState({ loading: true, error: null });

    return this.itemsApi.create(item).pipe(
      tap(newItem => {
        const currentItems = this.state$.value.items;
        this.updateState({ items: [...currentItems, newItem] });
      }),
      catchError(error => {
        const errorMessage = error?.error?.message?.join("<br>") || 'Failed to create item';
        this.updateState({ error: errorMessage});
        return throwError(() => errorMessage);
      }),
      finalize(() => this.updateState({ loading: false }))
    );
  }

  private updateState(updates: Partial<ItemsState>) {
    const currentState = this.state$.value;
    this.state$.next({ ...currentState, ...updates });
  }

  public updateItem(id: number, updates: UpdateWarehouseItemDto) {
    this.updateState({ loading: true, error: null });

    return this.itemsApi.update(id, updates).pipe(
      tap(updatedItem => {
        const currentItems = this.state$.value.items;
        // this is costly for large amount of items, in production level scenario we would store the items
        // in a Map<id, WarehouseItem> where the key is their id
        const updatedItems = currentItems.map(item =>
          item.id === id ? updatedItem : item
        );
        this.updateState({ items: updatedItems });
      }),
      catchError(error => {
        const errorMessage = error?.error?.message || 'Failed to update item';
        this.updateState({ error: errorMessage });
        return throwError(() => errorMessage);
      }),
      finalize(() => this.updateState({ loading: false }))
    );
  }

  public deleteItem(id: number) {
    this.updateState({ loading: true, error: null });

    return this.itemsApi.delete(id).pipe(
      tap(() => {
        const currentItems = this.state$.value.items;
        // again, this is O(n) for a simple deletion,
        // can be optimized to O(1) by using a map
        const filteredItems = currentItems.filter(item => item.id !== id);
        this.updateState({ items: filteredItems });
      }),
      catchError(error => {
        this.updateState({ error: 'Failed to delete item' });
        return throwError(() => error);
      }),
      finalize(() => this.updateState({ loading: false }))
    );
  }

  public itemByIdSelector(id: number) {
    return this.items$.pipe(
      map(items => items.find(item => item.id === id))
    );
  }
}
