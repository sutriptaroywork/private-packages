import { Router } from 'express';

import Routes from '.';
import validationMiddleware from './middlewares/validation.middleware';
import { IdentityRequestDto } from '@viacation/base-dto-provider';

export default class BaseRoutes implements Routes {
  public path: string;
  public apiVersion: string;
  public router: Router;
  
  public controller;
  public createRequestDto;
  public updateRequestDto;

  constructor(path: string, controller, createRequestDto, updateRquestDto, version: string = 'v1') {
    this.path = path;
    this.apiVersion = version;
    this.router = Router();

    this.controller = controller;
    this.createRequestDto = createRequestDto;
    this.updateRequestDto = updateRquestDto;

    this.initializeRoutes();
  }

  initializeRoutes = (): void => {
    this.router.post(`/${this.apiVersion}/${this.path}`, validationMiddleware(this.createRequestDto, 'body'), this.controller.create);
    this.router.get(`/${this.apiVersion}/${this.path}/:id`, validationMiddleware(IdentityRequestDto, 'params'), this.controller.getById);
    this.router.patch(`/${this.apiVersion}/${this.path}/:id`, validationMiddleware(this.updateRequestDto, 'body'), this.controller.updateById);
    this.router.delete(`/${this.apiVersion}/${this.path}/:id`, validationMiddleware(IdentityRequestDto, 'params'), this.controller.deleteById);
  };
}
