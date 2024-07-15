import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const TokenPayload = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();
    return user;
  }
);
