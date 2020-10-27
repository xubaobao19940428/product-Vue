// source: css/enum.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.css.enum.ContentType', null, global);
goog.exportSymbol('proto.css.enum.CrewType', null, global);
goog.exportSymbol('proto.css.enum.ECallMsgType', null, global);
goog.exportSymbol('proto.css.enum.EClientType', null, global);
goog.exportSymbol('proto.css.enum.EEnable', null, global);
goog.exportSymbol('proto.css.enum.EGroupType', null, global);
goog.exportSymbol('proto.css.enum.ELanguageType', null, global);
goog.exportSymbol('proto.css.enum.ENetworkType', null, global);
goog.exportSymbol('proto.css.enum.EReaded', null, global);
/**
 * @enum {number}
 */
proto.css.enum.EEnable = {
  DISABLED: 0,
  ENABLED: 1
};

/**
 * @enum {number}
 */
proto.css.enum.EReaded = {
  UNREADED: 0,
  READED: 1,
  SENDED: 2
};

/**
 * @enum {number}
 */
proto.css.enum.EClientType = {
  UNKNOWN: 0,
  IOS: 1,
  ANDROID: 2,
  WEB: 3,
  SYSTEM: 4
};

/**
 * @enum {number}
 */
proto.css.enum.ENetworkType = {
  WIFI: 0,
  M4G: 1,
  M2G: 2
};

/**
 * @enum {number}
 */
proto.css.enum.ELanguageType = {
  EN: 0,
  CN: 1
};

/**
 * @enum {number}
 */
proto.css.enum.CrewType = {
  OWNER: 0,
  ADMIN: 1,
  MEMBER: 2
};

/**
 * @enum {number}
 */
proto.css.enum.ECallMsgType = {
  INVITE: 0,
  CONNECT: 1,
  BUSY: 2,
  CANCEL: 3,
  REFUSE: 4,
  BYE: 5,
  REINVITE: 6
};

/**
 * @enum {number}
 */
proto.css.enum.EGroupType = {
  NORMAL: 0,
  FAMILY_NETWORK: 1,
  AND_FAMILY_GROUP: 2
};

/**
 * @enum {number}
 */
proto.css.enum.ContentType = {
  DEFAULT: 0,
  PIC: 1,
  AUDIO: 2,
  VIDEO: 3,
  FILE: 4,
  URL: 5,
  TEXT: 6
};

goog.object.extend(exports, proto.css.enum);
