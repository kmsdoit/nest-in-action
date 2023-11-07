import {IsEmail, IsString, Matches, MAX_LENGTH, MaxLength, MinLength} from "class-validator";
import {Transform} from "class-transformer";
import {BadRequestException} from "@nestjs/common";
import {NotIn} from "../../not-in";

export class CreateUserDto {
    @Transform(params => {
        return params.value.trim()
    })
    @NotIn('password', {message : 'password는 name과 같은 문자열에 포함할 수 없습니다'})
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    readonly name : string;
    @IsString()
    @IsEmail()
    @MaxLength(60)
    readonly email : string;
    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    readonly password : string;
}
