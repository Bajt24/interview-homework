import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateShipmentDto, Shipment } from '../models/warehouse-shipment.interface';

@Injectable()
export class ShipmentsApiService {
  constructor(private http: HttpClient) { }

  public getAll(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>('/shipments');
  }

  public create(shipment: CreateShipmentDto): Observable<Shipment> {
    return this.http.post<Shipment>('/shipments', shipment);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`/shipments/${id}`);
  }
}
