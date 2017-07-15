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
   var jsonData = obj1.jsonData;  // <<<<<<<< 固定？
   var obj = getJointTable(jsonData,e);
   var next = obj[obj1[jsonData.linkField.nextJoint]];
   obj1.rowName = "current"
   next.rowName = "next"
   ScriptProperties.setProperty(obj1.jointName,JSON.stringify(obj1))
   return searchFunc.call(e,next.func,next.library,jsonData.thisLibrary,obj,obj1,next,next.options,next.jsonData);
 }

function setLayoutJoint(obj,val,row,aug,jsonData){
    var val2 ={}
    var thisObj = searchFunc.call(this,jsonData.func,jsonData.library,obj.thisLibrary,obj,row,val,aug,jsonData);
    if(jsonData.title !== undefined){thisObj.title = jsonData.title}
    if(jsonData.faviconUrl !== undefined){thisObj.faviconUrl = jsonData.faviconUrl}   
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){     
        thisObj = combine(thisObj,recursiveSearch.call(thisObj,arguments,i))
      }
      return thisObj
    }
  return thisObj
  }

  function loadSheetJoint(obj,val,row,aug,jsonData){
    arguments[0] = getJointTable(jsonData,obj.paramE)
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){
        return recursiveSearch.call(this,arguments,i)
      }
    }else{
      return replaceContensTag(obj,val,row,{}) //<<<?
    }
  }
  function setPropertiesJoint(obj,val,row,aug,jsonData){
    var data = getJointTable(jsonData,obj.paramE)
    var props = PropertiesService.getScriptProperties();
    for(var key in data){
      if(isObject(data[key])){
      data[key] = JSON.stringify(data[key])
      }
    }
    props.setProperties(data)
    return {}
  }

  function separateJoint(obj,val,row,aug,jsonData){
    var val2 = {}
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){     
        val2 = combine(val2,replaceContensTag(obj,val,row,replaceNextTag(obj,val,row,recursiveSearch.call(this,arguments,i))))
      }
      return val2;
    }else{
      return replaceContensTag(obj,val,row,{})
    }
  }

  function multipleJoint(obj,val,row,aug,jsonData){
    var val2 = {}
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){
        val2 = combine(val2,replaceNextTag(obj,val,row,recursiveSearch.call(this,arguments,i)));
      }
      return combine(replaceContensTag(obj,val,row,val2),val2)
    }else{
      return replaceContensTag(obj,val,row,{})
    }
 }

  function libraryFileTwig(obj,val,row,aug,jsonData){ //>>>lib?
    if(aug.key){
      var obj1 ={};
      obj1[aug.key] = replaceTag(HtmlService.createHtmlOutputFromFile(aug.fileName).getContent());
      return obj1;
    }else{
      return replaceTag(HtmlService.createHtmlOutputFromFile(aug.fileName).getContent());
    }
  }

  function jsonStringifyTwig(obj,val,row,aug,jsonData){
    var val2 = {}
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){     
        val2 = marge(replaceContensTag.call(this,obj,row,recursiveSearch.call(this,arguments,i)),val2)
      }
    return JSON.stringify(val2); //>>>どこに？
    }else{
      return JSON.stringify(replaceContensTag(obj,val,row,{})) //>>>どこに？
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
    var joint = JSON.parse(props.getProperty(req.jointName))
//    return JSON.stringify(req)
    return JSON.stringify(props.getProperty(req.jointName))
//    var  lib = libraryFanc("suzunariCatchRequest",castLibName(req.libName),4);
//    return searchFunc.call(e,next.func,next.library,jsonData.thisLibrary,obj,obj1,next,next.options,next.jsonData);
  }
function catchRequestJoint(obj,val,row,aug,jsonData){
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
     if(obj[row.nextJoint[i]].func){
         var func = obj[row.nextJoint[i]].func || obj[row.nextJoint[i]].options[obj[row.nextJoint[i]].jointName].func
         var next = obj[row.nextJoint[i]]
         var lib = ""
         if(row.library !== undefined && row.library && row.library !== obj.thisLibrary ){
           lib = row.library
         }else if(row.options[row.jointName] !== undefined){
           if(row.options[row.jointName].library !== undefined &&row.options[row.jointName].library && row.options[row.jointName].library !== obj.thisLibrary){
             lib = row.options[row.jointName].library
           }
         }
       var libfunc = libraryApply(func,lib);
       if(libfunc !== undefined) {
         if(obj[row.jointName])obj[row.jointName].rowName = "current"
         if(next)next.rowName = "next"
         obj[row.nextJoint[i]].prev = row.jointName
         var ary = [obj,
                    row,
                    next,
                    next.options,
                    next.jsonData]
         for (var k = 5; k < arguments.length; k++){
           ary.push(arguments[k])
         }                  
         if(obj.callbacks){
           for(var key in obj.callbacks){
             obj.callbacks[key].apply(this,ary);
           }
         }
         return libfunc.call(this,ary);
       }
     }else{
       return replaceContensTag(obj,row,obj[row.nextJoint[i]],{})
     }
   }
 }

function replaceContensTag(obj,val,row,ret){
  var obj1 = margeFanc(obj,val,row,ret)
  internalReplaceWord.call(obj1,obj,val,row)
  var rep = JSON.parse(replaceTemplateTag(JSON.stringify(row.jsonData),obj1))
  rep.escape = row.options
  return rep;
}

function replaceNextTag(obj,val,row,next){
  var obj1 = margeFanc(obj,val,row,next)
  internalReplaceWord.call(obj1,obj,val,row)
  var rep = JSON.parse(replaceTemplateTag(JSON.stringify(next),obj1))
  return rep;
}

function internalReplaceWord(obj,val,row){
  this.nameSpace = obj.sheetName + "-" + row.rowIndex + "-" + row.index
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

function margeFanc(obj,val,row,obj1){
  var obj2 = {}
  obj1 = marge(obj1,row.options)
  obj1 = marge(obj1,obj1.escape)
//  obj1 = obj1 || {}
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
      obj2[key] = val.prev//searchParent(obj,val,row,obj1[key].parent)
    }else if(obj1[key].child !== undefined){
      obj2[key] = searchChild(obj,val,row,obj1[key])
    }else{
      obj2[key] = obj1[key]
    }
  }
  return obj2
}

function searchParent(obj,val,row,obj1){ //<<<
  if(obj1.parent !== undefined && val.prev == "loadSheetJoint"){
    return searchParent(obj,obj[val.prev],val,obj1.parent)
  }else{
//    var a = obj["page3"].prev
//    return a//JSON.stringify(a.jointName)
  }
}
function searchChild(obj,val,row,obj1){ //<<<
}
 
  function getJointTable(data,paramE){
    var keyColumn = data.field.indexOf(data.linkField.jointName)
    var list = {}
    var ary = loadSpreadSheet(data.spredSheetID,data.sheetName,data.offset)
    var obj ={"spredSheetID" : data.spredSheetID,
              "sheetName"    : data.sheetName,
              "offset"       : data.offset,
              "settings"     : data,
              "thisLibrary"  : data.thisLibrary,
              "paramE"       : paramE,
              "prev"         : [],
              "list"         : [],
              "callbacks"    : {}
             };
        for (var i = 0; i < data.field.length; i++){
            for(var key in data.linkField){
                if(data.field[i] == data.linkField[key]){
                    data.field[i] = key;
                }
            }
        }
        for (var i = 0; i < ary.length; i++){
            for (var j = 0; j < ary[i].length; j++){
                if(data.jsonField.indexOf(data.field[j]) >= 0 ){
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
                if(ary[i][keyColumn].lastIndexOf("-") == ary[i][keyColumn].length -2){
                  var listName = ary[i][keyColumn].split("-")
                  var num =  listName.pop()
                  listName = listName.join("-")
                  list[listName] = list[listName] || []
                  list[listName][num] = ary[i][keyColumn]
                }
              }
        };
    for(var key in list){
      if(obj[key] && !obj[key].nextJoint){
        obj[key].nextJoint = list[key]
      }
    }
    return obj;
  }
  
  function loadSpreadSheet(spredSheetID,sheetName,offset,last){
    offset = offset || 1
    var sheet = SpreadsheetApp.openById(spredSheetID).getSheetByName(sheetName);//(e.parameter.SettingSheetName);
    var endRow = last || sheet.getLastRow();
    if(offset <= endRow){
    }
    return sheet.getRange(offset,1,endRow - (offset - 1),sheet.getLastColumn()).getValues();
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

  function setContainer(obj,val,row,aug,jsonData){
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