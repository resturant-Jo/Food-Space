'use strict';

class DataCollection {
  constructor(model) {
    this.model = model;
  }

  async get(id) {
    try {
      let record = null;
      if (id) {
        record = await this.model.findAll({ where: { id: id } });
      } else {
        record = await this.model.findAll();
      }
      return record;
    } catch (error) {
      console.error(
        "can not read the record/s on ",
        this.model.name,
        ` where id=${id}`
      );
    }
  }

  async getfav(id) {
    try {
      let record = null;
      if (id) {
        record = await this.model.findOne({ where: { id } });
      } 
      return record;
    } catch (error) {
      console.error(
        "can not read the record/s on ",
        this.model.name,
        ` where id=${id}`
      );
    }
  }


  async create(record) {
    try {
      return await this.model.create(record);
    } catch (error) {
      console.error("can not create a new record on ", this.model.name);
    }
  }

  async update(id, data) {
    try {
      let currentRecord = await this.model.findOne({ where: { id } });
      let updatedRecord = await currentRecord.update(data);
      return updatedRecord;
    } catch (error) {}
  }

  async delete(id) {
    if (!id) {
      throw new Error("no id provided !, for model ", this.model.name);
    }
    try {
      let deletedRecord = await this.model.destroy({ where: { id } });
      return deletedRecord;
    } catch (error) {
      console.error(
        " can not delete the record on ",
        this.model.name,
        ` where is id=${id}`
      );
    }
  }
}

module.exports = DataCollection;