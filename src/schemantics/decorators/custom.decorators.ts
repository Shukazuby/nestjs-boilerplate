import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseInterceptors,
  } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

export const MustBeSubscribed = (status: boolean) =>
SetMetadata('isSubscribed', status);

///   Add Decorator For AdminVerified