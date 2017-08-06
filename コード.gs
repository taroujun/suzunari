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
   return searchFunc.call(e,obj1.func,obj1.library,obj1.jsonData.thisLibrary,e,obj1,obj1.options,obj1.jsonData);
 }

function setLayoutJoint(joints,current,options,jsonData){
    arguments[0] = getJointTable({},current,this);
    current = arguments[0].table[current.jointName]
    var next = arguments[0].table[current.nextJoint[0]]
    arguments[1] = next
    arguments[2] = next.options
    arguments[3] = next.jsonData    
//    var val2 ={}
    var thisObj = setContainer(this)
    if(current.nextJoint){
      for (var i = 0; i < current.nextJoint.length; i++){     
        thisObj = combine(thisObj,recursiveSearch.call(thisObj,arguments,i))
      }
    }
  //thisObj.contents += JSON.stringify(next)
  if(this.parameter.dump !== undefined){
    return contentsDump.call(this,thisObj,JSON.parse(this.parameter.dump))
  }else{
  return thisObj
  }
}

function contentsDump(thisObj,param){
  var html = HtmlService.createTemplateFromFile('dumpDone');
  var obj = {}
  var ary = []
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
  obj["initialDatas"] = thisObj.initialDatas
  obj["initialData"] = getJointTable({},thisObj.initialDatas)

  obj["response"] = thisObj.response
  var url = "<a href='" + param.scriptUrl + "?jointData=" + JSON.stringify(joint) + "'>test</a>"
  var re = new RegExp("\"","g");
 // url = url.replace(re,"---");
  ary.push(JSON.stringify(obj)) 
  html.dump = url// url.replace(re,"\\\"");
  html.url = url
  writeSpreadsheet(param.spredSheetID,param.sheetName,ary,true,1,1);
  return html
}

function runningScriptJoint(joints,current,options,jsonData){
  var thisObj = setContainer(this)
  var ary = loadSpreadSheet(current.jsonData.spredSheetID,current.jsonData.sheetName,current.jsonData.offset,1,1,1,1)
  var data = JSON.parse(ary[0])
  thisObj = combine(thisObj,data.html)
  arguments[0] = data["initialData"]
  arguments[1] = data["initialDatas"]
  arguments[2] = data["initialDatas"].options
  arguments[3] = data["initialDatas"].jsonData    
  thisObj = combine(thisObj,recursiveSearch.call(thisObj,arguments,0))
  return thisObj
}

  function changeSheetJoint(joints,current,options,jsonData){
    current.jsonData = replaceContensTag(joints,current.jsonData,current,{})
    arguments[0] = getJointTable.call(this,joints,current,joints.paramE)
   if(current.nextJoint){
      for (var i = 0; i < current.nextJoint.length; i++){
        return recursiveSearch.call(this,arguments,i)
      }
    }else{
      return replaceContensTag(joints,jsonData,current,{}) //<<<?
    }
  }

  function setDataJoint(joints,current,options,jsonData){
    current.jsonData = replaceContensTag(joints,current.jsonData,current,{})
    var joints = getJointTable.call(this,joints,current,joints.paramE)
    arguments[0] = joints
 //   this.data.push({"joints":joints,"next":current.nextJoint})
    if(current.nextJoint){
      for (var i = 0; i < current.nextJoint.length; i++){
        return recursiveSearch.call(this,arguments,i)
      }
    }else{
      return replaceContensTag(joints,jsonData,current,{}) //<<<?
    }
  }

  function setPropertiesJoint(joints,current,options,jsonData){
    var data = {}
    data.joints = JSON.stringify(getJointTable.call(this,joints,current,joints.paramE))
    var props = PropertiesService.getScriptProperties();
    data.current = JSON.stringify(current)
    props.setProperties(data)
    return {}
  }

  function separateJoint(joints,current,options,jsonData){
    var val2 = {}
    if(current.nextJoint !== undefined && current.nextJoint){
      for (var i = 0; i < current.nextJoint.length; i++){
        var ret = recursiveSearch.call(this,arguments,i);
        val2 = combine(val2,replaceNextTag.call(this,joints,current,ret))
      }
      return val2;
    }else{
      var ret = {}
      if(jsonData && options){
        ret = replaceContensTag(joints,jsonData,current,{})
      }else if(jsonData){
        ret = jsonData
      }
      ret.escape = options || {}
      return ret
    }
  }

  function arrayJoint(joints,current,options,jsonData){
    var val2 = {}
    var ary =[]
    if(current.nextJoint){
      for (var i = 0; i < current.nextJoint.length; i++){
        var ret = recursiveSearch.call(this,arguments,i)
        delete ret.escape
        ary.push(ret)
      }
    }else{
      ary.push(replaceContensTag(joints,jsonData,current,{}))
    }
    if(options.releaseVal){
      stackReleaseVal.call(val2,options.releaseVal,ary)
    }else{
      val2["tempReleaseVal"] = ary
    }
    return val2
  }

  function multipleJoint(joints,current,options,jsonData){
    var val2 = {}
    if(current.nextJoint !== undefined && current.nextJoint){
      for (var i = 0; i < current.nextJoint.length; i++){
        var ret = recursiveSearch.call(this,arguments,i);
        val2 = combine(val2,replaceContensTag(joints,ret,current,{}));
      }
      return combine(replaceContensTag(joints,jsonData,current,val2),val2)
    }else{
      var ret = {}
      if(jsonData && options){
        ret = replaceContensTag(joints,jsonData,current,{})
      }else if(jsonData){
        ret = jsonData
      }
      ret.escape = options || {}
      return ret
    }
 }

function writeSheetJoint(joints,current,options,jsonData){
  var ary = []
  var val2 = multipleJoint.call(this,joints,current,options,jsonData)
/*  if(current.nextJoint && current !== undefined){
    for (var i = 0; i < current.nextJoint.length; i++){
       var ret = recursiveSearch.call(this,arguments,i);
      val2 = combine(val2,replaceContensTag(joints,ret,current,{}));
    }
    val2 = combine(replaceContensTag(joints,jsonData,current,val2),val2)
  }else{
    val2 = replaceContensTag(joints,jsonData,current,{})
  }*/
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
  return jsonData.spredSheetID
}

function stackObjectJoint(joints,current,options,jsonData){
  var val2 = {}
  if(current.nextJoint && current !== undefined){
    for (var i = 0; i < current.nextJoint.length; i++){
       var ret = recursiveSearch.call(this,arguments,i);
      val2 = recursiveMarge(val2,replaceContensTag(joints,ret,current,{}));
    }
//    val2 = combine(replaceContensTag(joints,jsonData,current,val2),val2)
  }else{
    val2 = replaceContensTag(joints,jsonData,current,{})
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

function loadSheetJoint(joints,current,options,jsonData){
  var val2 = multipleJoint.call(this,joints,current,options,jsonData)
/*  if(current.nextJoint && current !== undefined){
    for (var i = 0; i < current.nextJoint.length; i++){
       var ret = recursiveSearch.call(this,arguments,i);
      val2 = combine(val2,replaceContensTag(joints,ret,current,{}));
    }
    val2 = combine(replaceContensTag(joints,jsonData,current,val2),val2)
  }else{
    val2 = replaceContensTag(joints,jsonData,current,{})
  }*/
  var sheet = loadSpreadSheet(jsonData.spredSheetID,jsonData.sheetName,jsonData.startRow,jsonData.endRow,jsonData.startCol,jsonData.endCol);
  if(options.releaseVal){
      stackReleaseVal.call(val2,options.releaseVal,sheet)
  }else{
    val2["tempReleaseVal"] = sheet
  }
  return val2
}

  function jsonStringifyJoint(joints,current,options,jsonData){
    var val = multipleJoint.call(this,joints,current,options,jsonData)
    var val2 = {}
    if(options.releaseVal){
      stackReleaseVal.call(val2,options.releaseVal,JSON.stringify(val))
    }else{
      val2["tempReleaseVal"] = JSON.stringify(val)
    }
    //this.contents += val.nextJoint//joints.table[current.jointKey].nextJoint[0]
    return val2
  }



function arrayObjectJoint(joints,current,options,jsonData){
  var val2 = multipleJoint.call(this,joints,current,options,jsonData)
/*    if(current.nextJoint){
      if(current.nextJoint && current !== undefined){
        for (var i = 0; i < current.nextJoint.length; i++){
          var ret = recursiveSearch.call(this,arguments,i);
          val2 = combine(val2,replaceContensTag(joints,ret,current,{}));
        }
        val2 = combine(replaceContensTag(joints,jsonData,current,val2),val2)
      }else{
        val2 = replaceContensTag(joints,jsonData,current,{})
      }*/
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
  //  }
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
    var joints = JSON.parse(props.getProperty("joints"))
    var current = JSON.parse(props.getProperty("current"))
    var joint = joints.table[req.jointName]
//    current.rowName = "current"
//    joint.rowName = "next"
//    joint.prev = current.jointName
    joint.parent = current.jointName  //???? jointKey?
    joints.table[joint.jointName] = joint
    return searchFunc.call(req,joint.func,joint.library,joints.thisLibrary,joints,current,joint,joint.options,joint.jsonData);
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
 
function replaceNextTag(joints,current,ret){
  var val1 = replaceContensTag(joints,ret,current,{})
  var val2 = replaceContensTag(joints,current.jsonData,current,ret.escape)
  var val3 = replaceContensTag(joints,val2,current,val1)
//  this.content += JSON.stringify(val3) + current.jointName + "<br><br>"
 return marge(val3,val1)
} 
function replaceContensTag(joints,target,current,ret){
  var rep = {}
  var obj1 = margeFanc(joints,current,ret)
  if(target !== undefined && target && obj1 !== undefined && obj1){
    if(typeof (target) == "string" || target instanceof String){
      rep = replaceTemplateTag(target,obj1)
    }else if(isObject(target)){
      rep = JSON.parse(replaceTemplateTag(JSON.stringify(target),obj1))
    }
  }
  return rep;
}

function margeFanc(joints,current,obj1){
  var obj2 = {}
  if(current !== undefined && obj1 !== undefined){
  obj1 = marge(obj1,current.options)
  obj1 = marge(obj1,obj1.escape)
  delete obj1.escape
  obj1 = obj1 || {}
  for(var key in obj1){
    if(obj1[key].func !== undefined && key !== current.jointName){
      var ary = []
      var row2 = current
      var library = obj1[key].library || ""
      var argAry = obj1[key].argAry || ""
      var thisLibrary = joints.thisLibrary || ""
      if(obj1[key].nextJoint){
        row2 = joints[obj1[key].nextJoint]        
      }
      ary.push(obj1[key].func);
      ary.push(library);
      ary.push(thisLibrary)
      if(obj1[key].func.indexOf("Joint") ===  obj1[key].func.length - 5){
      ary.push(joints)
      ary.push(row2)
        }
      ary.push(argAry)
      obj2[key] = searchFunc.apply(this,ary);
    }else if(obj1[key].parent !== undefined){
      var ret = searchParent(joints,current,obj1[key])
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
    }else if(obj1[key].child !== undefined){
      obj2[key] = searchChild(joints,current,obj1[key])
    }else{
      obj2[key] = obj1[key]
    }
  }
    internalReplaceWord.call(obj2,joints,current)
  return obj2
  }
}

function internalReplaceWord(joints,current){
  this.nameSpace = current.nameSpace//joints.sheetName + "R" + current.rowIndex + "I" + current.index
  this.spredSheetID = current.spredSheetID
  this.sheetName = current.sheetName
  this.offset = current.offset
  this.jointName = current.jointName
  this.nextJoint = current.nextJoint
  this.index = current.index
  this.rowIndex = current.rowIndex
//  this.prev = current.prev
  if(joints.paramE){
    for(var key in joints.paramE.parameter){
      this[key] = joints.paramE.parameter[key]
    }
  }
}

function searchParent(joints,current,obj1){ //<<<
  if(obj1.parent !== undefined && obj.table[current.parent] !== undefined){
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
    
    obj.table = marge(joints,obj.table)
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
      if(obj[parent[jointName]] !== undefined && obj[parent[jointName]]){
        obj[name].parent = (parent[jointName] !== undefined && parent[jointName]) ? parent[jointName] : ""
        obj[name].index = (index[jointName] !== undefined && index[jointName]) ? index[jointName] : 0
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
                 "title",
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
    
    this.title = "";
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
    
      if(this.faviconUrl && this.title){
        var ret = html.evaluate().setTitle(this.title).setFaviconUrl(this.faviconUrl);
      }else if(this.title){
        var ret = html.evaluate().setTitle(this.title);
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