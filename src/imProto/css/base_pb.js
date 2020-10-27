// source: css/base.proto
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

var css_enum_pb = require('../css/enum_pb.js');
goog.object.extend(proto, css_enum_pb);
goog.exportSymbol('proto.css.base.MobileBase', null, global);
goog.exportSymbol('proto.css.base.Pagination', null, global);
goog.exportSymbol('proto.css.base.UserInfo', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.css.base.UserInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.css.base.UserInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.css.base.UserInfo.displayName = 'proto.css.base.UserInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.css.base.Pagination = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.css.base.Pagination, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.css.base.Pagination.displayName = 'proto.css.base.Pagination';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.css.base.MobileBase = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.css.base.MobileBase, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.css.base.MobileBase.displayName = 'proto.css.base.MobileBase';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.css.base.UserInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.css.base.UserInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.css.base.UserInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.css.base.UserInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    username: jspb.Message.getFieldWithDefault(msg, 1, ""),
    appkey: jspb.Message.getFieldWithDefault(msg, 2, ""),
    nick: jspb.Message.getFieldWithDefault(msg, 3, ""),
    phone: jspb.Message.getFieldWithDefault(msg, 4, ""),
    originalLink: jspb.Message.getFieldWithDefault(msg, 5, ""),
    thumbnailLink: jspb.Message.getFieldWithDefault(msg, 6, ""),
    created: jspb.Message.getFieldWithDefault(msg, 7, 0),
    modified: jspb.Message.getFieldWithDefault(msg, 8, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.css.base.UserInfo}
 */
proto.css.base.UserInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.css.base.UserInfo;
  return proto.css.base.UserInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.css.base.UserInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.css.base.UserInfo}
 */
proto.css.base.UserInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setUsername(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setAppkey(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setNick(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setPhone(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setOriginalLink(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setThumbnailLink(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setCreated(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setModified(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.css.base.UserInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.css.base.UserInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.css.base.UserInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.css.base.UserInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsername();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAppkey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getNick();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getPhone();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getOriginalLink();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getThumbnailLink();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getCreated();
  if (f !== 0) {
    writer.writeUint64(
      7,
      f
    );
  }
  f = message.getModified();
  if (f !== 0) {
    writer.writeUint64(
      8,
      f
    );
  }
};


/**
 * optional string username = 1;
 * @return {string}
 */
proto.css.base.UserInfo.prototype.getUsername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.css.base.UserInfo.prototype.setUsername = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string appkey = 2;
 * @return {string}
 */
proto.css.base.UserInfo.prototype.getAppkey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.css.base.UserInfo.prototype.setAppkey = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string nick = 3;
 * @return {string}
 */
proto.css.base.UserInfo.prototype.getNick = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.css.base.UserInfo.prototype.setNick = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string phone = 4;
 * @return {string}
 */
proto.css.base.UserInfo.prototype.getPhone = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.css.base.UserInfo.prototype.setPhone = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string original_link = 5;
 * @return {string}
 */
proto.css.base.UserInfo.prototype.getOriginalLink = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.css.base.UserInfo.prototype.setOriginalLink = function(value) {
  jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string thumbnail_link = 6;
 * @return {string}
 */
proto.css.base.UserInfo.prototype.getThumbnailLink = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.css.base.UserInfo.prototype.setThumbnailLink = function(value) {
  jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional uint64 created = 7;
 * @return {number}
 */
proto.css.base.UserInfo.prototype.getCreated = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/** @param {number} value */
proto.css.base.UserInfo.prototype.setCreated = function(value) {
  jspb.Message.setProto3IntField(this, 7, value);
};


/**
 * optional uint64 modified = 8;
 * @return {number}
 */
proto.css.base.UserInfo.prototype.getModified = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/** @param {number} value */
proto.css.base.UserInfo.prototype.setModified = function(value) {
  jspb.Message.setProto3IntField(this, 8, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.css.base.Pagination.prototype.toObject = function(opt_includeInstance) {
  return proto.css.base.Pagination.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.css.base.Pagination} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.css.base.Pagination.toObject = function(includeInstance, msg) {
  var f, obj = {
    pageSize: jspb.Message.getFieldWithDefault(msg, 1, 0),
    pageNum: jspb.Message.getFieldWithDefault(msg, 2, 0),
    orderStr: jspb.Message.getFieldWithDefault(msg, 3, ""),
    pagingSwitch: jspb.Message.getBooleanFieldWithDefault(msg, 4, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.css.base.Pagination}
 */
proto.css.base.Pagination.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.css.base.Pagination;
  return proto.css.base.Pagination.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.css.base.Pagination} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.css.base.Pagination}
 */
proto.css.base.Pagination.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPageSize(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPageNum(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setOrderStr(value);
      break;
    case 4:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setPagingSwitch(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.css.base.Pagination.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.css.base.Pagination.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.css.base.Pagination} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.css.base.Pagination.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPageSize();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getPageNum();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getOrderStr();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getPagingSwitch();
  if (f) {
    writer.writeBool(
      4,
      f
    );
  }
};


/**
 * optional int32 page_size = 1;
 * @return {number}
 */
proto.css.base.Pagination.prototype.getPageSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.css.base.Pagination.prototype.setPageSize = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional int32 page_num = 2;
 * @return {number}
 */
proto.css.base.Pagination.prototype.getPageNum = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.css.base.Pagination.prototype.setPageNum = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string order_str = 3;
 * @return {string}
 */
proto.css.base.Pagination.prototype.getOrderStr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.css.base.Pagination.prototype.setOrderStr = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional bool paging_switch = 4;
 * @return {boolean}
 */
proto.css.base.Pagination.prototype.getPagingSwitch = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 4, false));
};


/** @param {boolean} value */
proto.css.base.Pagination.prototype.setPagingSwitch = function(value) {
  jspb.Message.setProto3BooleanField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.css.base.MobileBase.prototype.toObject = function(opt_includeInstance) {
  return proto.css.base.MobileBase.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.css.base.MobileBase} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.css.base.MobileBase.toObject = function(includeInstance, msg) {
  var f, obj = {
    sdkVersion: jspb.Message.getFieldWithDefault(msg, 1, ""),
    languageType: jspb.Message.getFieldWithDefault(msg, 2, ""),
    netType: jspb.Message.getFieldWithDefault(msg, 3, 0),
    osVersion: jspb.Message.getFieldWithDefault(msg, 4, ""),
    clientType: jspb.Message.getFieldWithDefault(msg, 5, 0),
    device: jspb.Message.getFieldWithDefault(msg, 6, ""),
    imei: jspb.Message.getFieldWithDefault(msg, 7, ""),
    fireBaseDevice: jspb.Message.getFieldWithDefault(msg, 8, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.css.base.MobileBase}
 */
proto.css.base.MobileBase.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.css.base.MobileBase;
  return proto.css.base.MobileBase.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.css.base.MobileBase} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.css.base.MobileBase}
 */
proto.css.base.MobileBase.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setSdkVersion(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLanguageType(value);
      break;
    case 3:
      var value = /** @type {!proto.css.enum.ENetworkType} */ (reader.readEnum());
      msg.setNetType(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setOsVersion(value);
      break;
    case 5:
      var value = /** @type {!proto.css.enum.EClientType} */ (reader.readEnum());
      msg.setClientType(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setDevice(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setImei(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setFireBaseDevice(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.css.base.MobileBase.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.css.base.MobileBase.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.css.base.MobileBase} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.css.base.MobileBase.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSdkVersion();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getLanguageType();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getNetType();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
  f = message.getOsVersion();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getClientType();
  if (f !== 0.0) {
    writer.writeEnum(
      5,
      f
    );
  }
  f = message.getDevice();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getImei();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getFireBaseDevice();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
};


/**
 * optional string sdk_version = 1;
 * @return {string}
 */
proto.css.base.MobileBase.prototype.getSdkVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.css.base.MobileBase.prototype.setSdkVersion = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string language_type = 2;
 * @return {string}
 */
proto.css.base.MobileBase.prototype.getLanguageType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.css.base.MobileBase.prototype.setLanguageType = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional css.enum.ENetworkType net_type = 3;
 * @return {!proto.css.enum.ENetworkType}
 */
proto.css.base.MobileBase.prototype.getNetType = function() {
  return /** @type {!proto.css.enum.ENetworkType} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {!proto.css.enum.ENetworkType} value */
proto.css.base.MobileBase.prototype.setNetType = function(value) {
  jspb.Message.setProto3EnumField(this, 3, value);
};


/**
 * optional string os_version = 4;
 * @return {string}
 */
proto.css.base.MobileBase.prototype.getOsVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.css.base.MobileBase.prototype.setOsVersion = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional css.enum.EClientType client_type = 5;
 * @return {!proto.css.enum.EClientType}
 */
proto.css.base.MobileBase.prototype.getClientType = function() {
  return /** @type {!proto.css.enum.EClientType} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/** @param {!proto.css.enum.EClientType} value */
proto.css.base.MobileBase.prototype.setClientType = function(value) {
  jspb.Message.setProto3EnumField(this, 5, value);
};


/**
 * optional string device = 6;
 * @return {string}
 */
proto.css.base.MobileBase.prototype.getDevice = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.css.base.MobileBase.prototype.setDevice = function(value) {
  jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string imei = 7;
 * @return {string}
 */
proto.css.base.MobileBase.prototype.getImei = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/** @param {string} value */
proto.css.base.MobileBase.prototype.setImei = function(value) {
  jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * optional string fire_base_device = 8;
 * @return {string}
 */
proto.css.base.MobileBase.prototype.getFireBaseDevice = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/** @param {string} value */
proto.css.base.MobileBase.prototype.setFireBaseDevice = function(value) {
  jspb.Message.setProto3StringField(this, 8, value);
};


goog.object.extend(exports, proto.css.base);
