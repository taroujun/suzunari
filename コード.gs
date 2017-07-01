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
   var jsonData = obj1.jsonData;  // <<<<<<<< 固定？
  var obj = getJointTable(jsonData);
   var next = obj[obj1[jsonData.linkField.nextJoint]];
//   jsonData.pathNo = 0
//   jsonData.depth = 0
//   var obj.callbacks = {"nameSpace":makeNameSpace};
   return jointOnJoint.call(e,obj,next,e,next.augment,next.jsonData);
 }
function makeNameSpace(obj,row,val,aug,jsonData){
  settings.pathNo  ++
//  settings.nameSpace += row.jointName
}
  function jointOnJoint(obj,row,val,aug,jsonData){
      if(row.nextJoint && obj[row.nextJoint[0]]){
       //   settings.depth ++
          if(row.augment.escape || row.nextJoint.length > 2 || obj[row.nextJoint + "-0"] || row.func.indexOf("Joint") ===  row.func.length - 5){
            // out recursive call
              return searchFunc.apply(this,funcAry(obj,row,val));
          }else{
            // next recursive call
            if(obj.callbacks){
              for(var key in obj.callbacks){
                obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
              }
            }              
            val = jointOnJoint.apply(this,jointAry(obj,row,val));
            return searchFunc.apply(this,funcAry(obj,row,val));
          }
      }else{
            // end recursive call
            if(obj.callbacks){
              for(var key in obj.callbacks){
                obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
              }
            }              
          return searchFunc.apply(this,funcAry(obj,row,val));
      }
  }

  function setThisObjJoint(obj,row,val,aug,jsonData){
    var thisObj = searchFunc.call(this,jsonData.func,jsonData.library,obj.thisLibrary,obj,row,val,aug,jsonData);
          if(row.nextJoint && obj[row.nextJoint[0]]){
            if(obj.callbacks){
              for(var key in obj.callbacks){
                obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
              }
            }              
            jointOnJoint.apply(this,jointAry(obj,row,val));
          }
    thisObj.header += "testJoint".indexOf("Joint") ===  "testJoint".length - 5
    return thisObj;
  }
  
  function ougKeyJoint(obj,row,val,aug,jsonData){
      for (var i = 0; i < row[settings.linkField.nextJoint].length; i++){
            if(obj.callbacks){
              for(var key in obj.callbacks){
                obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
              }
            }              
          var val2 = val2 || {};
          val2[obj[row.nextJoint[i]].augment.key] = jointOnJoint.apply(this,jointAry(obj,row,val,i));
      }
    return val2;
  }

  function loadSheetJoint(obj,row,val,aug,jsonData){
      var obj2 = getJointTable(jsonData)
            if(obj.callbacks){
              for(var key in obj.callbacks){
                obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
              }
            }              
    return jointOnJoint.apply(this,jointAry(obj2,row,val));
  }

  function combineJoint(obj,row,val,aug,jsonData){
    var val2 = jsonData
    var val3 = {}
    for (var i = 0; i < row.nextJoint.length; i++){
      if(obj.callbacks){
        for(var key in obj.callbacks){
          obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
        }
      }              
      val3 = jointOnJoint.apply(this,jointAry(obj,row,val,i))
      if(isObject(val3)){
        for(var key in val3){
          if(val2[key] !== undefined){
            val2[key] += val3[key]
          }else{
            val2[key] = val3[key]
          }
        }
      }
    }
    if(aug.key){
      var obj1 ={};
      obj1[aug.key] = val2;
      return marge(obj1,jsonData);
    }else{
      return val2;
    }
  }
function criateNameSpace(ary,name){
  var nameSpace = ""
  for (var i = 0; i < ary.length; i++){
    nameSpace += ary[i]
  }
  return nameSpace + "-" +name
}
  function joinTemplateJoint(obj,row,val,aug,jsonData){
    var val2 = {}
    var re = jsonData.replaceData || {}
    for (var i = 0; i < row.nextJoint.length; i++){
    var val3 = {}
      if(obj.callbacks){
        for(var key in obj.callbacks){
          obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
        }
      }
      val3 = jointOnJoint.apply(this,jointAry(obj,row,val,i));
      if(isObject(val3)){
        for(var key in val3){
          if(val2[key] !== undefined){
            val2[key] += val3[key]
          }else{
            val2[key] = val3[key]
          }
        }
      }
    }
    if(aug.key){
      var obj1 ={};
      re.nameSpace = obj.sheetName + "-" + row.index
      obj1[aug.key] = replaceTemplateTag(jsonData.textContent,marge(re,val2));
      return marge(obj1,jsonData);
    }else{
      return val2;
    }
 }
function funcAry(obj,row,val){
  var ary = []
  ary.push(row.func)
  ary.push(row.library)
  ary.push(obj.thisLibrary)
  ary.push(obj);
  ary.push(row)
  ary.push(val)
  ary.push(row.augment)
  ary.push(row.jsonData)
  return ary
}
function jointAry(obj,row,val,i){
  i = i || 0
  var ary = []
  ary.push(obj);
  ary.push(obj[row.nextJoint[i]]);
  ary.push(val)
  ary.push(obj[row.nextJoint[i]].augment)
  ary.push(obj[row.nextJoint[i]].jsonData)
  return ary
}
function listAugAry(obj,row,val,i){
  i = i || 0
  var ary = []
  ary.push(obj);
  ary.push(obj[row.jointName + "-" + i]);
  ary.push(val)
  ary.push(obj[row.jointName + "-" + i].augment)
  ary.push(obj[row.jointName + "-" + i].jsonData)
  return ary
}

  function joinTemplateListJoint(obj,row,val,aug,jsonData){//<<<<<
    var val2 = {}
    var re = jsonData.replaceData || {}
    var i = 0;
    while(obj[row.jointName + "-" + i] !== undefined){
    var val3 = {}
      if(obj.callbacks){
        for(var key in obj.callbacks){
          obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
        }
      }
      val3 = jointOnJoint.apply(this,listAugAry(obj,row,val,i));
      i++;
      if(isObject(val3)){
        for(var key in val3){
          if(val2[key] !== undefined){
            val2[key] += val3[key]
          }else{
            val2[key] = val3[key]
          }
        }
      }
    }
    if(aug.key){
      var obj1 ={};
      obj1[aug.key] = replaceTemplateTag(jsonData.textContent,marge(re,val2));
      return marge(obj1,jsonData);
    }else{
      return val2;
    }
 }

  function templateJoint(obj,row,val,aug,jsonData){
    var val2 = ""
    var re = jsonData.replaceData
    for (var i = 0; i < row.nextJoint.length; i++){
    var val3 = {}
      if(obj.callbacks){
        for(var key in obj.callbacks){
          obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
        }
      }
      val3 = jointOnJoint.apply(this,jointAry(obj,row,val,i));
      if(isObject(val3)){
        re.nameSpace = obj.sheetName + "-" + row.index
        val2 += replaceTemplateTag(jsonData.textContent,marge(re,val3));
      }
    }
    if(aug.key){
      var obj1 ={};
      obj1[aug.key] = val2;
      return marge(obj1,jsonData);
    }else{
      return val2;
    }
 }


  function addPropertyJoint(obj,row,val,aug,jsonData){
    var val2 = {}
    var val3 = {}
    for (var i = 0; i < row[settings.linkField.nextJoint].length; i++){
      if(obj.callbacks){
        for(var key in obj.callbacks){
          obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
        }
      }
      val3 = jointOnJoint.apply(this,jointAry(obj,row,val,i));
      if(isObject(val3)){
        for(var key in val3){
          if(this[key] !== undefined){
            this[key] += val3[key]
          }else{
            this[key] = val3[key]
          }
        }
      }
    }
  }


  function combineListJoint(obj,row,val,aug,jsonData){//<<<<<
    var val2 = jsonData
    var val3 = {}
    var i = 0;
    while(obj[row.jointName + "-" + i] !== undefined){
      if(obj.callbacks){
        for(var key in obj.callbacks){
          obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
        }
      }
      val3 = jointOnJoint.apply(this,listAugAry(obj,row,val,i));
      i++;
      if(isObject(val3)){
        for(var key in val3){
          if(val2[key] !== undefined){
            val2[key] += val3[key]
          }else{
            val2[key] = val3[key]
          }
        }
      }
    }
    if(aug.key){
      var obj1 ={};
      obj1[aug.key] = val1;
      return obj1;
    }else{
      return val1;
    }
 }
  function templateListJoint(obj,row,val,aug,jsonData){//<<<<<
    var val2 = ""
    var re = jsonData.replaceData || {}
    var i = 0;
    while(obj[row.jointName + "-" + i] !== undefined){
    var val3 = {}
      if(obj.callbacks){
        for(var key in obj.callbacks){
          obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
        }
      }
      val3 = jointOnJoint.apply(this,listAugAry(obj,row,val,i));
      i++;
      if(isObject(val3)){
        val2 += replaceTemplateTag(jsonData.textContent,marge(re,val3));
      }
    }
    if(aug.key){
      var obj1 ={};
      obj1[aug.key] = val2;
      return marge(obj1,jsonData);
    }else{
      return val2;
    }
 }

  function combineTwig(obj,row,val,aug,jsonData){
    var val2 = jsonData
      if(isObject(val)){
        for(var key in val){
          if(val2[key] !== undefined){
            val2[key] += val[key]
          }else{
            val2[key] = val[key]
          }
        }
      }
    return val2
  }


  function margeJoint(obj,row,val,aug,jsonData){
      for (var i = 0; i < row.nextJoint.length; i++){
        var val2 = val2 || {};
      if(obj.callbacks){
        for(var key in obj.callbacks){
          obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
        }
      }
        val2 = marge(val2,jointOnJoint.apply(this,jointAry(obj,row,val,i)));
      }
      if(isObject(val)){
        val2 = marge(val2,val)
      }
    return val2;
  }
  
  function arrayReturnJoint(obj,row,val,aug,jsonData){
      for (var i = 0; i < row[settings.linkField.nextJoint].length; i++){
          var val2 = val2 || [];
      if(obj.callbacks){
        for(var key in obj.callbacks){
          obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
        }
      }
          val2.push(jointOnJoint.apply(this,jointAry(obj,row,val,i)));
      }
    return val2;
  }
  
  function setLayoutJoint(obj,row,val,aug,jsonData){
    var thisObj = searchFunc.call(this,jsonData.func,jsonData.library,obj.thisLibrary,obj,row,val,aug,jsonData);
    var val2 ={}
    if(row.nextJoint && obj[row.nextJoint[0]]){
      if(obj.callbacks){
        for(var key in obj.callbacks){
          obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
        }
      }
      val2 = jointOnJoint.apply(this,jointAry(obj,row,val));
    }
    if(isObject(val2)){
       for(var key in val2){
          if(thisObj[key] !== undefined && thisObj[key]){
             thisObj[key] += val2[key];
          }else if(thisObj[key] !== undefined && !thisObj[key]){
             thisObj[key] = val2[key];
          }
       }
    }
    if(jsonData.title !== undefined){thisObj.title = jsonData.title}
    if(jsonData.faviconUrl !== undefined){thisObj.faviconUrl = jsonData.faviconUrl}   
    return thisObj;
  }
  
  function addPropertyTwig(obj,row,val,aug,jsonData){
        if(this[aug.target]){
            this[aug.target] += val;
        }else{
            this[aug.target] = val;
        }
  }

  function setPropertyTwig(obj,row,val,aug,jsonData){//<<<<addPropety please
    if(val && !(isObject(val)) && jsonData[aug.target] === undefined){
      this[aug.key] = val
    }else if(val && isObject(val) && jsonData[aug.target] === undefined && val[aug.key] === undefined){
      this[aug.key] = val
    }else if(val && !(isObject(val)) && jsonData[aug.target] !== undefined){
      this[aug.key] = jsonData[aug.key]
    }else if(val && isObject(val) && jsonData[aug.target] === undefined && val[aug.key] !== undefined){
      this[aug.key] = val[aug.key]
    }else if(val && isObject(val) && jsonData[aug.target] !== undefined && val[aug.key] !== undefined){
      val[aug.key] += jsonData[aug.target]
      this[aug.target] = val[aug.key]
    }else if(!val && jsonData[aug.target] !== undefined){
      this[aug.target] = val[aug.key]
    }else if(!val && jsonData[aug.target] === undefined){
      this[aug.target] = jsonData
    }else if(!val && !jsonData){
      this[aug.target] = ""
    }
  }
  
  function addPageDivTwig(obj,row,val,aug,jsonData){
    this.pageDiv[aug.pageNo] = this.pageDiv[aug.pageNo] || {}
        if(this.pageDiv[aug.pageNo][aug.target]){
            this.pageDiv[aug.pageNo][aug.target] += val;
        }else{
            this.pageDiv[aug.pageNo][aug.target] = val;
    }
  }

 function addObjectTwig(obj,row,val,aug,jsonData){
   if(isObject(val)){
       for(var key in val){
          if(this[key] !== undefined && this[key]){
             this[key] += val[key];
          }else if(this[key] !== undefined && !this[key]){
             this[key] = val[key];
          }
       }
    }
 }
  
  function jsonDataTwig(obj,row,val,aug,jsonData){
    return jsonData;
  }
  
  function addJsonDataJoint(obj,row,val,aug,jsonData){
    for(var key in jsonData){
      if(this[key] !== undefined){
        this[key] += jsonData[key]
      }else{
        this[key] = jsonData[key]
      }
    }
  }

  function margeListJoint(obj,row,val,aug,jsonData){//<<<<<
    var i = 0;
        while(obj[row[settings.linkField.jointName] + "-" + i] !== undefined){
        var obj1 = obj1 || {};
      if(obj.callbacks){
        for(var key in obj.callbacks){
          obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
        }
      }
        obj1 = marge(obj1,jointOnJoint.call(this,obj,obj[row.jointName + "-" + i],val,obj[row.jointName + "-" + i].augment,obj[row.jointName + "-" + i].jsonData));
        i++;
        }
    return obj1;
 }

  function listJoint(obj,row,val,aug,jsonData){//<<<
    var i = 0;
        while(obj[row[settings.linkField.jointName] + "-" + i] !== undefined){
        var ary = ary || [];
      if(obj.callbacks){
        for(var key in obj.callbacks){
          obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
        }
      }
        ary[i] = jointOnJoint.call(this,obj,obj[row[settings.linkField.jointName] + "-" + i],val,obj[row[settings.linkField.jointName] + "-" + i][settings.linkField.augment],obj[row[settings.linkField.jointName] + "-" + i][settings.linkField.jsonData]);
        i++;
        }
    return ary;
 }
 
  function joinListJoint(obj,row,val,aug,jsonData){//<<<<<
    var i = 0;
        while(obj[row.jointName + "-" + i] !== undefined){
        var val1 = val1 || "";
      if(obj.callbacks){
        for(var key in obj.callbacks){
          obj.callbacks[key].call(this,obj,row,val,aug,jsonData);
        }
      }
        val1 += jointOnJoint.call(this,obj,obj[row.jointName + "-" + i],val,obj[row.jointName + "-" + i].augment,obj[row.jointName + "-" + i].jsonData);
        i++;
        }
        if(aug.key){
            var obj1 ={};
            obj1[aug.key] = val1;
            return obj1;
        }else{
            return val1;
        }
 }

  function jsonStringifyTwig(obj,row,val,aug,jsonData){
    return JSON.stringify(val);
  }

  function libraryFileTwig(obj,row,val,aug,jsonData){
    if(aug.key){
      var obj1 ={};
      obj1[aug.key] = replaceTag(HtmlService.createHtmlOutputFromFile(aug.fileName).getContent());
      return obj1;
    }else{
      return replaceTag(HtmlService.createHtmlOutputFromFile(aug.fileName).getContent());
    }
  }

  function liblaryTemplateFromFileTwig(obj,row,val,aug,jsonData){
    var re = jsonData.replaceData || {}
    if(isObject(val)){
      re = marge(re,val)
    }
    var html = HtmlService.createTemplateFromFile(aug.fileName);
    for(var key in re){
      html[key] = re[key]
    }  
    if(aug.key){
      var obj1 ={};
      obj1[aug.key] = html.evaluate().getContent();
      return obj1;
    }else{
      return html.evaluate().getContent();;
    }
  }
  
  function replaceTemplateFromJsonTwig(obj,row,val,aug,jsonData){
    var re = jsonData.replaceData || {}
        if(isObject(val)){
            re = marge(re,val)
        }
        for(var key in jsonData){
            if(this[key] !== undefined && this[key]){
                this[key] += replaceTemplateTag(jsonData[key],re);
            }else if(this[key] !== undefined && !this[key]){
                this[key] = replaceTemplateTag(jsonData[key],re);
            }
        }
        if(aug.key){
            var obj1 = {}
            obj1[aug.key] = replaceTemplateTag(jsonData.textContent,re);
            return obj1
        }else{
            return replaceTemplateTag(jsonData.textContent,re);
        }
  }

  function combineNextTwig(obj,row,val,aug,jsonData){
    this[aug.target] = combineArrayObject(this[aug.target],val);
  }
  
  function combineJsonTwig(obj,row,val,aug,jsonData){
    this[aug.target] = combineArrayObject(this[aug.target],jsonData);
  }
    
  function singleTwig(obj,row,val,aug,jsonData){
    return val;
  }

  function joinInTwig(obj,row,val,aug,jsonData){
    return Array.prototype.join.apply(val,aug.augAry);
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

  function combine(Obj1,Obj2,opt_ward){
    var ward = opt_ward || ""
    for(var key in Obj2){
      if(Obj1[key] !== undefined && Obj1[key]){
        Obj1[key] += ward + Obj2[key];
      }else{
        Obj1[key] = Obj2[key];
      }
    }
    return Obj1;
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

  function getJointTable(data){
    var keyColumn = data.field.indexOf(data.linkField.jointName)
    var ary = loadSpreadSheet(data.spredSheetID,data.sheetName,data.offset)
    var obj ={"spredSheetID" : data.spredSheetID,
              "sheetName"    : data.sheetName,
              "offset"       : data.offset,
              "settings"     : data,
              "thisLibrary"  : data.thisLibrary,
              "callbacks"    : {},
              "current"      : "",
              "next"         : "",
              "nextArr"      : "",
              "array"        : ""
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
              if(obj[ary[i][keyColumn]]){
                obj[ary[i][keyColumn]]["index"] = i + Number(data.offset)
              }
            };
        };
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

  function setContainer(obj,row,val,aug,jsonData){
    return new SuzunariContainer(val)
  }

  function SuzunariContainer(parameter){

  // contens 
  
    this.parameter = parameter;  
    this.title = "suzunari";
    this.faviconUrl = "https://dl.dropboxusercontent.com/s/5ksh84yv74revaa/Suzunari.ico";
    this.settings = {};
    this.data = {};
  
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