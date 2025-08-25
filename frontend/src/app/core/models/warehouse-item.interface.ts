export interface WarehouseItem {
    imageUrl?: string
    id: number
    name: string
    description?: string
    quantity?: number
    unitPrice: number
}

export type CreateWarehouseItemDto = Omit<WarehouseItem, 'id'>;
export type UpdateWarehouseItemDto = Partial<CreateWarehouseItemDto>;
