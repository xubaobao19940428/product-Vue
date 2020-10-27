// source: common/enum.proto
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

goog.exportSymbol('proto.common.enum.AttributeEnum', null, global);
goog.exportSymbol('proto.common.enum.AttributeEnum.Customize', null, global);
goog.exportSymbol('proto.common.enum.AttributeEnum.ShowStatus', null, global);
goog.exportSymbol('proto.common.enum.AttributeEnum.ValueType', null, global);
goog.exportSymbol('proto.common.enum.CategoryEnum', null, global);
goog.exportSymbol('proto.common.enum.CategoryEnum.CateLevel', null, global);
goog.exportSymbol('proto.common.enum.CategoryEnum.CateType', null, global);
goog.exportSymbol('proto.common.enum.CategoryEnum.ShowStatus', null, global);
goog.exportSymbol('proto.common.enum.CategoryEnum.SortDirection', null, global);
goog.exportSymbol('proto.common.enum.ErpEnum', null, global);
goog.exportSymbol('proto.common.enum.ErpEnum.IncomeStatus', null, global);
goog.exportSymbol('proto.common.enum.ErpEnum.InventoryOperType', null, global);
goog.exportSymbol('proto.common.enum.ErpEnum.InventoryRecordType', null, global);
goog.exportSymbol('proto.common.enum.ErpEnum.OutOrderStatus', null, global);
goog.exportSymbol('proto.common.enum.ErpEnum.QtyType', null, global);
goog.exportSymbol('proto.common.enum.ErpEnum.SignStatus', null, global);
goog.exportSymbol('proto.common.enum.ErpEnum.SyncStatus', null, global);
goog.exportSymbol('proto.common.enum.MarketingEnum', null, global);
goog.exportSymbol('proto.common.enum.MarketingEnum.ActiveStatus', null, global);
goog.exportSymbol('proto.common.enum.MarketingEnum.ActiveType', null, global);
goog.exportSymbol('proto.common.enum.MarketingEnum.PreheatType', null, global);
goog.exportSymbol('proto.common.enum.MsggwEnum', null, global);
goog.exportSymbol('proto.common.enum.MsggwEnum.DeviceType', null, global);
goog.exportSymbol('proto.common.enum.MsggwEnum.PushType', null, global);
goog.exportSymbol('proto.common.enum.MsggwEnum.ReadStatus', null, global);
goog.exportSymbol('proto.common.enum.OrderEnum', null, global);
goog.exportSymbol('proto.common.enum.OrderEnum.AfterSaleType', null, global);
goog.exportSymbol('proto.common.enum.OrderEnum.AfterStatus', null, global);
goog.exportSymbol('proto.common.enum.OrderEnum.DeliveryType', null, global);
goog.exportSymbol('proto.common.enum.OrderEnum.DiscountType', null, global);
goog.exportSymbol('proto.common.enum.OrderEnum.GiftType', null, global);
goog.exportSymbol('proto.common.enum.OrderEnum.OrderStatus', null, global);
goog.exportSymbol('proto.common.enum.OrderEnum.OrderType', null, global);
goog.exportSymbol('proto.common.enum.OrderEnum.PayWay', null, global);
goog.exportSymbol('proto.common.enum.OrderEnum.ProductStatus', null, global);
goog.exportSymbol('proto.common.enum.OrderEnum.RefundType', null, global);
goog.exportSymbol('proto.common.enum.PledgeEnum', null, global);
goog.exportSymbol('proto.common.enum.PledgeEnum.PaymentType', null, global);
goog.exportSymbol('proto.common.enum.PledgeEnum.RangeType', null, global);
goog.exportSymbol('proto.common.enum.PledgeEnum.ShowType', null, global);
goog.exportSymbol('proto.common.enum.PriceTemplateEnum', null, global);
goog.exportSymbol('proto.common.enum.PriceTemplateEnum.EffectStatus', null, global);
goog.exportSymbol('proto.common.enum.ProductEnum', null, global);
goog.exportSymbol('proto.common.enum.ProductEnum.Currency', null, global);
goog.exportSymbol('proto.common.enum.ProductEnum.DeliveryWay', null, global);
goog.exportSymbol('proto.common.enum.ProductEnum.FreightType', null, global);
goog.exportSymbol('proto.common.enum.ProductEnum.Nature', null, global);
goog.exportSymbol('proto.common.enum.ProductEnum.ProductLabel', null, global);
goog.exportSymbol('proto.common.enum.ProductEnum.ProductPattern', null, global);
goog.exportSymbol('proto.common.enum.ProductEnum.ProductType', null, global);
goog.exportSymbol('proto.common.enum.ProductEnum.QueryTimeType', null, global);
goog.exportSymbol('proto.common.enum.ProductEnum.SaleStatus', null, global);
goog.exportSymbol('proto.common.enum.ProductEnum.SaleWay', null, global);
goog.exportSymbol('proto.common.enum.ProductEnum.ShelveStatus', null, global);
goog.exportSymbol('proto.common.enum.PromotionEnum', null, global);
goog.exportSymbol('proto.common.enum.PromotionEnum.DiscountMutexType', null, global);
goog.exportSymbol('proto.common.enum.PromotionEnum.FreeShippingType', null, global);
goog.exportSymbol('proto.common.enum.PromotionEnum.PromotionProductType', null, global);
goog.exportSymbol('proto.common.enum.PromotionEnum.PromotionType', null, global);
goog.exportSymbol('proto.common.enum.PurchaseOrderEnum', null, global);
goog.exportSymbol('proto.common.enum.PurchaseOrderEnum.DeliveWay', null, global);
goog.exportSymbol('proto.common.enum.PurchaseOrderEnum.UseFingoSystem', null, global);
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
proto.common.enum.MarketingEnum = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.common.enum.MarketingEnum, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.common.enum.MarketingEnum.displayName = 'proto.common.enum.MarketingEnum';
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
proto.common.enum.PromotionEnum = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.common.enum.PromotionEnum, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.common.enum.PromotionEnum.displayName = 'proto.common.enum.PromotionEnum';
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
proto.common.enum.OrderEnum = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.common.enum.OrderEnum, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.common.enum.OrderEnum.displayName = 'proto.common.enum.OrderEnum';
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
proto.common.enum.ProductEnum = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.common.enum.ProductEnum, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.common.enum.ProductEnum.displayName = 'proto.common.enum.ProductEnum';
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
proto.common.enum.CategoryEnum = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.common.enum.CategoryEnum, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.common.enum.CategoryEnum.displayName = 'proto.common.enum.CategoryEnum';
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
proto.common.enum.AttributeEnum = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.common.enum.AttributeEnum, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.common.enum.AttributeEnum.displayName = 'proto.common.enum.AttributeEnum';
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
proto.common.enum.MsggwEnum = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.common.enum.MsggwEnum, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.common.enum.MsggwEnum.displayName = 'proto.common.enum.MsggwEnum';
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
proto.common.enum.PurchaseOrderEnum = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.common.enum.PurchaseOrderEnum, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.common.enum.PurchaseOrderEnum.displayName = 'proto.common.enum.PurchaseOrderEnum';
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
proto.common.enum.PledgeEnum = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.common.enum.PledgeEnum, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.common.enum.PledgeEnum.displayName = 'proto.common.enum.PledgeEnum';
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
proto.common.enum.ErpEnum = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.common.enum.ErpEnum, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.common.enum.ErpEnum.displayName = 'proto.common.enum.ErpEnum';
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
proto.common.enum.PriceTemplateEnum = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.common.enum.PriceTemplateEnum, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.common.enum.PriceTemplateEnum.displayName = 'proto.common.enum.PriceTemplateEnum';
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
proto.common.enum.MarketingEnum.prototype.toObject = function(opt_includeInstance) {
  return proto.common.enum.MarketingEnum.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.common.enum.MarketingEnum} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.MarketingEnum.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.common.enum.MarketingEnum}
 */
proto.common.enum.MarketingEnum.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.common.enum.MarketingEnum;
  return proto.common.enum.MarketingEnum.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.common.enum.MarketingEnum} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.common.enum.MarketingEnum}
 */
proto.common.enum.MarketingEnum.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.common.enum.MarketingEnum.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.common.enum.MarketingEnum.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.common.enum.MarketingEnum} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.MarketingEnum.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


/**
 * @enum {number}
 */
proto.common.enum.MarketingEnum.ActiveStatus = {
  NOT_STARTED: 0,
  PREHEATING: 1,
  IN_PROGRESS: 2,
  FINISHED: 3
};

/**
 * @enum {number}
 */
proto.common.enum.MarketingEnum.ActiveType = {
  OTHER: 0,
  HOT_SALE: 1,
  MARKETING_ACTIVE: 2,
  TIME_PRICE: 3,
  LIVE: 4
};

/**
 * @enum {number}
 */
proto.common.enum.MarketingEnum.PreheatType = {
  NOT_PREHEAT: 0,
  PREHEAT: 1
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
proto.common.enum.PromotionEnum.prototype.toObject = function(opt_includeInstance) {
  return proto.common.enum.PromotionEnum.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.common.enum.PromotionEnum} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.PromotionEnum.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.common.enum.PromotionEnum}
 */
proto.common.enum.PromotionEnum.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.common.enum.PromotionEnum;
  return proto.common.enum.PromotionEnum.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.common.enum.PromotionEnum} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.common.enum.PromotionEnum}
 */
proto.common.enum.PromotionEnum.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.common.enum.PromotionEnum.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.common.enum.PromotionEnum.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.common.enum.PromotionEnum} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.PromotionEnum.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


/**
 * @enum {number}
 */
proto.common.enum.PromotionEnum.PromotionType = {
  FULL_REDUCTION: 0,
  EVERY_FULL_REDUCTION: 1,
  M_PIECE_N_YUAN: 2,
  M_YUAN_N_DISCOUNT: 3,
  ONLY_M_PIECE_N_YUAN: 4,
  ONLY_M_PIECE_N_DISCOUNT: 5,
  FREE_SHIPPING: 6
};

/**
 * @enum {number}
 */
proto.common.enum.PromotionEnum.PromotionProductType = {
  MANUAL_ENTRY: 0,
  BIND_ACTIVE: 1,
  PRODUCT_GROUP_LABEL: 2,
  APP_CATEGORY: 3,
  BACKGROUND_CATEGORY: 4,
  BRAND_ID: 5
};

/**
 * @enum {number}
 */
proto.common.enum.PromotionEnum.DiscountMutexType = {
  NOT_MUTEX: 0,
  PROMOTION_MUTEX: 1,
  COUPON_MUTEX: 2,
  FREE_SHIPPING_NOT_MUTEX: 3
};

/**
 * @enum {number}
 */
proto.common.enum.PromotionEnum.FreeShippingType = {
  PIECE_UNIT: 0,
  MONEY_UNIT: 1
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
proto.common.enum.OrderEnum.prototype.toObject = function(opt_includeInstance) {
  return proto.common.enum.OrderEnum.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.common.enum.OrderEnum} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.OrderEnum.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.common.enum.OrderEnum}
 */
proto.common.enum.OrderEnum.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.common.enum.OrderEnum;
  return proto.common.enum.OrderEnum.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.common.enum.OrderEnum} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.common.enum.OrderEnum}
 */
proto.common.enum.OrderEnum.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.common.enum.OrderEnum.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.common.enum.OrderEnum.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.common.enum.OrderEnum} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.OrderEnum.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


/**
 * @enum {number}
 */
proto.common.enum.OrderEnum.OrderType = {
  ORDINARY: 0,
  BIG_GIFT: 1,
  SMALL_GIFT: 2,
  VIRTUAL: 9
};

/**
 * @enum {number}
 */
proto.common.enum.OrderEnum.GiftType = {
  GITF_TYPE0: 0,
  NOT_GIFT: 1,
  PRIME: 2,
  SMALL: 3,
  BIG: 4
};

/**
 * @enum {number}
 */
proto.common.enum.OrderEnum.DeliveryType = {
  DELIVERY_TYPE0: 0,
  SELF_PICK_UP: 1,
  EXPRESS: 2
};

/**
 * @enum {number}
 */
proto.common.enum.OrderEnum.OrderStatus = {
  WAIT_FOR_PAY: 0,
  WAIT_FOR_SHIPPING: 1,
  WAIT_FOR_RECEIVING: 2,
  TRADE_SUCCESS: 3,
  TRADE_CLOSED: 4
};

/**
 * @enum {number}
 */
proto.common.enum.OrderEnum.DiscountType = {
  COUPON: 0,
  PROMOTION: 1,
  ACTIVITY: 2
};

/**
 * @enum {number}
 */
proto.common.enum.OrderEnum.PayWay = {
  CREDIT: 0,
  MOLPAY: 1
};

/**
 * @enum {number}
 */
proto.common.enum.OrderEnum.AfterStatus = {
  UNDER_REVIEW: 0,
  APPROVED: 1,
  AFTER_SUCCESS: 2,
  AFTER_CLOSE: 3,
  AFTER_REFUSED: 4,
  AFTER_CANCELED: 5
};

/**
 * @enum {number}
 */
proto.common.enum.OrderEnum.AfterSaleType = {
  CANCEL_ORDER: 0,
  RETURN: 1,
  EXCHANGE: 2
};

/**
 * @enum {number}
 */
proto.common.enum.OrderEnum.RefundType = {
  TO_BANK_CARD: 0,
  TO_INTEGRATION: 1
};

/**
 * @enum {number}
 */
proto.common.enum.OrderEnum.ProductStatus = {
  SHOPPING: 0,
  REFUND: 1,
  REFUND_SUCCESS: 2
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
proto.common.enum.ProductEnum.prototype.toObject = function(opt_includeInstance) {
  return proto.common.enum.ProductEnum.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.common.enum.ProductEnum} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.ProductEnum.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.common.enum.ProductEnum}
 */
proto.common.enum.ProductEnum.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.common.enum.ProductEnum;
  return proto.common.enum.ProductEnum.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.common.enum.ProductEnum} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.common.enum.ProductEnum}
 */
proto.common.enum.ProductEnum.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.common.enum.ProductEnum.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.common.enum.ProductEnum.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.common.enum.ProductEnum} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.ProductEnum.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


/**
 * @enum {number}
 */
proto.common.enum.ProductEnum.ShelveStatus = {
  SHELF_STATUS_NULL: 0,
  ON_SHELVE: 1,
  OFF_SHELVE: 2
};

/**
 * @enum {number}
 */
proto.common.enum.ProductEnum.SaleStatus = {
  SALE_NULL: 0,
  ON_SALE: 1,
  OFF_SALE: 2
};

/**
 * @enum {number}
 */
proto.common.enum.ProductEnum.ProductType = {
  COMMON_GOODS: 0,
  SMALL_GIFT_PACKAGE: 1,
  BIG_GIFT_PACKAGE: 2,
  COURSE_PRODUCT: 3,
  GROUP_PRODUCT: 4,
  LIVE_PRODUCT: 5,
  ACTIVE_PRODUCT: 6,
  PRIME_PRODUCT: 7,
  COMPOSITE_PRODUCT: 8,
  VIRTUAL_PRODUCT: 9,
  TYPE_NULL: -1
};

/**
 * @enum {number}
 */
proto.common.enum.ProductEnum.ProductPattern = {
  PATTERN_NULL: 0,
  COMMON: 1,
  VIRTUAL: 2,
  SERVICE: 3
};

/**
 * @enum {number}
 */
proto.common.enum.ProductEnum.Nature = {
  NATURE_NULL: 0,
  GENERAL: 1,
  SENSITIVE: 2
};

/**
 * @enum {number}
 */
proto.common.enum.ProductEnum.FreightType = {
  FREE_SHIPPING: 0,
  FIXED_SHIPPING_FEE: 1,
  SHIPPING_TEMPLATE: 2
};

/**
 * @enum {number}
 */
proto.common.enum.ProductEnum.ProductLabel = {
  LABEL_NULL: 0,
  FREE_SHIP: 1,
  HOT: 2,
  HIGH_COMMISSION: 3,
  NEW: 4
};

/**
 * @enum {number}
 */
proto.common.enum.ProductEnum.SaleWay = {
  SALE_WAU_NULL: 0,
  SALE_OUT_STOP: 1,
  SALE_PURCHASE: 2
};

/**
 * @enum {number}
 */
proto.common.enum.ProductEnum.DeliveryWay = {
  DELIVERY_NULL: 0,
  PLATFORM_DELIVERY: 1,
  DIRECT_SHIPMENT: 2
};

/**
 * @enum {number}
 */
proto.common.enum.ProductEnum.Currency = {
  CURRENCY_NULL: 0,
  USD: 1,
  CNY: 2,
  MYR: 3,
  THB: 4
};

/**
 * @enum {number}
 */
proto.common.enum.ProductEnum.QueryTimeType = {
  TIME_TYPE_NULL: 0,
  CREATE_TIME: 1,
  UPDATE_TIME: 2
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
proto.common.enum.CategoryEnum.prototype.toObject = function(opt_includeInstance) {
  return proto.common.enum.CategoryEnum.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.common.enum.CategoryEnum} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.CategoryEnum.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.common.enum.CategoryEnum}
 */
proto.common.enum.CategoryEnum.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.common.enum.CategoryEnum;
  return proto.common.enum.CategoryEnum.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.common.enum.CategoryEnum} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.common.enum.CategoryEnum}
 */
proto.common.enum.CategoryEnum.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.common.enum.CategoryEnum.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.common.enum.CategoryEnum.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.common.enum.CategoryEnum} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.CategoryEnum.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


/**
 * @enum {number}
 */
proto.common.enum.CategoryEnum.ShowStatus = {
  SHOW_UN_USE: 0,
  SHOW: 1,
  HIDE: 2
};

/**
 * @enum {number}
 */
proto.common.enum.CategoryEnum.SortDirection = {
  UN_USE: 0,
  SORT_UP: 1,
  SORT_DOWN: 2
};

/**
 * @enum {number}
 */
proto.common.enum.CategoryEnum.CateType = {
  CATE_TYPE_NULL: 0,
  FRONT: 1,
  BACKEND: 2
};

/**
 * @enum {number}
 */
proto.common.enum.CategoryEnum.CateLevel = {
  CATE_LEVEL_NULL: 0,
  CATE_LEVEL_ONE: 1,
  CATE_LEVEL_TWO: 2,
  CATE_LEVEL_THREE: 3
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
proto.common.enum.AttributeEnum.prototype.toObject = function(opt_includeInstance) {
  return proto.common.enum.AttributeEnum.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.common.enum.AttributeEnum} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.AttributeEnum.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.common.enum.AttributeEnum}
 */
proto.common.enum.AttributeEnum.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.common.enum.AttributeEnum;
  return proto.common.enum.AttributeEnum.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.common.enum.AttributeEnum} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.common.enum.AttributeEnum}
 */
proto.common.enum.AttributeEnum.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.common.enum.AttributeEnum.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.common.enum.AttributeEnum.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.common.enum.AttributeEnum} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.AttributeEnum.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


/**
 * @enum {number}
 */
proto.common.enum.AttributeEnum.Customize = {
  NOT_ALLOW_CUSTOMIZE: 0,
  ALLOW_CUSTOMIZE: 1
};

/**
 * @enum {number}
 */
proto.common.enum.AttributeEnum.ShowStatus = {
  SHOW_UN_USE: 0,
  SHOW: 1,
  HIDE: 2
};

/**
 * @enum {number}
 */
proto.common.enum.AttributeEnum.ValueType = {
  VALUE_TYPE_UN_USER: 0,
  NORMAL: 1,
  CUSTOMIZE: 2
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
proto.common.enum.MsggwEnum.prototype.toObject = function(opt_includeInstance) {
  return proto.common.enum.MsggwEnum.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.common.enum.MsggwEnum} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.MsggwEnum.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.common.enum.MsggwEnum}
 */
proto.common.enum.MsggwEnum.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.common.enum.MsggwEnum;
  return proto.common.enum.MsggwEnum.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.common.enum.MsggwEnum} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.common.enum.MsggwEnum}
 */
proto.common.enum.MsggwEnum.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.common.enum.MsggwEnum.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.common.enum.MsggwEnum.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.common.enum.MsggwEnum} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.MsggwEnum.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


/**
 * @enum {number}
 */
proto.common.enum.MsggwEnum.PushType = {
  NULL_PUSH_TYPE: 0,
  MANUAL_PUSH: 1,
  TIMING_PUSH: 2,
  IMMEDIATELY_PUSH: 3,
  BATCH_TIMING_PUSH: 4
};

/**
 * @enum {number}
 */
proto.common.enum.MsggwEnum.ReadStatus = {
  NULL_READ_STATUS: 0,
  UNREAD: 1,
  READ: 2
};

/**
 * @enum {number}
 */
proto.common.enum.MsggwEnum.DeviceType = {
  UNKNOWN: 0,
  ANDROID: 1,
  IOS: 2
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
proto.common.enum.PurchaseOrderEnum.prototype.toObject = function(opt_includeInstance) {
  return proto.common.enum.PurchaseOrderEnum.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.common.enum.PurchaseOrderEnum} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.PurchaseOrderEnum.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.common.enum.PurchaseOrderEnum}
 */
proto.common.enum.PurchaseOrderEnum.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.common.enum.PurchaseOrderEnum;
  return proto.common.enum.PurchaseOrderEnum.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.common.enum.PurchaseOrderEnum} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.common.enum.PurchaseOrderEnum}
 */
proto.common.enum.PurchaseOrderEnum.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.common.enum.PurchaseOrderEnum.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.common.enum.PurchaseOrderEnum.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.common.enum.PurchaseOrderEnum} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.PurchaseOrderEnum.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


/**
 * @enum {number}
 */
proto.common.enum.PurchaseOrderEnum.UseFingoSystem = {
  NULL_USE_FINGO: 0,
  USE: 1,
  NOT_USE: 2
};

/**
 * @enum {number}
 */
proto.common.enum.PurchaseOrderEnum.DeliveWay = {
  NULL_DELIVE: 0,
  OCEAN: 1,
  AIR: 2
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
proto.common.enum.PledgeEnum.prototype.toObject = function(opt_includeInstance) {
  return proto.common.enum.PledgeEnum.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.common.enum.PledgeEnum} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.PledgeEnum.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.common.enum.PledgeEnum}
 */
proto.common.enum.PledgeEnum.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.common.enum.PledgeEnum;
  return proto.common.enum.PledgeEnum.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.common.enum.PledgeEnum} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.common.enum.PledgeEnum}
 */
proto.common.enum.PledgeEnum.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.common.enum.PledgeEnum.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.common.enum.PledgeEnum.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.common.enum.PledgeEnum} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.PledgeEnum.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


/**
 * @enum {number}
 */
proto.common.enum.PledgeEnum.PaymentType = {
  PAYMENT_NULL: 0,
  SYSTEM_PAY: 1,
  NOT_PAY: 2
};

/**
 * @enum {number}
 */
proto.common.enum.PledgeEnum.ShowType = {
  SHOE_NULL: 0,
  SHOW_PRODUCT_DETAIL: 1,
  SHOW_ALL: 2,
  SHOW_NOTHING: 3
};

/**
 * @enum {number}
 */
proto.common.enum.PledgeEnum.RangeType = {
  RANGE_NULL: 0,
  RANGE_CATEGORY: 1,
  RANGE_PRODUCT_TYPE: 2
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
proto.common.enum.ErpEnum.prototype.toObject = function(opt_includeInstance) {
  return proto.common.enum.ErpEnum.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.common.enum.ErpEnum} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.ErpEnum.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.common.enum.ErpEnum}
 */
proto.common.enum.ErpEnum.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.common.enum.ErpEnum;
  return proto.common.enum.ErpEnum.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.common.enum.ErpEnum} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.common.enum.ErpEnum}
 */
proto.common.enum.ErpEnum.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.common.enum.ErpEnum.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.common.enum.ErpEnum.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.common.enum.ErpEnum} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.ErpEnum.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


/**
 * @enum {number}
 */
proto.common.enum.ErpEnum.InventoryOperType = {
  NULL_INVENTORY_OPER_TYPE: 0,
  ADD: 1,
  REDUCE: 2
};

/**
 * @enum {number}
 */
proto.common.enum.ErpEnum.InventoryRecordType = {
  NULL_INVENTORY_RECORD_TYPE: 0,
  CONFIRM_PURCHASE: 1,
  STOCKOUT: 2,
  LOGI_INCOME: 3,
  ORDER_DELIVER: 4,
  CREATE_ORDER: 5,
  CANNEL_ORDER: 6,
  ADMIN_UPDATE: 7
};

/**
 * @enum {number}
 */
proto.common.enum.ErpEnum.QtyType = {
  NULL_QTY_TYPE: 0,
  IN_STOCK_QTY: 1,
  RESERVE_QTY: 2,
  BOOKED_QTY: 3,
  VIRTUAL_QTY: 4
};

/**
 * @enum {number}
 */
proto.common.enum.ErpEnum.OutOrderStatus = {
  NULL_OUT_ORDER_STATUS: 0,
  OUT: 1,
  UNOUT: 2,
  CANNELT: 3
};

/**
 * @enum {number}
 */
proto.common.enum.ErpEnum.SyncStatus = {
  NULL_SYNC_STATUS: 0,
  SYNC: 1,
  UNSYNC: 2
};

/**
 * @enum {number}
 */
proto.common.enum.ErpEnum.SignStatus = {
  NULL_SIGN_STATUS: 0,
  SIGN: 1,
  UNSIGN: 2
};

/**
 * @enum {number}
 */
proto.common.enum.ErpEnum.IncomeStatus = {
  NULL_INCOME_STATUS: 0,
  INCOME: 1,
  UNINCOME: 2
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
proto.common.enum.PriceTemplateEnum.prototype.toObject = function(opt_includeInstance) {
  return proto.common.enum.PriceTemplateEnum.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.common.enum.PriceTemplateEnum} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.PriceTemplateEnum.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.common.enum.PriceTemplateEnum}
 */
proto.common.enum.PriceTemplateEnum.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.common.enum.PriceTemplateEnum;
  return proto.common.enum.PriceTemplateEnum.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.common.enum.PriceTemplateEnum} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.common.enum.PriceTemplateEnum}
 */
proto.common.enum.PriceTemplateEnum.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.common.enum.PriceTemplateEnum.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.common.enum.PriceTemplateEnum.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.common.enum.PriceTemplateEnum} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.common.enum.PriceTemplateEnum.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


/**
 * @enum {number}
 */
proto.common.enum.PriceTemplateEnum.EffectStatus = {
  EFFECT_NULL: 0,
  EFFECT: 1,
  DISABLE: 2
};

goog.object.extend(exports, proto.common.enum);
