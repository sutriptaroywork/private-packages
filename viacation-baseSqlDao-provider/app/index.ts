import { Op, Transaction } from 'sequelize';

export default class BaseDao<InputT, OutputT> {
  model: any;
  constructor(model: any) {
    this.model = model;
  }

  public create = async (input: InputT, t: Transaction = null): Promise<OutputT> => {
    const obj = await this.model.create(input, { transaction: t });
    return obj;
  };

  public createMultiple = async (input: InputT[], t: Transaction = null): Promise<any> => {
    const obj = await this.model.bulkCreate(input, { transaction: t });
    return obj;
  };

  public getById = async (id: number, paranoid: boolean = true): Promise<OutputT> => {
    let obj = null;
    if (paranoid) {
      obj = await this.model.findByPk(id);
    } else {
      obj = await this.model.findByPk(id, { paranoid });
    }
    return obj;
  };

  public getAllPaginated = async (
    limit: number,
    offset: number,
    sort: { field: string; order: string } = null,
    filter: object = null,
  ): Promise<{ rows: OutputT[]; count: number }> => {
    const orderArr: Array<Array<string>> = [];
    const where: object = {};
    if (filter) {
      Object.keys(filter).forEach((key) => {
        if (filter[key] !== null) {
          where[key] = {
            [Op.not]: null,
          };
          return;
        }
        if (filter[key] === null) {
          where[key] = {
            [Op.eq]: null,
          };
          return;
        }

        if (typeof filter[key] !== 'undefined') {
          where[key] = {
            [Op.eq]: filter[key],
          };
        }
      });
    }
    if (sort && sort.field && sort.order) {
      orderArr.push([sort.field, sort.order]);
    }
    return this.model.findAndCountAll({
      limit,
      offset,
      where,
      order: orderArr,
    });
  };

  public getAllPaginatedV2 = async (
    limit: number,
    offset: number,
    sort: { field: string; order: string } = null,
    filter: object = null,
  ): Promise<{ rows: OutputT[]; count: number }> => {
    const orderArr: Array<Array<string>> = [];

    if (sort && sort.field && sort.order) {
      orderArr.push([sort.field, sort.order]);
    }

    return this.model.findAndCountAll({
      limit,
      offset,
      where: filter,
      order: orderArr,
    });
  };

  public getAll = async (filter: object = null, sort: { field: string; order: string } = null): Promise<OutputT[]> => {
    const orderArr: Array<Array<string>> = [];
    const where: object = {};
    if (filter) {
      Object.keys(filter).forEach((key) => {
        if (filter[key] !== null) {
          where[key] = {
            [Op.not]: null,
          };
          return;
        }
        if (filter[key] === null) {
          where[key] = {
            [Op.eq]: null,
          };
          return;
        }
        if (typeof filter[key] !== 'undefined') {
          where[key] = {
            [Op.eq]: filter[key],
          };
        }
      });
    }
    if (sort && sort.field && sort.order) {
      orderArr.push([sort.field, sort.order]);
    }
    return this.model.findAll({
      where,
      order: orderArr,
    });
  };

  public getAllByOrder = async (filter: object = null, sort: { field: string; order: string } = null, offset = 0, limit = 10) => {
    const orderArr: Array<Array<string>> = [];
    const where: object = {};
    if (filter) {
      Object.keys(filter).forEach((key) => {
        if (filter[key] !== null) {
          where[key] = {
            [Op.not]: null,
          };
          return;
        }
        if (filter[key] === null) {
          where[key] = {
            [Op.eq]: null,
          };
          return;
        }
        if (typeof filter[key] !== 'undefined') {
          where[key] = {
            [Op.eq]: filter[key],
          };
        }
      });
    }
    if (sort && sort.field && sort.order) {
      orderArr.push([sort.field, sort.order]);
    }
    return this.model.findAll({
      where,
      order: orderArr,
      offset: offset,
      limit: limit,
    });
  };

  public updateById = async (id: number, data: InputT, t: Transaction = null): Promise<OutputT> => {
    await this.model.update(data, {
      where: { id },
      transaction: t,
      returning: true,
      plain: true
    });
    return this.getById(id);
  };

  public update = async (data: InputT, t: Transaction = null): Promise<OutputT> => {
    await (data as any).save({ transaction: t });
    const result = await this.getById((data as any).id);
    return result;
  };

  public deleteByID = async (id: number, t: Transaction = null): Promise<number> => {
    const deleted = await this.model.destroy({ where: { id: id }, transaction: t });
    return deleted;
  };

  public hardDeleteById = async (id: number, t: Transaction = null): Promise<number> => {
    return this.model.destroy({
      where: { id },
      force: true,
      transaction: t,
    });
  };

  public reload = async (data: OutputT) => {
    return (data as any).reload();
  };
}
