/**
[suzunari]

Copyright (c) [2017] [JunYamamoto]

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

function doGet(e) {
    
  var content = loadContent(e);

  return content.evaluate();   
}

function loadContent(e){
    var obj1 = JSON.parse(e.parameter.jointData);
    var jsonData = obj1.jsonData;
    var ary = loadSpreadSheet(jsonData.spredSheetID,jsonData.sheetName,jsonData.offset)
    var obj = getJointTable(ary,jsonData.field,jsonData.jsonField,jsonData.field.indexOf(jsonData.linkField.jointName));
    var libName = cngLibraryName(obj1[jsonData.field.library],jsonData.thisLibrary)
 return searchFunc.call(e,obj1.func,obj1.libName,obj,obj[obj1.nextJoint],e,jsonData);
}

  function jointOnJoint(obj,row,val,settings){
      var libName = cngLibraryName(row[settings.linkField.library],settings.thisLibrary)
          if(row[settings.linkField.nextJoint] && obj[row[settings.linkField.nextJoint]] && !row[settings.linkField.augment].escape){
              val = jointOnJoint.call(this,obj,obj[row[settings.linkField.nextJoint]],val,settings);
          }
      return searchFunc.call(this,row[settings.linkField.func],libName,obj,row,val,settings);
  }
  
  function setLayout(obj,row,val,settings){
      var thisObj = new suzunariLayout.SuzunariContener(val);
      var tes =jointOnJoint.call(thisObj,obj,row,val,settings);
      var testAry = {};
 //     var param = JSON.parse(e.parameter.jointData)
      testAry.pageDiv = []
      testAry.pageDiv.push({"left":JSON.stringify(tes)});//+JSON.stringify(ary)+jsondata.field.indexOf(jsondata.linkField.jointName)});
      testAry.pageDiv.push({"left":"test"});
      var test = {};
      test.pageDiv = testAry;
      thisObj.addData(testAry);
      return thisObj;
  }
  function testJoint(obj,row,val,settings){
      var testAry = {};
 //     var param = JSON.parse(e.parameter.jointData)
      testAry.pageDiv = []
      testAry.pageDiv.push({"left":JSON.stringify(row)});//+JSON.stringify(ary)+jsondata.field.indexOf(jsondata.linkField.jointName)});
      testAry.pageDiv.push({"left":"test"});
      var test = {};
      test.pageDiv = testAry;
      this.addData(testAry);
      return "test"
  }

function sheetJoint(obj,obj1,jsonData,ary,nextVal){
  var thisObj = new suzunariLayout.SuzunariContener(obj);
  var testAry = {};
  var param = JSON.parse(e.parameter.jointData)
  testAry.pageDiv = []
  testAry.pageDiv.push({"left":JSON.stringify(param)});//+JSON.stringify(ary)+jsondata.field.indexOf(jsondata.linkField.jointName)});
  testAry.pageDiv.push({"left":"test"});
  var test = {};
  test.pageDiv = testAry;
  thisObj.addData(testAry);
  return searchFunc.call(e,joint.func,joint.library,obj,joint.josnData);
}

  function jointOnJoint2(obj,key,val,settings){
    if(obj[key]){
      if(obj[key][field.library] == settings){ //.thisLibrary){//self library 
        var libName = "";
      }else{
        var libName = obj[key][field.library];
      }
      if(obj[key][field.nextJoint]){
        var nextVal = jointOnJoint.call(this,obj,obj[key][field.nextJoint],val,settings);
      }else{ var nextVal = ""
      }
    var i = 0;
    while(obj[key + "-" + i] !== undefined){
      if(obj[key].augment.joint == "marge"){
        var val = val || {};
        val = marge(val,jointOnJoint.call(this,obj,field,key + "-" + i,settings,i));
        i++;
      }else{
        var val = val || [];
        val[i] = jointOnJoint.call(this,obj,field,key + "-" + i,settings,i);
        i++;
      }
     }
     return searchFunc.call(this,obj[key][field.func],libName,obj,obj[key],obj[key][field.jsonData],val,nextVal,nom);
    }else{
    return ""
    }
  }
  
  function margeJoint(obj,obj1,data,ary,nextVal){
    var obj2 = {};
    for (var i = 0; i < ary.length; i++){
      marge(obj2,ary[i]);
    }
    return obj2;
  }
 
  function bindJoint(obj,obj1,data,ary,nextVal){
    return jointOnJoint.call(searchFunc(this,data.funk,data.library,obj,obj1,data,ary,nextVal),obj,obj1.augment);
  }
  
  function addPropertyJoint(obj,obj1,data,ary,nextVal){
    this[obj1.augment.target] = nextVal;
  }
  
  function addPageDiv(obj,obj1,data,ary,nextVal){
    this.pageDiv[obj1.augment.argAry[0]][obj1.augment.argAry[1]] = nextVal;
  }
  
function combineDataJoint(obj,obj1,data,ary,nextVal){
  this[obj1.augment.target] = combineArrayObject(this[obj1.augment.target],data);
}
  
function dataObjectJoint(obj,obj1,data,ary,nextVal){
  return data;
}
  
function jointOnJointOnjoint(obj,obj1,data,ary,nextVal){
  return jointOnJoint.call(this,obj,obj1.argAry);
}
  
function singleJoint(obj,obj1,data,ary,nextVal){
  return nextVal;
}

function jsonStringifyJoint(obj,obj1,data,ary,nextVal){
return JSON.stringify(nextVal);
}

function aryReturnJoint(obj,obj1,data,ary,nextVal){
  return ary;
}

function joinInJoint(obj,obj1,data,ary,nextVal){
  return Array.prototype.join.apply(ary,obj1.augment.argAry);
}

function InsertJoint(obj,obj1,data,ary,nextVal){
  var val = "";
  var arg = [obj1.argAry[0]];
  val += obj1.argAry[1];
  if(obj1.argAry[2] === "ary"){
  val += Array.prototype.join.apply(ary,arg);
  }else if(obj1.argAry[3] === "next"){
    val += nextVal;
  }else if(obj1.argAry[3] === "ary&next"){
    val += Array.prototype.join.apply(ary,arg) + nextVal
  }else if(obj1.argAry[3] === "next&ary"){
    val += nextVal + Array.prototype.join.apply(ary,arg)
  }
  val += obj1.argAry[2];
  return 
}

function function2(obj,obj1,data,ary,nextVal){
//  this.addData(testAry);
    var vals = "";
    for (var i = 0; i < ary.length; i++){
      if(ary[i]){
      vals += "<br>" + ary[i];
      }
    }
  return this.libraryName + val2 + "<br><br>" + vals;
}
function function3(obj,obj1,data,ary,nextVal){
  var testAry = {};
  testAry.pageDiv = []
//  testAry.pageDiv.push({"center":JSON.stringify(ary)});
  testAry.pageDiv.push({"center":nextVal});
  this.addData(testAry);
  this.addPage(0,"left","test");
//  return data.form + "<br><br>dddd" + nextVal// + "<br><br><a>" + obj.form +"</a>";
  return data;
}
function libraryApply(func,opt_library) { // 関数が有れば関数を、なければ　undefined　を返す。
  if(opt_library) { var lib = opt_library + '.'}else{ var lib = ""};
  var t = Function.call("",'return typeof(' + lib  + func + ')');
  if(t() == 'function') {
    var f = 'return function(args) { return ' + lib  + func + '.apply(this,args);}';
//    var f = 'return ' + lib  + func + '.apply(this,ary)';
    return Function.call("",f)();
  }else{
  return undefined;
  }
}

function requestLibrary(req) {
　　var  lib = libraryFanc("suzunariCatchRequest",castLibName(req.libName),4);
　　return lib(req);
}

function combineArrayObject(aryObj1,aryObj2){
  if(aryObj1.length > aryObj2.length){
    var len = aryObj1.length;
  }else{
    var len = aryObj2.length;
  }
  for(var i = 0; i < len; i++){
    if(aryObj2[i]){
      aryObj1[i] = aryObj1[i] || {};
      for(var key in aryObj2[i]){
        if(aryObj1[i][key] !== undefined){
          aryObj1[i][key] += aryObj2[i][key];
        }else{
          aryObj1[i][key] = aryObj2[i][key];
        };
      };
    };
  };
  return aryObj1;
}

function combineArrayObject(aryObj1,aryObj2){
  if(aryObj1.length > aryObj2.length){
    var len = aryObj1.length;
  }else{
    var len = aryObj2.length;
  }
  for(var i = 0; i < len; i++){
    if(aryObj2[i]){
      aryObj1[i] = aryObj1[i] || {};
      for(var key in aryObj2[i]){
        if(aryObj1[i][key] !== undefined && aryObj2[i][key] !== undefined && aryObj2[i][key] !== 'undefined'){
          aryObj1[i][key] += aryObj2[i][key];
        }else if(aryObj2[i][key] !== undefined && aryObj2[i][key] !== 'undefined'){
          aryObj1[i][key] = aryObj2[i][key];
        };
      };
    };
  };
  return aryObj1;
}

 function searchFunc(func,opt_library){ // not eval...?
   var libfunc = libraryApply(func,opt_library);
     if(libfunc !== undefined) {
     var ary = []
       for (var i = 2; i < arguments.length; i++){
         ary.push(arguments[i])
       }
    return libfunc.call(this,ary);
    }else{
    return "non function"
    }
  }
  
 function cngLibraryName(name,key){
  if(!name || name === key) {
    return  "";
  } else {
    return name;
  };    
 }

 function getJointTable(ary,keys,jsonKeys,keyIndex){
  var obj ={};
    for (var i = 0; i < ary.length; i++){
      for (var j = 0; j < ary[i].length; j++){
        if(jsonKeys.indexOf(keys[j]) >= 0 ){
          obj[ary[i][keyIndex]] = obj[ary[i][keyIndex]] || {};
            if(ary[i][j] !== undefined && ary[i][j]){
              obj[ary[i][keyIndex]][keys[j]] = JSON.parse(ary[i][j]);
              }else{
              obj[ary[i][keyIndex]][keys[j]] = ary[i][j] 
            };
        }else{
          obj[ary[i][keyIndex]] = obj[ary[i][keyIndex]] || {};
          obj[ary[i][keyIndex]][keys[j]] = ary[i][j];
        };
      };
    };
   return obj;
  }
  
function loadSpreadSheet(spredSheetID,sheetName,offset){
  var sheet = SpreadsheetApp.openById(spredSheetID).getSheetByName(sheetName);//(e.parameter.SettingSheetName);
  return sheet.getRange(offset,1,sheet.getLastRow(),sheet.getLastColumn()).getValues();
}
  
function marge(obj1,obj2){
  obj1 = obj1 || {};
  obj2 = obj2 || {};
    for (var attrname in obj2) {
        if (obj2.hasOwnProperty(attrname)) {
            obj1[attrname] = obj2[attrname];
        }
    }
  return obj1;
}

function libraryOutputFromFile(name) {
   return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function libraryTemplateFromFile(name) {
  return HtmlService.createTemplateFromFile(name);
}

function getUserId(){
  return Session.getActiveUser().getUserLoginId();
}

function getUserEmail(){
  return Session.getActiveUser().getEmail();
}