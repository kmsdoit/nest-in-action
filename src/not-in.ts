import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";

export function NotIn(property : string, validationOptions?:ValidationOptions) { // 데코레이터의 인수는 객체에서 참조하려고 하는 다른 속성의 이름과 ValidationOptions를 받습니다
    return (object : Object, propertyName : string) => {
        registerDecorator({
            name : 'NotIn',
            target : object.constructor,
            propertyName,
            options : validationOptions,
            constraints : [property],
            validator : {
                validate(value : any, args : ValidationArguments) {
                    const [releatedProperyName] = args.constraints
                    const relatedValue = (args.object as any)[releatedProperyName]
                    return typeof value === 'string' && typeof relatedValue === 'string' &&
                        !relatedValue.includes(value)
                }
            }
        })
    }
}
