  /**
  [suzunari]

  Copyright (c) [2017] [JunYamamoto]

  This software is released under the MIT License.
  http://opensource.org/licenses/mit-license.php
  */

 function doGet(e) {
    
   var contents = loadContent(e);

   return contents.evaluate();   
 }

 function loadContent(e){
   var joint = JSON.parse(e.parameter.jointData);
   return searchFunc.call(e,joint.func,"suzunari","suzunari"
                          ,e,joint,joint.options,joint.jsonData);
 }

function setLayoutJoint(joints,current,options,jsonData){
    arguments[0] = getJointTable({},current,this);
    current = arguments[0].table[current.jointName]
    var next = arguments[0].table[current.nextJoint[0]]
//    joints.callbacks[0] = function(joints,current,options,jsonData){ return current.jointName}
//    this.content += joints.callbacks[0]()
    arguments[1] = next
    arguments[2] = next.options
    arguments[3] = next.jsonData    
    var thisObj = setContainer(this)
    var val = {}
    if(current.nextJoint){
      for (var i = 0; i < current.nextJoint.length; i++){     
        val = combine(val,recursiveSearch.call(thisObj,arguments,i))
      }
    }
   thisObj = combine(thisObj,replaceContensTag2(joints,val,current,internalSource(thisObj,val)))
//  thisObj.contents += thisObj.jqueryIni//JSON.stringify()
  if(this.parameter.dump !== undefined){
    return contentsDump.call(this,thisObj,JSON.parse(this.parameter.dump))
  }else{
  return thisObj
  }
}
function internalSource(thisObj,val){
  var obj = {}
  for (var i = 0; i < thisObj.item.length; i++){
    var source = val[thisObj.item[i]]
    if(isString(val)){
      obj["" + thisObj.item[i]] = source
    }else{
      obj["" + thisObj.item[i]] = source
    }
  }
 return obj
}

function contentsDump(thisObj,param){
  var html = HtmlService.createTemplateFromFile('dumpDone');
  var props = PropertiesService.getScriptProperties();
  var obj = {}
  var ary = []
  var data = {}
  var keys = props.getKeys()
  var joint = {jointName:"test",
               func:"runningScriptJoint",
               library:"suzunari",
               options:{},
               jsonData:param
              }
  joint.jsonData.thisLibrary = "suzunari"
  for (var i = 0; i < thisObj.item.length; i++){
    obj["html"] = obj["html"] || {}
    obj["html"][thisObj.item[i]] = thisObj[thisObj.item[i]]
  }
  for (var i = 0; i < keys.length; i++){
    data[keys[i]] = props.getProperty(keys[i])
  }
  obj["initialDatas"] = thisObj.initialDatas
  obj["initialData"] = getJointTable({},thisObj.initialDatas)
  obj["response"] = {}
  obj["response"] = data
  var url = "<a href='" + param.scriptUrl + "?jointData=" + JSON.stringify(joint) + "'>" + param.scriptUrl + "?jointData=" + JSON.stringify(joint) + "</a>"
  ary.push(JSON.stringify(obj)) 
  html.dump = "<h4>Done</h4><br><br><a>It exported</a><br><br>"
  html.url = url
  writeSpreadsheet(param.spredSheetID,param.sheetName,ary,false,1,1);
  return html
}

function runningScriptJoint(joints,current,options,jsonData){
  var props = PropertiesService.getScriptProperties();
  var thisObj = setContainer(this)
  var ary = loadSpreadSheet(current.jsonData.spredSheetID,current.jsonData.sheetName,current.jsonData.offset,1,1,1,1)
  var data = JSON.parse(ary[0])
  var response = {}
  props.setProperties(data.response)
  thisObj = combine(thisObj,data.html)
  arguments[0] = data["initialData"]
  arguments[1] = data["initialDatas"]
  arguments[2] = data["initialDatas"].options
  arguments[3] = data["initialDatas"].jsonData    
  thisObj = combine(thisObj,recursiveSearch.call(thisObj,arguments,0))
  return thisObj
}

  function setPropertiesJoint(joints,current,options,jsonData){
    current.jsonData = replaceContensTag2(joints,current.jsonData,current,{})
    arguments[0] = getJointTable.call(this,joints,current,joints.paramE)
    var data = {}
    var props = PropertiesService.getScriptProperties();
    var joint = getJointTable.call(this,{},current,joints.paramE)
    for(var key in joint.table){
    data[key] = JSON.stringify(joint.table[key])
    }
    delete joint.table;
    data.joints = JSON.stringify(joint);
    props.setProperties(data)
    return {}
  }

  function requestSearch(req) {
    var props = PropertiesService.getScriptProperties();
    var data = {}
    var keys = props.getKeys()
    for (var i = 0; i < keys.length; i++){
      data[keys[i]] = JSON.parse(props.getProperty(keys[i]))
    }
    var joints = data.joints
    delete data.joints
    joints.table = data
    var joint = joints.table[req.jointName]
    joints.requests = req
    return searchFunc.call(req,joint.func,joint.library,joints.thisLibrary,joints,joint,joint.options,joint.jsonData);
  }

  function changeSheetJoint(joints,current,options,jsonData){
    current.jsonData = replaceContensTag2(joints,current.jsonData,current,{})
    arguments[0] = getJointTable.call(this,joints,current,joints.paramE)
   if(current.nextJoint){
      for (var i = 0; i < current.nextJoint.length; i++){
        return recursiveSearch.call(this,arguments,i)
      }
    }else{
      return replaceContensTag2(joints,jsonData,current,{}) //<<<?
    }
  }

  function setDataJoint(joints,current,options,jsonData){
    current.jsonData = replaceContensTag2(joints,current.jsonData,current,{})
    var joints = getJointTable.call(this,joints,current,joints.paramE)
    arguments[0] = joints
    if(current.nextJoint){
      for (var i = 0; i < current.nextJoint.length; i++){
        return recursiveSearch.call(this,arguments,i)
      }
    }else{
      return replaceContensTag2(joints,jsonData,current,{}) //<<<?
    }
  }

  function separateJoint(joints,current,options,jsonData){//jsonData は呼び出した回数呼ばれる。中身も回数呼ばれる
    var val = {}
    if(current.nextJoint !== undefined && current.nextJoint){
      for (var i = 0; i < current.nextJoint.length; i++){
        var val2 = replaceContensTag2(joints,recursiveSearch.call(this,arguments,i),current,JSON.parse(JSON.stringify(options)));
        var jData = replaceContensTag2(joints,jsonData,current,val2.escape)
        delete val2.escape
        val = combine(val,replaceContensTag2(joints,jData,current,val2,true))
      }
      return val
    }else{
      if(jsonData && options){
        val = replaceContensTag2(joints,jsonData,current,{})
      }else if(jsonData){
        val = jsonData
      }
      return val
    }
  }

  function multipleJoint(joints,current,options,jsonData){
  var val = {}
  if(current.nextJoint !== undefined && current.nextJoint){
    var escape = {}
    for (var i = 0; i < current.nextJoint.length; i++){
      var val2 = replaceContensTag2(joints,recursiveSearch.call(this,arguments,i),current,JSON.parse(JSON.stringify(options)));
      escape = combine(escape,val2.escape)
      delete val2.escape
      val = combine(val,val2);
    }
  //  current.options = marge(current.options,escape)
    return replaceContensTag2(joints,jsonData,current,val,true)
  }else{
    if(jsonData && options){
      val = replaceContensTag2(joints,jsonData,current,{})
    }else if(jsonData){
      val = jsonData
    }
    return val
  }
  }

function replaceContensTag2(joints,target,current,data,addData){
  var option = (current !== undefined && current) ? margeFanc2(joints,current) : data
  if(target !== undefined && target && isObject(target) && isObject(option)){
    return replaceTemplateTag2(target,option,data,addData)
  }else if(addData){
    return data
  }
}

function margeFanc2(joints,current){
  var obj2 = {}
  var option = (isObject(current.options)) ? current.options : {}
//  obj1 = marge(obj1,obj1.escape)
//  delete obj1.escape
//  obj1 = obj1 || {}
  for(var key in option){
    if(option[key].func !== undefined && key !== current.jointName){
      var ary = []
      var row2 = current
      var library = option[key].library || ""
      var argAry = option[key].argAry || ""
      var thisLibrary = joints.thisLibrary || ""
      if(option[key].nextJoint){
        row2 = joints[option[key].nextJoint]        
      }
      ary.push(option[key].func);
      ary.push(library);
      ary.push(thisLibrary)
      if(option[key].func.indexOf("Joint") ===  option[key].func.length - 5){
      ary.push(joints)
      ary.push(row2)
        }
      ary.push(argAry)
      obj2[key] = searchFunc.apply(this,ary);
    }else if(option[key].parent !== undefined){
      var ret = searchParent(joints,current,option[key])
          if(typeof (ret) == "string" || ret instanceof String){
            obj2[key] = ret
          }else if(isObject(ret) && ret !== undefined && ret){
            for(var key2 in ret){
              if(current[key2] !== undefined && isObject(current[key2])){
                current[key2][key] = ret[key2]
              }
            }
          }else{
            obj2[key] = JSON.stringify(ret)
          }
    }else if(option[key].child !== undefined){
      obj2[key] = searchChild(joints,current,option[key])
    }else{
      obj2[key] = option[key]
    }
  }
    internalReplaceWord2.call(obj2,joints,current)
  return obj2
}

function internalReplaceWord2(joints,current){
  this["nameSpace"] = current.jointKey || "non"
  this["spredSheetID"] = current.spredSheetID || "non"
  this["sheetName"] = current.sheetName || "non"
  this["offset"] = current.offset || "non"
  this["jointName"] = current.jointName || "non"
  this["index"] = current.index || "non"
  this["rowIndex"] = current.rowIndex || "non"
  this["parent"] = current.parent || "non"
  if(joints.paramE){
    for(var key in joints.paramE.parameter){
      this["param-" + key] = joints.paramE.parameter[key]
    }
  }
  if(joints.requests){
    for(var key in joints.requests){
      this["req-" + key] = joints.requests[key]
    }
    if(joints.requests.requests){
      for(var key in joints.requests.requests){
        this["req-" + key] = joints.requests.requests[key]
      }
    }
  }
}


  function replaceTemplateTag2(text,obj,data,addData){
    text = JSON.stringify(text)
    obj = marge(obj,data)
    var data2 = (data && isObject(data)) ? JSON.parse(JSON.stringify(data)) : {}
    for(var key in obj){
      var re1 = new RegExp("<\\?=? *#?(" + key + "|this." + key + ") *\\?>","g");
      var re2 = new RegExp("<\\!=? *#?(" + key + "|this." + key + ") *\\!>","g");
      var re3 = new RegExp("\"\\{\\?=? *#?(" + key + "|this." + key + ") *\\?\\}\"","g");
      if(re1.test(text) || re2.test(text) || re3.test(text)){
        if(isObject(obj[key]) || isArray(obj[key])){
          var json = JSON.stringify(obj[key])
          json = json.replace( /\$/g , "@#@#@#@#@" )
          text = text.replace(re1,json.replace( /\"/g , "'" ));
          text = text.replace(re2,json.replace( /\"/g , "\\\"" ));
          text = text.replace(re3,json);
          text = text.replace(/@#@#@#@#@/g,"\$");
        }else{
          var wrd = obj[key]
          if(isString(wrd)) wrd = wrd.replace( /\$/g , "@#@#@#@#@" )
          text = text.replace(re1,wrd);
          text = text.replace(re2,wrd);
          text = text.replace(re3,wrd);
          text = text.replace(/@#@#@#@#@/g,"\$");
        }
        if(data2[key]){
          delete data2[key]
        }
      }
    }
    if(addData){
      return combine(JSON.parse(text),data2)
    }else{
      return JSON.parse(text)
    }
  }

function writeRowJoint(joints,current,options,jsonData){
  var ary = []
  var val = multipleJoint.call(this,joints,current,options,jsonData)
  if(val.field){
    for(var i = 0; i < val.field.length; i++){
      if(val.field[i].requestName !== undefined && val.field[i].requestName && val.field[i].val !== undefined && val.field[i].val){
        if(val.field[i].jsonField !== undefined && val.field[i].jsonField){
          if(val.field[i].jsonField == "parse"){
            ary.push(JSON.parse(val.field[i].val))
          }else if(val.field[i].jsonField == "stringify"){
            ary.push(JSON.stringify(val.field[i].val))
          }
        }else{
          ary.push(val.field[i].val)
        }
      }else if(val[val.field[i]] !== undefined && val[val.field[i]]){
        if(val.jsonField !== undefined && val.jsonField.indexOf(val.field[i]) >= 0){
          ary.push(JSON.stringify(val[val.field[i]]))
          delete val[val.field[i]];
        }else{
          ary.push(val[val.field[i]])
          delete val[val.field[i]];
        }
      }else if(this.requests && this.requests[val.field[i].requestName] !== undefined){
        if(val.jsonField !== undefined && val.jsonField !== undefined && val.jsonField.indexOf(val.field[i]) >= 0){
          if(val.field[i].jsonField == "parse"){
            ary.push(JSON.parse(this.requests[val.field[i].requestName]))
          }else if(val.field[i].jsonField == "stringify"){
            ary.push(JSON.stringify(this.requests[val.field[i].requestName]))
          }
        }else{
          ary.push(this.requests[val.field[i].requestName])
        }
      }else if(this.requests && this.requests[val.field[i]] !== undefined){
        if(val.jsonField !== undefined && val.jsonField !== undefined && val.jsonField.indexOf(val.field[i]) >= 0){
          ary.push(JSON.stringify(this.requests[val.field[i]]))
        }else{
          ary.push(this.requests[val.field[i]])
        }
      }else{
        ary.push(val.emptyWord || "")
      }
    }
  }
  delete val.field ; delete val.jsonField ; delete val.emptyWord;
  writeSpreadsheet(val.spredSheetID,val.sheetName,ary,true,val.startRow,val.startCol);
  delete val.spredSheetID ; delete val.sheetName ; delete val.startRow ; delete val.startCol;
  return val
}

function loadSheetJoint(joints,current,options,jsonData){
  var val = multipleJoint.call(this,joints,current,options,jsonData)
  var sheet = {"load_sheet_joint":loadSpreadSheet(val.spredSheetID,val.sheetName,val.startRow,val.endRow,val.startCol,val.endCol)};
  delete val.spredSheetID; delete val.sheetName; delete val.startRow; delete val.endRow; delete val.startCol; delete val.endCol
  return replaceContensTag2(joints,val,null,sheet,true)
}

function arrayObjectJoint(joints,current,options,jsonData){
    var val = multipleJoint.call(this,joints,current,options,jsonData)
    var catchVal = val["#load_sheet_joint"] || val["load_sheet_joint"] || val["#array_joint"] || val["array_joint"] || [[]]
    var sheet = {"array_object_joint":castArraylist(catchVal,val.fieldName,val.jsonField,val.emptyWord)}
    delete val.fieldName ; delete val.jsonField ; delete val.emptyWord;
  return replaceContensTag2(joints,val,null,sheet,true)
}

  function jsonStringifyJoint(joints,current,options,jsonData){
    var val = multipleJoint.call(this,joints,current,options,jsonData)
    var jsonD = {"json_stringify_joint":JSON.stringify(val)}
    return replaceContensTag2(joints,val,null,jsonD,true)
  }

  function arrayJoint(joints,current,options,jsonData){
    var val = {}
    var ary =[]
    var array_joint = {}
    array_joint["array_joint"] = []
    if(current.nextJoint){
    var escape = {}
      for (var i = 0; i < current.nextJoint.length; i++){
        var val2 = replaceContensTag2(joints,recursiveSearch.call(this,arguments,i),current,JSON.parse(JSON.stringify(options)));
        escape = combine(escape,val2.escape)
        delete val2.escape
        ary.push(val2)
      }
      array_joint["array_joint"] = ary
    current.options = marge(current.options,escape)
    return replaceContensTag2(joints,jsonData,current,array_joint,true)
    }else{
      if(jsonData && options){
        val = replaceContensTag2(joints,jsonData,current,array_joint,true)
      }else if(jsonData){
        val = replaceContensTag2(joints,jsonData,null,array_joint,true)
      }
      return val
    }
  }

function castArraylist(ary,fieldName,opt_jsonField,opt_word){
  opt_word = opt_word || ""
  var re = []
  for (var i = 0; i < ary.length; i++){
    var obj = {};
    for (var j = 0; j < ary[i].length; j++){
      if(fieldName[j] !== undefined && fieldName[j]){
        fieldName[j].colName = (fieldName[j].colName) ? fieldName[j].colName : fieldName[j].field
        if(ary[i][j] && fieldName[j].colName !== undefined && fieldName[j].colName && fieldName[j].jsonField !== undefined && fieldName[j].jsonField){
          if(fieldName[j].jsonField == "parse"){
          obj[fieldName[j].colName] = JSON.parse(ary[i][j]);
          }else if(fieldName[j].jsonField == "stringify"){
          obj[fieldName[j].colName] = JSON.stringify(ary[i][j]);
          }
        } else if(fieldName[j].colName !== undefined && fieldName[j].colName && fieldName[j].jsonField !== undefined && fieldName[j].colName){
          obj[fieldName[j].colName] = fieldName[j].jsonField;
        } else if(ary[i][j] && fieldName[j].colName !== undefined && fieldName[j].colName){
          obj[fieldName[j].colName] = ary[i][j];
        } else if(fieldName[j].colName !== undefined && fieldName[j].colName){
          obj[fieldName[j].colName] = opt_word;
        }else if(ary[i][j] && isString(fieldName[j]) && opt_jsonField && opt_jsonField.indexOf(fieldName[j]) >= 0 ){
          obj[fieldName[j]] = JSON.parse(ary[i][j]);
        }else if(ary[i][j] && isString(fieldName[j])){
          obj[fieldName[j]] = ary[i][j];
        }else{
          obj[fieldName[j]] = opt_word
        };
      };
    };
  re[i] = obj;
  };
  return re;
}

function writeSpreadsheet(ssId,sheetName,data,insert,startRow,startCol){ //insert　インサートで挿入か書き換えを指定
  var sheet = SpreadsheetApp.openById(ssId).getSheetByName(sheetName);
  var ary = [];
  ary[0] = data;
  startRow = startRow || 1
  startCol = startCol || 1
  if(startRow && insert){ sheet.insertRowBefore(startRow) };
  sheet.getRange(startRow,startCol,ary.length,ary[0].length).setValues(ary);
};

  function loadSpreadSheet(spredSheetID,sheetName,startRow,endRow,startCol,endCol){
    var sheet = SpreadsheetApp.openById(spredSheetID).getSheetByName(sheetName);
    startRow = startRow || 1
    endRow = endRow || sheet.getLastRow();
    startCol = startCol || 1
    endCol = endCol || sheet.getLastColumn()
    return sheet.getRange(startRow,startCol,endRow - (startRow - 1),endCol).getValues();
  }
  

  function libraryFileTwig(joints,current,options,jsonData){ //>>>lib?
    if(options.key){
      var obj1 ={};
      obj1[options.key] = replaceTag(HtmlService.createHtmlOutputFromFile(options.fileName).getContent());
      return obj1;
    }else{
      return replaceTag(HtmlService.createHtmlOutputFromFile(options.fileName).getContent());
    }
  }

  function libraryApply(func,opt_library) { // 関数が有れば関数を、なければ　undefined　を返す。
        if(opt_library) { var lib = opt_library + '.'}else{ var lib = ""};
        var t = Function.call("",'return typeof(' + lib  + func + ')');
            if(t() == 'function') {
               var f = 'return function(args) { return ' + lib  + func + '.apply(this,args);}';
               return Function.call("",f)();
           }else{
               return undefined;
        }
  }

  function combine(obj1,obj2,opt_ward){
    var ward = opt_ward || ""
    if(isObject(obj1) && isObject(obj2)){
      for(var key in obj2){
        if(key != "escape"){
          if(typeof (obj2[key]) == "string" || obj2[key] instanceof String){
            if(obj1[key] !== undefined && obj1[key]){
              obj1[key] += ward + obj2[key];
            }else{
              obj1[key] = obj2[key];
            }
          }else if(isObject(obj2[key])){
            obj1[key] = marge(obj1[key],obj2[key])
          }else if(Object.prototype.toString.call(obj2[key]) === '[object Array]'){
            if(obj1[key] !== undefined && obj1[key] && Object.prototype.toString.call(obj1[key]) === '[object Array]'){
              obj1[key].concat(obj2[key]);
            }else{
              obj1[key] = obj2[key];
            }        
          }else{
          obj1[key] = obj2[key];
          }
        }else{ 
            obj1["escape"] = obj2["escape"]
        }
      }
    return obj1;
    }
  }

 function searchFunc(func,opt_library,opt_thisLibrary){ // not eval...?
    var library = "";
        if(opt_library && opt_library !== opt_thisLibrary){ library = opt_library };
    var libfunc = libraryApply(func,library);
        if(libfunc !== undefined) {
        var ary = []
            for (var i = 3; i < arguments.length; i++){
                ary.push(arguments[i])
            }
            return libfunc.call(this,ary);
        }else{
            return "non function"
        }
  }

function recursiveSearch(arg,i){
  var i = i || 0
  var args = JSON.parse(JSON.stringify(Array.prototype.slice.call(arguments[0])));
  var joints = args[0]
  var current = args[1]
   
  if(current !== undefined && current && joints.table[current.nextJoint[i]] !== undefined){
    var f = joints.table[current.nextJoint[i]].func || "multipleJoint"
    var libfunc = libraryApply(f);
    if(libfunc !== undefined) {
      var ary = [joints,
                 joints.table[current.nextJoint[i]],
                 joints.table[current.nextJoint[i]].options,
                 joints.table[current.nextJoint[i]].jsonData,]        
      if(joints.callbacks){
        for(var key in joints.callbacks){
          joints.callbacks[key].apply(this,ary);
        }
      }
      var ret = libfunc.call(this,ary);
      ret.escape = joints.table[current.nextJoint[i]].options
      return ret       
    }
  }
}
 
function searchParent(joints,current,obj1){ //<<<
  if(obj1.parent !== undefined && joints.table[current.parent] !== undefined){
    return searchParent(joints,joints.table[current.parent],obj1.parent)
  }else if(joints.table[current.parent] !== undefined){
    if(typeof (obj1) == "string" || obj1 instanceof String){
    return current[obj1]
    }else if(isObject(obj1)){
      var obj2 = {}
      for(var key in obj1){
        obj2[key] = current[key][obj1[key]]
        }
      return obj2
    }else{
      return "undefined"
    }
  }
}

function searchChild(joints,val,current,obj1){ //<<<
  return {}
}
 
  function getJointTable(obj,current,paramE){
    var data = current.jsonData
    var parent = {}
    if(current.nextJoint){
      for (var i = 0; i < current.nextJoint.length; i++){
        parent[current.nextJoint[i]] = current.jointName
      }
    }    
    obj = obj || {}
    obj.table = obj.table || {}
    var keyColumn = data.field.indexOf(data.linkField.jointName)
    var ary = loadSpreadSheet(data.spredSheetID,data.sheetName,data.offset)
    var joints = rowObjectJoint(ary,keyColumn,current,parent)
    
    obj["settings"]     = data
    obj["thisLibrary"]  = data.thisLibrary
    obj["paramE"]       = paramE
    obj["callbacks"]    = obj.callcacks || {}

    if(this["initialDatas"] !== undefined && current.func == "setDataJoint"){
      this["initialDatas"] = current
    }
    if(this["response"] !== undefined && current.func == "setPropertiesJoint"){
      this["response"] = current      
    }
    
    obj.table = marge(obj.table,joints)
    return obj;
  }

function rowObjectJoint(ary,keyColumn,current,opt_parent,opt_child){
  var obj = {}
  var index = {}
  var data = current.jsonData
  var parent = opt_parent || {}
  var child = opt_child || {}
  var parentName = {}
  var childName = {}
  obj[current.jointName] = current
  if(data.linkField !== undefined){
    for (var i = 0; i < data.field.length; i++){
      for(var key in data.linkField){
        if(data.field[i] == data.linkField[key]){
          data.field[i] = key;
        }
      }
    }
  }
  for (var i = 0; i < ary.length; i++){
    var name = data.sheetName + "R" + (i + (data.offset *1)) + ary[i][keyColumn]
    var jointName = ary[i][keyColumn]
    if(ary[i][keyColumn]){
    for (var j = 0; j < ary[i].length; j++){
      if(data.jsonField !== undefined && data.jsonField.indexOf(data.field[j]) >= 0 ){
        obj[name] = obj[name] || {};
        if(ary[i][j] !== undefined && ary[i][j]){
          obj[name][data.field[j]] = JSON.parse(ary[i][j]);
        }else{
          obj[name][data.field[j]] = ary[i][j] 
        };
      }else{
        obj[name] = obj[name] || {};
        obj[name][data.field[j]] = ary[i][j];
      };
    };
    if(obj[name]){
      if(obj[name]["options"][jointName] !== undefined && obj[name]["options"][jointName]){
      for(var key2 in obj[name]["options"][jointName]){
        if(!obj[name][key2] || obj[name][key2] == undefined){
          obj[name][key2] = obj[name]["options"][jointName][key2]
        }
      }
      delete obj[name]["options"][jointName]
    }
      parentName[jointName] = name
      obj[name]["rowIndex"] = i + Number(data.offset)
      obj[name]["rowName"] = data.sheetName
      obj[name]["jointKey"] = name
      obj[name]["spredSheetID"] = data.spredSheetID
      obj[name]["sheetName"] = data.sheetName
      obj[name]["offset"] = data.offset
      obj[name].parent = (parent[jointName] !== undefined && parent[jointName]) ? parent[jointName] : current.jointName
      obj[name].index = (index[jointName] !== undefined && index[jointName]) ? index[jointName] : 0
      if(obj[parent[jointName]] !== undefined && obj[parent[jointName]]){
        if(obj[parent[jointName]]["nextJoint"].indexOf(jointName) >= 0){
          obj[parent[jointName]]["nextJoint"][obj[parent[jointName]]["nextJoint"].indexOf(jointName)] = name
        }else{
          obj[parent[jointName]]["nextJoint"].push(name)
        }
      }else{
        child[jointName] = name
      }
      if(obj[name].nextJoint){
        var nameAry = obj[name].nextJoint
        if(childName[jointName] !== undefined && childName[jointName]){
          nameAry = (childName[jointName].length > nameAry.length) ? childName[jointName] : obj[name].nextJoint
        }
        for (var k = 0; k < nameAry.length; k++){
          parent[obj[name].nextJoint[k]] = name
          index[obj[name].nextJoint[k]] = k
          if(child[obj[name].nextJoint[k]]){
            obj[name].nextJoint[k] = child[obj[name].nextJoint[k]]            
          }else if(childName[jointName] !== undefined && childName[jointName] && childName[jointName][k]){
            obj[name].nextJoint[k] = childName[jointName][k]
          }
        }
      }else if(childName[jointName] !== undefined && childName[jointName]){
        obj[name].nextJoint = childName[jointName]
      }
      if(name.lastIndexOf("-") == name.length -2){
        var listName = jointName.split("-")
        var num =  listName.pop()
        listName = listName.join("-")
        obj[name].index = num
        if(parentName[listName] !== undefined && parentName[listName]){
          obj[name].parent = parentName[listName]
          obj[parentName[listName]]["nextJoint"] = obj[parentName[listName]]["nextJoint"] || []
          obj[parentName[listName]]["nextJoint"][num] = name
        }else{
          childName[listName] = childName[listName] || []
          childName[listName][num] = name
        }
      }
    }
  };
  }; 
  return obj
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
  
  function replaceTag(val){
    var ret = val.replace( /'<script>'/g , "" );
    ret = ret.replace( /'<\/script>'/g , "" );
    ret = ret.replace( /'<script\/>'/g , "" );
    return ret;
  }

  
  function isObject(o) {
      return (o instanceof Object && !(o instanceof Array)) ? true : false;
  };
      
  function isArray(a){
    return (Object.prototype.toString.call(a) === '[object Array]') ? true : false;
  }

  function isString(s){
    return (typeof (s) == "string" || s instanceof String) ? true : false;
  }

function timeStamp(arg){
  if(arg !== undefined && arg){
    return Moment.moment().format(arg)
  }else{
    return Moment.moment()
  }
}

  function getUserId(){
    return Session.getActiveUser().getUserLoginId();
  }

  function getUserEmail(){
    return Session.getActiveUser().getEmail();
  }

  function setContainer(param){
    return new SuzunariContainer(param)
  }

  function SuzunariContainer(parameter){ // <<<< cng

  // contens
    
    this.item = ["htmlTag",
                 "metaTag",
                 "viewport",
                 "browserTitle",
                 "faviconUrl",
                 "plugins",
                 "pluginCss",
                 "css",
                 "javascript",
                 "jqueryIni",
                 "contents"]
  
    this.parameter = parameter;
    
    this.initialDatas = {}
    this.response = {}
    
    this.htmlTag = ""
    this.metaTag = ""
    this.viewport = ""
    
    this.browserTitle = "";
    this.faviconUrl = "";
    this.initialData = {};
  
    this.plugins = ""
    this.pluginCss = ""
    this.css = ""
    this.javascript = ""
    this.jqueryIni = ""
  
    this.contents = "";
  
  // function
  
    this.evaluate = function() {
      var html = HtmlService.createTemplateFromFile('main');
      
      
      html.htmlTag = this.htmlTag
      html.metaTag = this.metaTag
  
      html.initialData = JSON.stringify(this.initialData);

      html.css = this.css;
      html.plugins = this.plugins;
      html.pluginCss = this.pluginCss;
      html.javascript = this.javascript;
      html.jqueryIni = this.jqueryIni;
    
      html.contents = this.contents;
   
      if(this.faviconUrl && this.browserTitle){
        var ret = html.evaluate().setTitle(this.browserTitle).setFaviconUrl(this.faviconUrl);
      }else if(this.browserTitle){
        var ret = html.evaluate().setTitle(this.browserTitle);
      }else if(this.faviconUrl){
        var ret = html.evaluate().setFaviconUrl(this.faviconUrl);
      } else {
        var ret = html.evaluate();
      }
      if(this.viewport){
      ret.addMetaTag('viewport',this.viewport)
      }
      return ret
    } 
  }