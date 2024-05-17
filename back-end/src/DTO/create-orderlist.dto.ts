import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class CreateOrderlistDto {

    @IsString()
    @IsNotEmpty()
    companyname: string

    @IsArray()
    @IsNotEmpty({ each: true })
    productname: string[];

}
