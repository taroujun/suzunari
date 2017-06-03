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
   var ary = loadSpreadSheet(jsonData.spredSheetID,jsonData.sheetName,jsonData.offset)
   var obj = getJointTable(ary,jsonData.field,jsonData.jsonField,jsonData.field.indexOf(jsonData.linkField.jointName));
   var next = obj[obj1[jsonData.linkField.nextJoint]];
   var obj_callback = {};
   return searchFunc.call(e,obj1[jsonData.linkField.func],obj1[jsonData.linkField.library],jsonData.thisLibrary,obj,next,e,next[jsonData.linkField.augment],next[jsonData.linkField.jsonData],jsonData,obj_callback);
 }

  function jointOnJoint(obj,row,val,aug,jsonData,settings,obj_callback){
        if(row[settings.linkField.nextJoint] && obj[row[settings.linkField.nextJoint]] && !row[settings.linkField.augment].escape){
            val = jointOnJoint.call(this,obj,obj[row[settings.linkField.nextJoint]],val,obj[row[settings.linkField.nextJoint]][settings.linkField.augment],obj[row[settings.linkField.nextJoint]][settings.linkField.jsonData],settings,obj_callback);
        }
            if(obj_callback){
                for(var key in obj_callback){
                    obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
                }
          }              
    return searchFunc.call(this,row[settings.linkField.func],row[settings.linkField.library],settings.thisLibrary,obj,row,val,aug,jsonData,settings,obj_callback);
  }
  
  function setLayout(obj,row,val,aug,jsonData,settings,obj_callback){
    var thisObj = new suzunariLayout.SuzunariContener(val);
    var test3 = obj[row[settings.linkField.nextJoint]][settings.linkField.augment];
 //   obj_callback.test = testJoint2;
    var tes =jointOnJoint.call(thisObj,obj,row,val,aug,jsonData,settings,obj_callback);
    var testAry = {};
 //   var param = JSON.parse(e.parameter.jointData)
    testAry.pageDiv = []
    testAry.pageDiv.push({"left":JSON.stringify(test3)});//+JSON.stringify(ary)+jsondata.field.indexOf(jsondata.linkField.jointName)});
    testAry.pageDiv.push({"left":"test"});
    var test = {};
    test.pageDiv = testAry;
    thisObj.addData(testAry);
    return thisObj;
  }
  
  function addPropertyJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    this[aug.target] = val;
  }
  
  function addPageDiv(obj,row,val,aug,jsonData,settings,obj_callback){
    this.pageDiv[aug.pageNo] = this.pageDiv[aug.pageNo] || {}
        if(this.pageDiv[aug.pageNo][aug.target]){
            this.pageDiv[aug.pageNo][aug.target] += val;
        }else{
            this.pageDiv[aug.pageNo][aug.target] = val;
    }
  }
  
  function jsonDataJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    return jsonData;
  }

  function margeJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    var i = 0;
        while(obj[row[settings.linkField.jointName] + "-" + i] !== undefined){
        var obj1 = obj1 || {};
        obj1 = marge(obj1,jointOnJoint.call(this,obj,obj[row[settings.linkField.jointName] + "-" + i],val,obj[row[settings.linkField.jointName] + "-" + i][settings.linkField.augment],obj[row[settings.linkField.jointName] + "-" + i][settings.linkField.jsonData],settings,obj_callback));
        i++;
            if(obj_callback){
                for(var key in obj_callback){
                    obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
                }
            }
        }
    return obj1;
 }

  function arrayJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    var i = 0;
        while(obj[row[settings.linkField.jointName] + "-" + i] !== undefined){
        var ary = ary || [];
        ary[i] = jointOnJoint.call(this,obj,obj[row[settings.linkField.jointName] + "-" + i],val,obj[row[settings.linkField.jointName] + "-" + i][settings.linkField.augment],obj[row[settings.linkField.jointName] + "-" + i][settings.linkField.jsonData],settings,obj_callback);
        i++;
            if(obj_callback){
                for(var key in obj_callback){
                    obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
                }
            }              
        }
    return ary;
 }
 
  function jsonStringifyJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    return JSON.stringify(val);
  }

  function liblaryTemplateFromFileJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    var html = HtmlService.createTemplateFromFile(aug.fileName);
        for(var key in jsonData){
           html[key] = jsonData[key]
        }
    return html.evaluate().getContent();
  }
    
  function combineDataJoint(obj,obj1,data,ary,nextVal){//<<
    this[obj1.augment.target] = combineArrayObject(this[obj1.augment.target],data);
  }
  
  function jointOnJointOnjoint(obj,obj1,data,ary,nextVal){//<<
    return jointOnJoint.call(this,obj,obj1.argAry);
  }
  
  function singleJoint(obj,obj1,data,ary,nextVal){//<<
    return nextVal;
  }

  function joinInJoint(obj,obj1,data,ary,nextVal){//<<
    return Array.prototype.join.apply(ary,obj1.augment.argAry);
  }

  function libraryApply(func,opt_library) { // 関数が有れば関数を、なければ　undefined　を返す。
        if(opt_library) { var lib = opt_library + '.'}else{ var lib = ""};
        var t = Function.call("",'return typeof(' + lib  + func + ')');
            if(t() == 'function') {
               var f = 'return function(args) { return ' + lib  + func + '.apply(this,args);}';
        //     var f = 'return ' + lib  + func + '.apply(this,ary)';
               return Function.call("",f)();
           }else{
               return undefined;
        }
  }

  function requestLibrary(req) { //<<< cng!
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

  function getUserId(){
    return Session.getActiveUser().getUserLoginId();
  }

  function getUserEmail(){
    return Session.getActiveUser().getEmail();
  }