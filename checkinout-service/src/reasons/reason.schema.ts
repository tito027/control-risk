import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserDocument } from 'control-risk/schemas/user.schema';

export type ReasonDocument = Reason & Document;

@Schema({ timestamps: true })
export class Reason {
  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  time: boolean;

  @Prop({ required: true })
  position: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: UserDocument;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  deletedAt: Date;
}

export const ReasonSchema = SchemaFactory.createForClass(Reason);
