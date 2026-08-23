import {
  registerDecorator,
  type ValidationOptions,
  type ValidationArguments,
} from "class-validator";

/** Accepts a JSON string or number that converts to a positive BigInt. */
export function IsBigInt(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isBigInt",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          try {
            if (typeof value === "string") return /^\d+$/.test(value);
            if (typeof value === "number") return Number.isInteger(value) && value > 0;
            return false;
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be an integer amount in ARTH minor units`;
        },
      },
    });
  };
}
