import BaseDao from '@viacation/base-sql-dao-provider';
import { BaseResponseDTO } from '@viacation/base-dto-provider';

class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default class BaseService<AttributesInputT, AttributesOutputT, ResponseT> {
  public dao: BaseDao<AttributesInputT, AttributesOutputT>;
  public dto: BaseResponseDTO<ResponseT>;
  public model: any;

  constructor(dao: BaseDao<AttributesInputT, AttributesOutputT>, dto: BaseResponseDTO<ResponseT>, model: any) {
    this.dao = dao;
    this.dto = dto;
    this.model = model;
  }

  public create = async (payload: AttributesInputT): Promise<AttributesOutputT> => {
    const result: AttributesOutputT = await this.dao.create(payload);
    return result;
  };

  public getById = async (id: number): Promise<AttributesOutputT> => {
    const result: AttributesOutputT = await this.dao.getById(id);
    if (!result) throw new HttpException(400, 'No data found against this id');
    return result;
  };

  public updateById = async (id: number, payload: any): Promise<AttributesOutputT> => {
    delete payload['id'];
    const result = await this.getById(id);
    if (!result) throw new HttpException(400, 'No data found against this id');

    const updatedResult = await this.dao.updateById(id, payload);
    return updatedResult;
  };

  public deleteById = async (id: number): Promise<number> => {
    const result = await this.dao.getById(id);
    if (!result) throw new HttpException(400, 'No data found against this id');
    return this.dao.deleteByID(id);
  };
}
