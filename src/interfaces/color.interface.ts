export interface IColor {

    id: string,
    name: string,

    // hex values with #-prefix
    value: string,
    
    // gradient only
    angle?: number,
    values?: string[]
}