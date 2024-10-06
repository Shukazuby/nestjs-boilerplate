import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AppRole, DefaultPassportLink } from '../../utils/utils.constant';


export enum Gender {
  WOMAN = "woman",
  MAN = "man",
  NON_BINARY = "non_binary",
}

export enum GenderDeet {
  STAIGHTWOMAN = "straight_woman",
  TRANSWOMAN = "trans_woman",
  CISWOMAN = "cis_woman",
  FEMININE = "feminine_presenting",
  STAIGHTMEN = "straight_men",
  TRANSMEN = "trans_men",
  CISMEN = "cis_men",
  MASCULINE = "masculine_presenting",
}
export class Realtionshipgoals {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  description: string;
}
export class GenderDetails {
  @ApiProperty()
  @Prop()
  gender: string;
  @ApiProperty()
  @Prop()
  type?: string[];
}

export class mode {
  @ApiProperty()
  @Prop({default: false})
  hideWhenOnline: boolean;

  @ApiProperty()
  @Prop({default: false})
  profileIncognito: boolean;

}

export class notiOptions {
  @ApiProperty()
  @Prop({default: false})
  allowPushNotifications: boolean;

  // @ApiProperty()
  // @Prop({default: false})
  // allowSmsNotifications: boolean;

  @ApiProperty()
  @Prop({default: false})
  allowEmailNotifications: boolean;

  @ApiProperty()
  @Prop({default: false})
  allowInAppNotifications: boolean;


}

export class notificationSettings {
  @ApiProperty({ type: notiOptions })
  @Prop(notiOptions)
  messages: notiOptions;

  @ApiProperty({ type: notiOptions })
  @Prop(notiOptions)
  AppNames: notiOptions;

  @ApiProperty({ type: notiOptions })
  @Prop(notiOptions)
  calls: notiOptions;

  @ApiProperty({ type: notiOptions })
  @Prop(notiOptions)
  profileVisitors: notiOptions;

  @ApiProperty({ type: notiOptions })
  @Prop(notiOptions)
  promo: notiOptions;

  @ApiProperty({ type: notiOptions })
  @Prop(notiOptions)
  researchSurveys: notiOptions;

}

export class privacySettings {
  @ApiProperty()
  @Prop({default: false})
  isFaceId: boolean;

  @ApiProperty()
  @Prop({default: false})
  allowShowLocation: boolean;

  @ApiProperty()
  @Prop({default: false})
  allowShowOnlineStatus: boolean;

  @ApiProperty()
  @Prop({default: false})
  blurProfilePic: boolean;

  @ApiProperty()
  @Prop({default: false})
  limitProfileVisit: boolean;

  @ApiProperty()
  @Prop()
  appIcon: string;

  @ApiProperty()
  @Prop()
  messageHistory: string;

  @ApiProperty({ type: mode })
  @Prop(mode)
  invisibleMode: mode;

  @ApiProperty()
  @Prop({default: false})
  removeAds: boolean;

}

export class customizeSettings {
  @ApiProperty()
  @Prop()
  showOnline: string;

  @ApiProperty()
  @Prop()
  messageYou: string;

  @ApiProperty()
  @Prop()
  callYou: string;

  @ApiProperty()
  @Prop()
  notifyYou: string[];

}

export class detailsSettings {
@ApiProperty()
@Prop()  
smoke: string;

@ApiProperty()
@Prop()  
drink: string;

@ApiProperty()
@Prop()  
height: string;

@ApiProperty()
@Prop()  
bio: string;

@ApiProperty()
@Prop()  
education: string;

@ApiProperty()
@Prop()  
zodiac: string;

@ApiProperty()
@Prop()  
familyPlan: string;

@ApiProperty()
@Prop() 
pet: string;

@ApiProperty()
@Prop()  
religion: string;

@ApiProperty()
@Prop()  
sexuality: string;

@ApiProperty()
@Prop()  
workout: string;

}

export class accountSettings {
  @ApiProperty()
  @Prop({default: false})
  hide: boolean;

  @ApiProperty()
  @Prop()
  access: string;
}
@Schema()
export class Users {
  @ApiProperty()
  @Prop({default: null})
  firstName: string;

  @Prop({default: null})
  lastName: string;

  @Prop({default: null})
  userName: string;

  @Prop({default: null})
  profileImageUrl: string;

  @Prop({default: null})
  password: string;

  @Prop()
  email: string;

  @Prop({default: null})
  dob: Date;

  @Prop({default: null})
  age: number;

  @Prop({default: null})
  phoneNumber: string;

  @Prop({default: false})
  status: Boolean;

  @ApiProperty()
  @Prop({ default: AppRole.USER })
  role: AppRole;

  @Prop({default: null})
  country: string;

  @Prop({default: null})
  uniqueVerificationCode: string;
  
  @Prop({default: null})
  deviceId: string;

  @Prop({default: null})
  longitude: number;

  @Prop({default: null})
  latitude: number;

  @Prop({default: null})
  userGallery: string[];

  @ApiProperty({ default: null, description: 'Location coordinates [longitude, latitude]' })
  @Prop({ type: [Number], index: '2dsphere' })
  location: [number, number];

  @ApiProperty({ type: GenderDetails }) 
  @Prop(GenderDetails)
  genderDetail: GenderDetails;

  @Prop({default: null})
  interests: string[];

  @ApiProperty({ type: [Realtionshipgoals] })
  @Prop([Realtionshipgoals])
  relationshipStatus: Realtionshipgoals[];

  @Prop({default: false})
  AppNamePhotoAccess: boolean;

  @Prop({default: false})
  AppNameLocationAccess: boolean;

  @Prop({default: false})
  isPhoneVerified: boolean;

  @Prop({default: false})
  isGenderChanged: boolean;

  @Prop({default: false})
  isShowGender: boolean;

  @Prop({default: false})
  isSubscribed: boolean;

  @Prop({default: 'Basic'})
  subscriber_type: string;

  @Prop()
  sub_interval: string;

  @Prop()
  customer_code: string;

  @Prop({ ref: 'Plan'})
  plan: string;

  @Prop()
  plan_interval: string;

  @Prop()
  sub_expiration: Date;

  @Prop({default: 0})
  credits: number;

  @Prop()
  sentOTP: string;

  @ApiProperty({ type: detailsSettings })
  @Prop(detailsSettings)
  moreInfo: detailsSettings;

  @ApiProperty({ type: privacySettings })
  @Prop(privacySettings)
  privacy: privacySettings;

  @ApiProperty({ type: notificationSettings })
  @Prop(notificationSettings)
  notificication: notificationSettings;

  @ApiProperty({ type: customizeSettings})
  @Prop(customizeSettings)
  customizeExperience: customizeSettings;

  @ApiProperty({ type: accountSettings})
  @Prop(accountSettings)
  account: accountSettings;

  @Prop({default: null})
  externalUserId: string;

  @Prop({default: 'Active'})
  account_status: string;

  @Prop({default: Date.now}) 
  lastLogged: Date;

  @Prop()
  permissions?: string[]

  @Prop({default: Date.now}) 
  createdAt: Date;

  @Prop({default: Date.now}) 
  updatedAt: Date;

}

export type UsersDocument = Users & Document;
export const UsersSchema = SchemaFactory.createForClass(Users);
