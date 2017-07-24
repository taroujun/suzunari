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
   var obj1 = JSON.parse(e.parameter.jointData);
   var obj = getJointTable(obj1,e);
   var next = obj.table[obj1[obj1.jsonData.linkField.nextJoint]];
   obj.log[obj1.jointName] = JSON.parse(JSON.stringify(obj1))
   obj1.rowName = "current"
   next.rowName = "next"

   return searchFunc.call(e,next.func,next.library,obj1.jsonData.thisLibrary,obj,obj1,next,next.options,next.jsonData);
 }

function setLayoutJoint(obj,val,row,options,jsonData){
    var val2 ={}
    var thisObj = searchFunc.call(this,jsonData.func,jsonData.library,obj.thisLibrary,obj,row,val,options,jsonData);
    if(jsonData.title !== undefined){thisObj.title = jsonData.title}
    obj.log[row.jointName] = JSON.parse(JSON.stringify(row))
    if(jsonData.faviconUrl !== undefined){thisObj.faviconUrl = jsonData.faviconUrl}   
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){     
        thisObj = combine(thisObj,recursiveSearch.call(thisObj,arguments,i))
      }
      thisObj.content += replaceTag(thisObj.jqueryIni)//JSON.stringify(thisObj.data)
      return thisObj
    }
  return thisObj
  }

  function changeSheetJoint(obj,val,row,options,jsonData){
    arguments[0] = getJointTable(row,obj.paramE,obj)
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){
        return recursiveSearch.call(this,arguments,i)
      }
    }else{
      return replaceContensTag(obj,jsonData,row,{}) //<<<?
    }
  }

  function setPropertiesJoint(obj,val,row,options,jsonData){
    var data = {}
    data.joints = JSON.stringify(getJointTable(row,obj.paramE,obj))
    var props = PropertiesService.getScriptProperties();
    data.row = JSON.stringify(row)
    props.setProperties(data)
    return {}
  }

  function separateJoint(obj,val,row,options,jsonData){
    var val2 = {}
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){
        var ret = recursiveSearch.call(this,arguments,i);
        val2 = combine(val2,replaceNextTag.call(this,obj,row,ret))
      }
  //      this.content += JSON.stringify(val2) + row.jointName + "<br><br>"
      return val2;
    }else{
      return replaceContensTag(obj,jsonData,row,{})
    }
  }

  function arrayJoint(obj,val,row,options,jsonData){
    var val2 = {}
    var ary =[]
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){
        var ret = recursiveSearch.call(this,arguments,i)
        delete ret.escape
        ary.push(ret)
      }
    }else{
      ary.push(replaceContensTag(obj,jsonData,row,{}))
    }
    if(options.releaseVal){
      stackReleaseVal.call(val2,options.releaseVal,ary)
    }else{
      val2["tempReleaseVal"] = ary
    }
    return val2
  }

  function multipleJoint(obj,val,row,options,jsonData){
    var val2 = {}
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){
        var ret = recursiveSearch.call(this,arguments,i);
        val2 = combine(val2,replaceContensTag(obj,ret,row,{}));
      }
      return combine(replaceContensTag(obj,jsonData,row,val2),val2)
    }else{
      return replaceContensTag(obj,jsonData,row,{})
    }
 }

function writeSheetJoint(obj,val,row,options,jsonData){
  var ary = []
  var val2 = {}
  if(row.nextJoint && row !== undefined){
    for (var i = 0; i < row.nextJoint.length; i++){
       var ret = recursiveSearch.call(this,arguments,i);
      val2 = combine(val2,replaceContensTag(obj,ret,row,{}));
    }
    val2 = combine(replaceContensTag(obj,jsonData,row,val2),val2)
  }else{
    val2 = replaceContensTag(obj,jsonData,row,{})
  }
  for(var i = 0; i < jsonData.field.length; i++){
    if(val2 && val2[jsonData.field[i]] !== undefined){
      if(jsonData.jsonField !== undefined && jsonData.jsonField.indexOf(jsonData.field[i]) >= 0){
        ary.push(JSON.stringify(val2[jsonData.field[i]]))
      }else{
      ary.push(val2[jsonData.field[i]])
      }
    }else if(this.req && this.req[jsonData.field[i]] !== undefined){
      if(jsonData.jsonField !== undefined && jsonData.jsonField.indexOf(jsonData.field[i]) >= 0){
        ary.push(JSON.stringify(this.req[jsonData.field[i]]))
      }else{
      ary.push(this.req[jsonData.field[i]])
      }
    }else{
      ary.push(jsonData.emptyWord || "")
    }
  }
  writeSpreadsheet(jsonData.spredSheetID,jsonData.sheetName,ary,true,jsonData.startRow,jsonData.startCol);
  return val.jointName + "=" + row.parent
}

function stackObjectJoint(obj,val,row,options,jsonData){
  var val2 = {}
  if(row.nextJoint && row !== undefined){
    for (var i = 0; i < row.nextJoint.length; i++){
       var ret = recursiveSearch.call(this,arguments,i);
      val2 = recursiveMarge(val2,replaceContensTag(obj,ret,row,{}));
    }
//    val2 = combine(replaceContensTag(obj,jsonData,row,val2),val2)
  }else{
    val2 = replaceContensTag(obj,jsonData,row,{})
  }
//  this.content += JSON.stringify(val2)
  for(var key in jsonData){
      var rel2 = {}
      var obj2 = {}
    if(isObject(jsonData[key])){
      for(var key2 in jsonData[key]){
        rel2 = jsonData[key][key2]
        obj2[key] = {}
        obj2[key][key2] = val2[key]
      }
      if(val2[key]){
        stackReleaseVal.call(val2,rel2,obj2)
      }
    }else{
      val2[jsonData[key]] = {}
      val2[jsonData[key]][key] = val2[key]
    }
    delete val2[key]
  }
  
  return val2
}

function recursiveMarge(obj1,obj2){
  for(var key in obj2){
    if(obj1[key] !== undefined && obj1[key]){
      obj1[key] = recursiveMarge(obj1[key],obj2[key]);
    }else{
      obj1[key] = obj2[key]
    }
  }
  return obj1
}

function stackReleaseVal(rel,val){
  if(isObject(rel)){
    var rel2 = {}
    var obj2 = {}
    for(var key in rel){
      rel2 = rel[key]
      obj2[key] = val
    }
    stackReleaseVal.call(this,rel2,obj2)
  }else{
    this[rel] = val
  }
}

function stackObject(stack,val,key,del){
  var obj = {}
  if(stack[key] !== undefined){
    obj[key] = val
    if(this[key] !== undefined){
      obj[key] = marge(obj[key],this[key])
      delete this[key]
    }
    stackObject.call(this,stack,obj,stack[key])
  }else{
    if(this[key] !== undefined){
      obj[key] = val
      this[key] = marge(this[key],obj[key])
    }else{
     this[key] = val
     delete this[del]
    }
  }
}

function loadSheetJoint(obj,val,row,options,jsonData){
  var val2 = {}
  if(row.nextJoint && row !== undefined){
    for (var i = 0; i < row.nextJoint.length; i++){
       var ret = recursiveSearch.call(this,arguments,i);
      val2 = combine(val2,replaceContensTag(obj,ret,row,{}));
    }
    val2 = combine(replaceContensTag(obj,jsonData,row,val2),val2)
  }else{
    val2 = replaceContensTag(obj,jsonData,row,{})
  }
  var sheet = loadSpreadSheet(jsonData.spredSheetID,jsonData.sheetName,jsonData.startRow,jsonData.endRow,jsonData.startCol,jsonData.endCol);
  if(options.releaseVal){
      stackReleaseVal.call(val2,options.releaseVal,sheet)
  }else{
    val2["tempReleaseVal"] = sheet
  }
  return val2
}

  function jsonStringifyTwig(obj,val,row,options,jsonData){
    var val2 = {}
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){
        val2 = combine(val2,recursiveSearch.call(this,arguments,i))
      }
      
    }
  if(options.releaseVal){
      stackReleaseVal.call(val2,options.releaseVal,val2)
  }else{
    val2["content"] = JSON.stringify(val2)
  }
  return val2
  }

function arrayObjectJoint(obj,val,row,options,jsonData){
  var val2 = {}
    if(row.nextJoint){
      if(row.nextJoint && row !== undefined){
        for (var i = 0; i < row.nextJoint.length; i++){
          var ret = recursiveSearch.call(this,arguments,i);
          val2 = combine(val2,replaceContensTag(obj,ret,row,{}));
        }
        val2 = combine(replaceContensTag(obj,jsonData,row,val2),val2)
      }else{
        val2 = replaceContensTag(obj,jsonData,row,{})
      }
      var val3 = {}
      if(val2.tempReleaseVal)val3 =val2.tempReleaseVal
      if(options.catchVal)val3 = val2[options.catchVal]
   //   this.content += JSON.stringify(jsonData.fieldName)
      var sheet = castArraylist(val3,jsonData.fieldName,jsonData.jsonField,jsonData.emptyWord)
      if(options.releaseVal){
        stackReleaseVal.call(val2,options.releaseVal,sheet)
      }else{
        val2["tempReleaseVal"] = sheet
      }
      return val2
    }
}

function castArraylist(ary,fieldName,opt_jsonField,opt_word){
  opt_word = opt_word || ""
  var re = []
  for (var i = 0; i < ary.length; i++){
    var obj = {};
    for (var j = 0; j < ary[i].length; j++){
      if(fieldName[j]){
        if(ary[i][j] && opt_jsonField && opt_jsonField.indexOf(fieldName[j]) >= 0 ){
          obj[fieldName[j]] = JSON.parse(ary[i][j]);
        }else if(ary[i][j]){
          obj[fieldName[j]] = ary[i][j];
        } else {
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
  

  function libraryFileTwig(obj,val,row,options,jsonData){ //>>>lib?
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
//            if(obj1[key] == obj2[key]){
//              obj1[obj1[key]][key] = obj2[key]//<<<<
//            }else{
            obj1[key] = marge(obj1[key],obj2[key])
//            }
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

  function requestSearch(req) { //<<< cng! here
    var props = PropertiesService.getScriptProperties();
    var obj = JSON.parse(props.getProperty("joints"))
    var row = JSON.parse(props.getProperty("row"))
    var joint = obj.table[req.jointName]
    row.rowName = "current"
    joint.rowName = "next"
    joint.prev = row.jointName
    joint.parent = row.jointName
    obj.log[joint.jointName] = joint
    return searchFunc.call(req,joint.func,joint.library,obj.thisLibrary,obj,row,joint,joint.options,joint.jsonData);
  }

 function recursiveSearch(arg,i){
   var args = Array.prototype.slice.call(arguments[0]);
   args = JSON.parse(JSON.stringify(args))
   var args2 = Array.prototype.slice.call(arguments);
   var i = i || 0
   args = args.concat(args2)
   for (var j = 0; j < arguments[0].length; j++){
     if(isObject(args[j])){
       if(args[j].callbacks !== undefined){
         var obj = args[j]
         }else if(args[j].rowName == "next"){
           var row = args[j]
           }else if(args[j].rowName == "current"){
             var val = args[j]
           }
     }
   }
   if(row && row !== undefined){
     if(obj.table[row.nextJoint[i]].func){
         var func = obj.table[row.nextJoint[i]].func
         var next = obj.table[row.nextJoint[i]]
         var lib = ""
         lib = row.library !== undefined  && row.library !== obj.thisLibrary && row.library
       var libfunc = libraryApply(func,lib);
       if(libfunc !== undefined) {
         if(obj.table[row.jointName])obj.table[row.jointName].rowName = "current"
         if(next)next.rowName = "next"
         obj.table[row.nextJoint[i]].prev = row.jointName //<<
         obj.log[row.nextJoint[i]] = JSON.parse(JSON.stringify(obj.table[row.nextJoint[i]]))
         
         var ary = [obj,
                    obj.table[row.jointName],
                    obj.table[row.nextJoint[i]],
                    obj.table[row.nextJoint[i]].options,
                    obj.table[row.nextJoint[i]].jsonData,]
         for (var k = 5; k < arguments.length; k++){
           ary.push(arguments[k])
         }                  
         if(obj.callbacks){
           for(var key in obj.callbacks){
             obj.callbacks[key].apply(this,ary);
           }
         }
       var ret = libfunc.call(this,ary);
       ret.escape = obj.log[row.nextJoint[i]].options
         return ret
       }
     }else{
       obj.log[row.nextJoint[i]] = JSON.parse(JSON.stringify(obj.table[row.nextJoint[i]]))
       var ret = replaceContensTag(obj,obj.table[row.nextJoint[i]].jsonData,obj.table[row.nextJoint[i]],{})
       ret.escape = obj.log[row.nextJoint[i]].options
         return ret
     }
   }
 }
 
function replaceNextTag(obj,row,ret){
  var val1 = replaceContensTag(obj,ret,row,{})
  var val2 = replaceContensTag(obj,row.jsonData,row,ret.escape)
  var val3 = replaceContensTag(obj,val2,row,val1)
//  this.content += JSON.stringify(val3) + row.jointName + "<br><br>"
 return marge(val3,val1)
} 
function replaceContensTag(obj,target,row,ret){
  var rep = {}
  var obj1 = margeFanc(obj,row,ret)
  if(target !== undefined && target && obj1 !== undefined && obj1){
    if(typeof (target) == "string" || target instanceof String){
      rep = replaceTemplateTag(target,obj1)
    }else if(isObject(target)){
      rep = JSON.parse(replaceTemplateTag(JSON.stringify(target),obj1))
    }
  }
  return rep;
}

function margeFanc(obj,row,obj1){
  var obj2 = {}
  if(row !== undefined && obj1 !== undefined){
  obj1 = marge(obj1,row.options)
  obj1 = marge(obj1,obj1.escape)
  delete obj1.escape
  obj1 = obj1 || {}
  for(var key in obj1){
    if(obj1[key].func !== undefined && key !== row.jointName){
      var ary = []
      var row2 = row
      var library = obj1[key].library || ""
      var augAry = obj1[key].augAry || []
      if(obj1[key].nextJoint){
        row2 = obj[obj1[key].nextJoint]        
      }
      ary.push(obj1[key].func);
      ary.push(library);
      ary.push(obj.thisLibrary)
      if(obj1[key].func.indexOf("Joint") ===  obj1[key].func.length - 5){
      ary.push(obj)
      ary.push(row2)
        }
      ary.concat(augAry)
      obj2[key] = searchFunc.apply(this,ary);
    }else if(obj1[key].parent !== undefined){
      var ret = searchParent(obj,row,obj1[key])
          if(typeof (ret) == "string" || ret instanceof String){
            obj2[key] = ret
          }else if(isObject(ret) && ret !== undefined && ret){
            for(var key2 in ret){
              if(row[key2] !== undefined && isObject(row[key2])){
                row[key2][key] = ret[key2]
              }
            }
          }else{
            obj2[key] = JSON.stringify(ret)
          }
    }else if(obj1[key].child !== undefined){
      obj2[key] = searchChild(obj,row,obj1[key])
    }else{
      obj2[key] = obj1[key]
    }
  }
    internalReplaceWord.call(obj2,obj,row)
  return obj2
  }
}

function internalReplaceWord(obj,row){
  this.nameSpace = row.nameSpace//obj.sheetName + "-" + row.rowIndex + "-" + row.index
  this.spredSheetID = obj.spredSheetID
  this.sheetName = obj.sheetName
  this.offset = obj.offset
  this.jointName = row.jointName
  this.nextJoint = row.nextJoint
  this.index = row.index
  this.rowIndex = row.rowIndex
  this.prev = row.prev
  if(obj.paramE){
    for(var key in obj.paramE.parameter){
      this[key] = obj.paramE.parameter[key]
    }
  }
}

function searchParent(obj,row,obj1){ //<<<
  if(obj1.parent !== undefined && obj.log[row.parent] !== undefined){
    return searchParent(obj,obj.log[row.parent],obj1.parent)
  }else if(obj.log[row.parent] !== undefined){
    if(typeof (obj1) == "string" || obj1 instanceof String){
    return row[obj1]
    }else if(isObject(obj1)){
      var obj2 = {}
      for(var key in obj1){
        obj2[key] = row[key][obj1[key]]
        }
      return obj2
    }else{
      return "undefined"
    }
  }
}

function searchChild(obj,val,row,obj1){ //<<<
  return {}
}
 
  function getJointTable(obj,paramE,obj1){
    var data = obj.jsonData
    var parent = {}
    if(obj.nextJoint){
      for (var i = 0; i < obj.nextJoint.length; i++){
        parent[obj.nextJoint[i]] = obj.jointName
      }
    }    
    obj1 = obj1 || {}
    obj1.log = obj1.log || {}
    var keyColumn = data.field.indexOf(data.linkField.jointName)
    var ary = loadSpreadSheet(data.spredSheetID,data.sheetName,data.offset)
    obj1["spredSheetID"] = data.spredSheetID,
    obj1["sheetName"]    = data.sheetName,
    obj1["offset"]       = data.offset,
    obj1["settings"]     = data,
    obj1["thisLibrary"]  = data.thisLibrary,
    obj1["paramE"]       = paramE,
    obj1["prev"]         = [],
    obj1["list"]         = [],
    obj1["callbacks"]    = obj1.callcacks || {}
              
    obj1.table = rowObjectJoint(ary,keyColumn,data,parent)
    return obj1;
  }

function rowObjectJoint(ary,keyColumn,data,opt_parent){
  var obj = {}
  var list = {}
  var index = {}
  var parent = opt_parent || {}
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
    for (var j = 0; j < ary[i].length; j++){
      if(data.jsonField !== undefined && data.jsonField.indexOf(data.field[j]) >= 0 ){
        obj[ary[i][keyColumn]] = obj[ary[i][keyColumn]] || {};
        if(ary[i][j] !== undefined && ary[i][j]){
          obj[ary[i][keyColumn]][data.field[j]] = JSON.parse(ary[i][j]);
        }else{
          obj[ary[i][keyColumn]][data.field[j]] = ary[i][j] 
        };
      }else{
        obj[ary[i][keyColumn]] = obj[ary[i][keyColumn]] || {};
        obj[ary[i][keyColumn]][data.field[j]] = ary[i][j];
      };
    };
    if(obj[ary[i][keyColumn]]){
      obj[ary[i][keyColumn]]["rowIndex"] = i + Number(data.offset)
      obj[ary[i][keyColumn]]["rowName"] = obj.sheetName
      if(obj[ary[i][keyColumn]].nextJoint){
        for (var k = 0; k < obj[ary[i][keyColumn]].nextJoint.length; k++){
          var obj2 = {}
          parent[obj[ary[i][keyColumn]].nextJoint[k]] = ary[i][keyColumn]
          index[obj[ary[i][keyColumn]].nextJoint[k]] = k
        }
      }
      if(ary[i][keyColumn].lastIndexOf("-") == ary[i][keyColumn].length -2){
        var listName = ary[i][keyColumn].split("-")
        var num =  listName.pop()
        listName = listName.join("-")
        list[listName] = list[listName] || []
        list[listName][num] = ary[i][keyColumn]
        parent[ary[i][keyColumn]] = listName
      }
    }
  };
  for(var key in obj){
    if(obj[key]["options"][key] !== undefined && obj[key]["options"][key]){
      for(var key2 in obj[key]["options"][key]){
        if(!obj[key][key2] || obj[key][key2] == undefined){
          obj[key][key2] = obj[key]["options"][key][key2]
        }
      }
      delete obj[key]["options"][key]
    }
    obj[key]["parent"] = parent[key]
    obj[key]["index"] = index[key]
    obj[key]["nameSpace"] = data.sheetName + "R" + obj[key].rowIndex + "I" + obj[key].index
    if(list[key] !== undefined && !obj[key].nextJoint){
      obj[key].nextJoint = obj[key].nextJoint || {}
      obj[key].nextJoint = list[key]
    }
  }
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
  
  function replaceTemplateTag(text,obj){
      for(var key in obj){
          var re = new RegExp("<\\?=? *(" + key + "|this." + key + ") *\\?>","g");
          text = text.replace(re,obj[key]);
      }
    return text;
  }

  function replaceTag(val){
    var ret = val.replace( /'<script>'/g , "" );
    ret = ret.replace( /'<\/script>'/g , "" );
    ret = ret.replace( /'<script\/>'/g , "" );
    return ret;
  }

  
  var isObject = function(o) {
      return (o instanceof Object && !(o instanceof Array)) ? true : false;
  };

  function getUserId(){
    return Session.getActiveUser().getUserLoginId();
  }

  function getUserEmail(){
    return Session.getActiveUser().getEmail();
  }

  function setContainer(obj,val,row,options,jsonData){
    return new SuzunariContainer(val)
  }

  function SuzunariContainer(parameter){ // <<<< cng

  // contens 
  
    this.parameter = parameter;  
    this.title = "suzunari";
    this.faviconUrl = "https://dl.dropboxusercontent.com/s/5ksh84yv74revaa/Suzunari.ico";
    this.settings = {};
    this.data = {};
    this.contensList = ["css","plugins","pluginCss","javascript","jqueryIni","navberHeader","header","content","modal","footer","navbarFooter"]
  
    this.css = ""
    this.plugins = ""
    this.pluginCss = ""
    this.javascript = ""
    this.jqueryIni = ""
  
    this.navbarHeader = "";
    this.header = '<h4>Suzunari</h4>';
    this.content = "";
    this.modal = "";
    this.footer = "<small><a href='#'> Suzunari since 2017 made japan.</a></small><br>";
    this.navbarFooter = "";
  
  // function
  
    this.evaluate = function() {
      var html = HtmlService.createTemplateFromFile('main');
  
      html.settings = JSON.stringify(this.settings);
      html.data = JSON.stringify(this.data);

      html.css = this.css;
      html.plugins = this.plugins;
      html.pluginCss = this.pluginCss;
      html.javascript = this.javascript;
      html.jqueryIni = this.jqueryIni;
    
      html.navbarHeader = this.navbarHeader
      html.header = this.header// + "</div>";
      html.modal = this.modal;
      html.content = this.content;   
      html.footer = this.footer;
      html.navbarFooter = this.navbarFooter
    
      if(this.faviconUrl && this.title){
        return html.evaluate().setTitle(this.title).setFaviconUrl(this.faviconUrl);
      }else if(this.title){
        return html.evaluate().setTitle(this.title);
      }else if(this.faviconUrl){
        return html.evaluate().setFaviconUrl(this.faviconUrl);
      } else {
        return html.evaluate();
      }
    }  
  }