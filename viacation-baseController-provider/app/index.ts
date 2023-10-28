import { Response, Request, NextFunction } from 'express';

export default class BaseController<ServiceT> {
  public service: any;

  constructor(Service: ServiceT) {
    this.service = Service;
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: number = Number((req.params as any).id);
      const result = await this.service.getById(id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  public updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: number = Number((req.params as any).id);
      const result = await this.service.updateById(id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  public deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: number = Number((req.params as any).id);
      await this.service.deleteById(id);
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}
