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
//   var ary = loadSpreadSheet(jsonData.spredSheetID,jsonData.sheetName,jsonData.offset)
//   var obj = getJointTable(ary,jsonData.field,jsonData.jsonField,jsonData.linkField,jsonData.field.indexOf(jsonData.linkField.jointName));
  var obj = getJointTable(jsonData);
   var next = obj[obj1[jsonData.linkField.nextJoint]];
   jsonData.pathNo = 0
   jsonData.depth = 0
   var obj_callback = {"nameSpace":makeNameSpace};
   return jointOnJoint.call(e,obj,next,e,next.augment,next.jsonData,jsonData,obj_callback);
 }
function makeNameSpace(obj,row,val,aug,jsonData,settings,obj_callback){
  settings.pathNo  ++
//  settings.nameSpace += row.jointName
}

  function jointOnJoint(obj,row,val,aug,jsonData,settings,obj_callback){
      if(row.nextJoint && obj[row.nextJoint[0]]){
          settings.depth ++
          if(row.augment.escape || row.nextJoint.length > 2 || obj[row.nextJoint + "-0"] || row.func.indexOf("Joint") ===  row.func.length - 5){
            // out recursive call
              return searchFunc.call(this,row.func,row.library,settings.thisLibrary,obj,row,val,aug,jsonData,settings,obj_callback);
          }else{
            // next recursive call
            if(obj_callback){
              for(var key in obj_callback){
                obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
              }
            }              
            val = jointOnJoint.call(this,obj,obj[row.nextJoint[0]],val,obj[row.nextJoint[0]].augment,obj[row.nextJoint[0]].jsonData,settings,obj_callback);
            return searchFunc.call(this,row.func,row.library,settings.thisLibrary,obj,row,val,aug,jsonData,settings,obj_callback);
          }
      }else{
            // end recursive call
            if(obj_callback){
              for(var key in obj_callback){
                obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
              }
            }              
          return searchFunc.call(this,row.func,row.library,settings.thisLibrary,obj,row,val,aug,jsonData,settings,obj_callback);
      }
  }

  function setThisObjJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    var thisObj = searchFunc.call(this,jsonData.func,jsonData.library,settings.thisLibrary,obj,row,val,aug,jsonData,settings,obj_callback);
          if(row.nextJoint && obj[row.nextJoint[0]]){
            if(obj_callback){
              for(var key in obj_callback){
                obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
              }
            }              
            jointOnJoint.call(thisObj,obj,obj[row.nextJoint[0]],val,obj[row.nextJoint[0]].augment,obj[row.nextJoint[0]].jsonData,settings,obj_callback);
          }
    thisObj.header += "testJoint".indexOf("Joint") ===  "testJoint".length - 5
    return thisObj;
  }
  
  function ougKeyJoint(obj,row,val,aug,jsonData,settings,obj_callback){
      for (var i = 0; i < row[settings.linkField.nextJoint].length; i++){
            if(obj_callback){
              for(var key in obj_callback){
                obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
              }
            }              
          var val2 = val2 || {};
          val2[obj[row.nextJoint[i]].augment.key] = jointOnJoint.call(this,obj,obj[row.nextJoint[i]],val,obj[row.nextJoint[i]].augment,obj[row.nextJoint[i]].jsonData,settings,obj_callback);
      }
    return val2;
  }

  function loadSheetJoint(obj,row,val,aug,jsonData,settings,obj_callback){
 //   var ary = loadSpreadSheet(jsonData.spredSheetID,jsonData.sheetName,jsonData.offset)
 //   var obj2 = getJointTable(ary,jsonData.field,jsonData.jsonField,jsonData.linkField,jsonData.field.indexOf(jsonData.linkField.jointName));
      var obj2 = getJointTable(jsonData)
            if(obj_callback){
              for(var key in obj_callback){
                obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
              }
            }              
    return jointOnJoint.call(this,obj2,obj2[row.nextJoint[0]],val,obj2[row.nextJoint[0]].augment,obj2[row.nextJoint[0]].jsonData,settings,obj_callback);
  }

  function combineJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    var val2 = jsonData
    var val3 = {}
    for (var i = 0; i < row[settings.linkField.nextJoint].length; i++){
      if(obj_callback){
        for(var key in obj_callback){
          obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
        }
      }              
      val3 = jointOnJoint.call(this,obj,obj[row.nextJoint[i]],val,obj[row.nextJoint[i]].augment,obj[row.nextJoint[i]].jsonData,settings,obj_callback)
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
  function joinTemplateJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    var val2 = {}
    var re = jsonData.replaceData || {}
    for (var i = 0; i < row.nextJoint.length; i++){
    var val3 = {}
      if(obj_callback){
        for(var key in obj_callback){
          obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
        }
      }
      val3 = jointOnJoint.call(this,obj,obj[row.nextJoint[i]],val,obj[row.nextJoint[i]].augment,obj[row.nextJoint[i]].jsonData,settings,obj_callback);
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
      re.nameSpace = settings.depth + "-" + obj.sheetName + "-" + row.index
      obj1[aug.key] = replaceTemplateTag(jsonData.textContent,marge(re,val2));
      return marge(obj1,jsonData);
    }else{
      return val2;
    }
 }
  function joinTemplateListJoint(obj,row,val,aug,jsonData,settings,obj_callback){//<<<<<
    var val2 = {}
    var re = jsonData.replaceData || {}
    var i = 0;
    while(obj[row.jointName + "-" + i] !== undefined){
    var val3 = {}
      if(obj_callback){
        for(var key in obj_callback){
          obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
        }
      }
      val3 = jointOnJoint.call(this,obj,obj[row.jointName + "-" + i],val,obj[row.jointName + "-" + i].augment,obj[row.jointName + "-" + i].jsonData,settings,obj_callback);
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

  function templateJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    var val2 = ""
    var re = jsonData.replaceData
    for (var i = 0; i < row.nextJoint.length; i++){
    var val3 = {}
      if(obj_callback){
        for(var key in obj_callback){
          obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
        }
      }
      val3 = jointOnJoint.call(this,obj,obj[row.nextJoint[i]],val,obj[row.nextJoint[i]].augment,obj[row.nextJoint[i]].jsonData,settings,obj_callback);
      if(isObject(val3)){
        re.nameSpace = settings.depth + "-" + settings.pathNo + "-" + row.index
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


  function addPropertyJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    var val2 = {}
    var val3 = {}
    for (var i = 0; i < row[settings.linkField.nextJoint].length; i++){
      if(obj_callback){
        for(var key in obj_callback){
          obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
        }
      }
      val3 = jointOnJoint.call(this,obj,obj[row.nextJoint[i]],val,obj[row.nextJoint[i]].augment,obj[row.nextJoint[i]].jsonData,settings,obj_callback)
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


  function combineListJoint(obj,row,val,aug,jsonData,settings,obj_callback){//<<<<<
    var val2 = jsonData
    var val3 = {}
    var i = 0;
    while(obj[row.jointName + "-" + i] !== undefined){
      if(obj_callback){
        for(var key in obj_callback){
          obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
        }
      }
      val3 = jointOnJoint.call(this,obj,obj[row.jointName + "-" + i],val,obj[row.jointName + "-" + i].augment,obj[row.jointName + "-" + i].jsonData,settings,obj_callback);
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
  function templateListJoint(obj,row,val,aug,jsonData,settings,obj_callback){//<<<<<
    var val2 = ""
    var re = jsonData.replaceData || {}
    var i = 0;
    while(obj[row.jointName + "-" + i] !== undefined){
    var val3 = {}
      if(obj_callback){
        for(var key in obj_callback){
          obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
        }
      }
      val3 = jointOnJoint.call(this,obj,obj[row.jointName + "-" + i],val,obj[row.jointName + "-" + i].augment,obj[row.jointName + "-" + i].jsonData,settings,obj_callback);
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

  function combineTwig(obj,row,val,aug,jsonData,settings,obj_callback){
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


  function margeJoint(obj,row,val,aug,jsonData,settings,obj_callback){
      for (var i = 0; i < row[settings.linkField.nextJoint].length; i++){
        var val2 = val2 || {};
      if(obj_callback){
        for(var key in obj_callback){
          obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
        }
      }
        val2 = marge(val2,jointOnJoint.call(this,obj,obj[row.nextJoint[i]],val,obj[row.nextJoint[i]].augment,obj[row.nextJoint[i]].jsonData,settings,obj_callback));
      }
      if(isObject(val)){
        val2 = marge(val2,val)
      }
    return val2;
  }
  
  function arrayReturnJoint(obj,row,val,aug,jsonData,settings,obj_callback){
      for (var i = 0; i < row[settings.linkField.nextJoint].length; i++){
          var val2 = val2 || [];
      if(obj_callback){
        for(var key in obj_callback){
          obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
        }
      }
          val2.push(jointOnJoint.call(this,obj,obj[row.nextJoint[i]],val,obj[row.nextJoint[i]].augment,obj[row.nextJoint[i]].jsonData,settings,obj_callback));
      }
    return val2;
  }
  
  function setLayoutJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    var thisObj = searchFunc.call(this,jsonData.func,jsonData.library,settings.thisLibrary,obj,row,val,aug,jsonData,settings,obj_callback);
    var val2 ={}
    if(row.nextJoint && obj[row.nextJoint[0]]){
      if(obj_callback){
        for(var key in obj_callback){
          obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
        }
      }
      val2 = jointOnJoint.call(thisObj,obj,obj[row.nextJoint[0]],val,obj[row.nextJoint[0]].augment,obj[row.nextJoint[0]].jsonData,settings,obj_callback);
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
  
  function addPropertyTwig(obj,row,val,aug,jsonData,settings,obj_callback){
        if(this[aug.target]){
            this[aug.target] += val;
        }else{
            this[aug.target] = val;
        }
  }

  function setPropertyTwig(obj,row,val,aug,jsonData,settings,obj_callback){//<<<<addPropety please
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
  
  function addPageDivTwig(obj,row,val,aug,jsonData,settings,obj_callback){
    this.pageDiv[aug.pageNo] = this.pageDiv[aug.pageNo] || {}
        if(this.pageDiv[aug.pageNo][aug.target]){
            this.pageDiv[aug.pageNo][aug.target] += val;
        }else{
            this.pageDiv[aug.pageNo][aug.target] = val;
    }
  }

 function addObjectTwig(obj,row,val,aug,jsonData,settings,obj_callback){
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
  
  function jsonDataTwig(obj,row,val,aug,jsonData,settings,obj_callback){
    return jsonData;
  }
  
  function addJsonDataJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    for(var key in jsonData){
      if(this[key] !== undefined){
        this[key] += jsonData[key]
      }else{
        this[key] = jsonData[key]
      }
    }
  }

  function margeListJoint(obj,row,val,aug,jsonData,settings,obj_callback){//<<<<<
    var i = 0;
        while(obj[row[settings.linkField.jointName] + "-" + i] !== undefined){
        var obj1 = obj1 || {};
      if(obj_callback){
        for(var key in obj_callback){
          obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
        }
      }
        obj1 = marge(obj1,jointOnJoint.call(this,obj,obj[row.jointName + "-" + i],val,obj[row.jointName + "-" + i].augment,obj[row.jointName + "-" + i].jsonData,settings,obj_callback));
        i++;
        }
    return obj1;
 }

  function listJoint(obj,row,val,aug,jsonData,settings,obj_callback){//<<<
    var i = 0;
        while(obj[row[settings.linkField.jointName] + "-" + i] !== undefined){
        var ary = ary || [];
      if(obj_callback){
        for(var key in obj_callback){
          obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
        }
      }
        ary[i] = jointOnJoint.call(this,obj,obj[row[settings.linkField.jointName] + "-" + i],val,obj[row[settings.linkField.jointName] + "-" + i][settings.linkField.augment],obj[row[settings.linkField.jointName] + "-" + i][settings.linkField.jsonData],settings,obj_callback);
        i++;
        }
    return ary;
 }
 
  function joinListJoint(obj,row,val,aug,jsonData,settings,obj_callback){//<<<<<
    var i = 0;
        while(obj[row.jointName + "-" + i] !== undefined){
        var val1 = val1 || "";
      if(obj_callback){
        for(var key in obj_callback){
          obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
        }
      }
        val1 += jointOnJoint.call(this,obj,obj[row.jointName + "-" + i],val,obj[row.jointName + "-" + i].augment,obj[row.jointName + "-" + i].jsonData,settings,obj_callback);
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

  function jsonStringifyTwig(obj,row,val,aug,jsonData,settings,obj_callback){
    return JSON.stringify(val);
  }

  function libraryFileTwig(obj,row,val,aug,jsonData,settings,obj_callback){
    if(aug.key){
      var obj1 ={};
      obj1[aug.key] = replaceTag(HtmlService.createHtmlOutputFromFile(aug.fileName).getContent());
      return obj1;
    }else{
      return replaceTag(HtmlService.createHtmlOutputFromFile(aug.fileName).getContent());
    }
  }

  function liblaryTemplateFromFileTwig(obj,row,val,aug,jsonData,settings,obj_callback){
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
  
  function replaceTemplateFromJsonTwig(obj,row,val,aug,jsonData,settings,obj_callback){
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

  function combineNextTwig(obj,row,val,aug,jsonData,settings,obj_callback){
    this[aug.target] = combineArrayObject(this[aug.target],val);
  }
  
  function combineJsonTwig(obj,row,val,aug,jsonData,settings,obj_callback){
    this[aug.target] = combineArrayObject(this[aug.target],jsonData);
  }
    
  function singleTwig(obj,row,val,aug,jsonData,settings,obj_callback){
    return val;
  }

  function joinInTwig(obj,row,val,aug,jsonData,settings,obj_callback){
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
              "offset"       : data.offset
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
  
  function loadSpreadSheet(spredSheetID,sheetName,offset){
    offset = offset || 1
    var sheet = SpreadsheetApp.openById(spredSheetID).getSheetByName(sheetName);//(e.parameter.SettingSheetName);
    return sheet.getRange(offset,1,sheet.getLastRow() - (offset - 1),sheet.getLastColumn()).getValues();
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

  function setContainer(obj,row,val,aug,jsonData,settings,obj_callback){
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