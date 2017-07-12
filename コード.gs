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
  var obj = getJointTable(jsonData);
   var next = obj[obj1[jsonData.linkField.nextJoint]];
   var paramAry = [this,obj,obj1,next,next.options,next.jsonData]
   return searchFunc.call(e,next.func,"",obj1.thisLibrary,obj,e,next,next.options,next.jsonData);
 }

function setLayoutJoint(obj,val,row,aug,jsonData){
    var thisObj = searchFunc.call(this,jsonData.func,jsonData.library,obj.thisLibrary,obj,row,val,aug,jsonData);
    var val2 ={}
    row.rowName = "next"
    row.prev = "root"
    val2 = recursiveSearch.call(thisObj,arguments)
    combine(thisObj,val2);
    if(jsonData.title !== undefined){thisObj.title = jsonData.title}
    if(jsonData.faviconUrl !== undefined){thisObj.faviconUrl = jsonData.faviconUrl}   
    return thisObj;
  }

  function loadSheetJoint(obj,val,row,aug,jsonData){
    arguments[0] = getJointTable(jsonData)
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){     
        return recursiveSearch.call(this,arguments,i)
      }
    }else{
      return replaceContensTag(obj,row,{}) //<<<?
    }
  }

  function separateJoint(obj,val,row,aug,jsonData){
    var val2 = {}
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){     
        val2 = combine(val2,replaceContensTag.call(this,obj,row,recursiveSearch.call(this,arguments,i)))
      }
      return val2;
    }else{
      return replaceContensTag(obj,row,{})
    }
  }

  function multipleJoint(obj,val,row,aug,jsonData){
    var val2 = {}
//    this.header += JSON.stringify(row) + "---mul<br><br>"
    if(row.nextJoint){
      for (var i = 0; i < row.nextJoint.length; i++){
        val2 = combine(val2,recursiveSearch.call(this,arguments,i));
      }
      return combine(replaceContensTag.call(this,obj,row,val2),val2)
    }else{
      return replaceContensTag(obj,row,{})
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
      return JSON.stringify(replaceContensTag(obj,row,{})) //>>>どこに？
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

  function requestLibrary(req) { //<<< cng!
    var  lib = libraryFanc("suzunariCatchRequest",castLibName(req.libName),4);
    return lib(req);
  }

  function combine(obj1,obj2,opt_ward){
    var ward = opt_ward || ""
    if(isObject(obj1) && isObject(obj2)){
      for(var key in obj2){
        if(typeof (obj2[key]) == "string" || obj2[key] instanceof String){
          if(obj1[key] !== undefined && obj1[key]){
            obj1[key] += ward + obj2[key];
          }else{
            obj1[key] = obj2[key];
          }
        }else if(isObject(obj2[key])){
          obj1[key] = marge(obj1[key],obj2[key])
  //        if(obj1[key] !== undefined && obj1[key]){
  //         obj1[key] = combine(obj1[key],obj2[key],opt_ward);
  //        }else{
  //          obj1[key] = marge(obj1[key],obj2[key])
  //        }
        }else if(Object.prototype.toString.call(obj2[key]) === '[object Array]'){
          if(obj1[key] !== undefined && obj1[key] && Object.prototype.toString.call(obj1[key]) === '[object Array]'){
            obj1[key].concat(obj2[key]);
          }else{
            obj1[key] = obj2[key];
          }        
        }
      }
    return obj1;
    }
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
           next.prev = row.jointName
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
     return replaceContensTag(obj,obj[row.nextJoint[i]],{})
     }
   }
 }

function replaceContensTag(obj,row,ret){
  var obj1 = margeFanc(obj,row,ret)
  obj1.nameSpace = obj.sheetName + "-" + row.index
  obj1.spredSheetID = obj.spredSheetID
  obj1.sheetName = obj.sheetName
  obj1.offset = obj.offset
  obj1.jointName = row.jointName
  obj1.nextJoint = row.nextJoint
  obj1.index = row.index
  obj1.prev = row.prev
  var rep = replaceTemplateTag(JSON.stringify(row.jsonData),obj1)
  return JSON.parse(rep);
}

function margeFanc(obj,row,obj1){
  obj1 = obj1 || {}
  for(var key in row.options){
    if(row.options[key].func !== undefined){
      var ary = []
      var row2 = row
      var library = row.options[key].library || ""
      var augAry = row.options[key].augAry || []
      if(row.options[key].nextJoint){
        row2 = obj[row.options[key].nextJoint]        
      }
      ary.push(row.options[key].func);
      ary.push(library);
      ary.push(obj.thisLibrary)
      if(row.options[key].func.indexOf("Joint") ===  row.options[key].func.length - 5){
      ary.push(obj)
      ary.push(row2)
        }
      ary.concat(augAry)
      obj1[key] = searchFunc.apply(this,ary);
    }else{
      obj1[key] = row.options[key]
    }
  }
  return obj1
}
 
  function getJointTable(data){
    var keyColumn = data.field.indexOf(data.linkField.jointName)
    var list = {}
    var ary = loadSpreadSheet(data.spredSheetID,data.sheetName,data.offset)
    var obj ={"spredSheetID" : data.spredSheetID,
              "sheetName"    : data.sheetName,
              "offset"       : data.offset,
              "settings"     : data,
              "thisLibrary"  : data.thisLibrary,
              "prev"         : [],
              "list"         : [],
              "callbacks"    : {}
             };
        for (var i = 0; i < data.field.length; i++){//<<<<<<< 
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
                obj[ary[i][keyColumn]]["index"] = i + Number(data.offset)
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

  function SuzunariContainer(parameter){

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
      html.header = this.header + "</div>";
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