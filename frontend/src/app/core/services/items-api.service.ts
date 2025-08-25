import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateWarehouseItemDto, UpdateWarehouseItemDto, WarehouseItem } from '../models/warehouse-item.interface';

@Injectable()
export class ItemsApiService {
  constructor(private http: HttpClient) { }

  public getAll(): Observable<WarehouseItem[]> {
    return this.http.get<WarehouseItem[]>('/items');
  }

  public create(item: CreateWarehouseItemDto): Observable<WarehouseItem> {
    return this.http.post<WarehouseItem>('/items', item);
  }

  public update(id: number, item: UpdateWarehouseItemDto): Observable<WarehouseItem> {
    return this.http.patch<WarehouseItem>(`/items/${id}`, item);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`/items/${id}`);
  }
}
