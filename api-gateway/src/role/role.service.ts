import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from 'control-risk/schemas/rol.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly model: Model<RoleDocument>,
  ) {}
  private _role: string;

  get role(): string {
    return this._role;
  }

  setRole(id: string) {
    this._role = id;
  }
  async findAllIds(): Promise<string[]> {
    const roles = await this.model.find();
    const ids = [];
    roles.forEach((role) => {
      ids.push(role._id.toString());
    });

    return ids;
  }
}
