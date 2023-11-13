import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersDto } from '../common/dto/users.dto';
import * as bcrypt from 'bcrypt';
import { UserIdDTO } from 'src/common/dto/agents.dto';
import { User, UserDocument } from 'control-risk/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}
  async hashPassword(password: string) {
    return bcrypt.hashSync(password, 12);
  }
  async create(user: UsersDto): Promise<UserDocument> {
    const hash = await this.hashPassword(user.password);
    const newUser = new this.model({ ...user, password: hash });
    return newUser.save();
  }
  async findAll(): Promise<UserDocument[]> {
    return this.model.find().select('-password');
  }
  async findOne(carnet: string): Promise<UserDocument> {
    return await (this.model.findOne({ carnet }).select('-password').exec() ||
      this.model.findOne({ username: carnet }).select('-password').exec());
  }

  async update(user: UsersDto, id: string): Promise<UserDocument> {
    const hash = await this.hashPassword(user.password);
    const updateUser = { ...user, password: hash };
    return this.model
      .findByIdAndUpdate(id, updateUser, { new: true })
      .select('-password')
      .exec();
  }
  async delete(id: string, flag: boolean): Promise<any> {
    return flag
      ? this.model
          .findOneAndUpdate({ _id: id }, { $set: { active: false } })
          .select('-password')
      : this.model.findByIdAndDelete(id);
  }
  async findByCarnet(carnet: string): Promise<any> {
    return this.model.findOne({ carnet, active: true });
  }
  async checkPassword(password: string, passwordDb: string): Promise<boolean> {
    return bcrypt.compare(password, passwordDb);
  }
  async findAuth(code: string): Promise<UserDocument> {
    return this.model.findOne({ carnet: code }).populate('role');
  }

  async verifyToken(carnet: string, token: string) {
    return await this.model.findOne({ carnet, token, active: true });
  }

  async refreshToken(carnet: string, token: string) {
    return await this.model.findOneAndUpdate(
      { carnet, active: true },
      { token },
      { fields: '-password', new: true },
    );
  }

  async singOut(carnet: string) {
    return await this.model.findOneAndUpdate(
      { carnet, active: true },
      { token: null, connected: false },
      { fields: '-token -password' },
    );
  }

  async verifyRoles(carnet: string, roles: string[]) {
    const user = await this.model
      .findOne({ carnet, active: true })
      .populate('role');
    return roles.includes(user.role.name);
  }
}
