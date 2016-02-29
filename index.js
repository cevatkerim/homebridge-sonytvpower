"use strict";

var wol = require("wake_on_lan");
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

var Service, Characteristic;

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-sonytvpower", "SonyTV", SonyTV);
}

function SonyTV(log, config) {
  this.log = log;
  this.name = config.name;
  this.mac = config.mac;
  this.ip = config.ip;
  this.comp = config.compatibilityMode

  this._service = new Service.Switch(this.name);
  this._service.getCharacteristic(Characteristic.On)
    .on('set', this._setOn.bind(this));
  this._service.getCharacteristic(Characteristic.Off)
    .off('set', this._setOff.bind(this));
}

SonyTV.prototype.getServices = function() {
  return [this._service];
}

SonyTV.prototype._setOn = function(on, callback) {

  if(on){
    wol.wake(this.mac, function(error) {
      if (error) {
        this._service.setCharacteristic(Characteristic.On, false);
        this.log("Error when sending packets", error);
      } else {
        this.log("Packets sent");
        this._service.setCharacteristic(Characteristic.On, true);
      }
    }.bind(this));
  }

  callback();
}

SonyTV.prototype._setOff = function(on, callback) {

  if(off){
    var post_data = "<?xml version=\"1.0\" encoding=\"utf-8\"?><s:Envelope xmlns:s=\"http:\/\/schemas.xmlsoap.org/soap/envelope/\" s:encodingStyle=\"http:\/\/schemas.xmlsoap.org/soap/encoding/\"><s:Body><u:X_SendIRCC xmlns:u=\"urn:schemas-sony-com:service:IRCC:1\"><IRCCCode>AAAAAQAAAAEAAAAvAw==</IRCCCode></u:X_SendIRCC></s:Body></s:Envelope>";
    
    if (this.comp){
      var post_options = {
        host: 'closure-compiler.appspot.com',
        port: '80',
        path: '/sony/IRCC',
        method: 'POST',
        headers: {}
      };
    }else{
      // An object of options to indicate where to post to
      var post_options = {
        host: this.ip,
        port: '80',
        path: '/IRCC',
        method: 'POST',
        headers: {}
      };
    }

    // Set up the request
    var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        this.log("Sony TV turned off");
        this._service.setCharacteristic(Characteristic.On, true);
      });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
  }
}
