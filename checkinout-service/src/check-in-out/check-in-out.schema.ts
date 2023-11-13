import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ReasonDocument } from 'src/reasons/reason.schema';
import { PhysicalPositionDocument } from 'control-risk/schemas/physicalPosition.schema';
import { UserDocument } from 'control-risk/schemas/user.schema';
import { CheckInOut as ICheckInOut } from 'control-risk/checkInOut.schema';

export type CheckInOutDocument = CheckInOut & Document;

@Schema({ timestamps: true })
export class CheckInOut implements ICheckInOut {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhysicalPosition',
    required: true,
  })
  physicalPosition: PhysicalPositionDocument | string;

  @Prop({ required: true })
  status: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reason',
  })
  positionReason: ReasonDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reason',
  })
  timeReason: ReasonDocument;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop()
  aditionalInformation: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: UserDocument;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  deletedAt: Date;
}

export const CheckInOutSchema = SchemaFactory.createForClass(CheckInOut);
