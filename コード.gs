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
   var obj = getJointTable(ary,jsonData.field,jsonData.jsonField,jsonData.linkField,jsonData.field.indexOf(jsonData.linkField.jointName));
   var next = obj[obj1[jsonData.linkField.nextJoint]];
   var obj_callback = {};
   return searchFunc.call(e,obj1[jsonData.linkField.func],obj1[jsonData.linkField.library],jsonData.thisLibrary,obj,next,e,next[jsonData.linkField.augment],next[jsonData.linkField.jsonData],jsonData,obj_callback);
 }

  function jointOnJoint(obj,row,val,aug,jsonData,settings,obj_callback){
      if(obj_callback){
          for(var key in obj_callback){
              obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
          }
      }              
      if(obj.hasNext()){
      obj.next();
          if(obj.isMultiple){
              val = searchFunc.apply(this,obj.multiAug());
              return searchFunc.apply(this,obj.funcAug(val));
          }else{
              val = jointOnJoint.call(this,obj.singleAug(val));
              return searchFunc.apply(this,obj.funcAug(val));
          }
      }else{
          searchFunc.apply(this,obj.funcAug(val));
      }
  }
    
  function jointTest(obj,row,val,aug,jsonData,settings,obj_callback){
    var obj2 = new Joints(obj,obj["suzunari"],settings,obj_callback);
    obj2.next();
  //  obj2.next();
 //   obj2.rewind();
    return [obj2.prev,obj2.current,obj2.next(),obj2.isMultiple(),obj2.funcAug("")[0]];
  }
  
  function Joints(obj,root,settings,obj_callback){
    this.obj = obj
    this.settings = settings
    this.obj_callback = obj_callback
    this.root = root
    this.Prev = root
    this.current = root
    this.nextJoint = this.current.nextJoint
    this.index = 0
    this.length = this.current.nextJoint.length
    this.next = function(){
        if(this.hasNext()){
        this.prev = this.current
        this.current = this.obj[this.current.nextJoint[0]]
        this.index = 0
        this.length = this.current.nextJoint.length
        return this.current
        }else{
            return "done"
        }
    }
    this.increment = function(){
        this.index ++
        return this.obj[this.current.nextJoint[index]]
    }
    this.decrement = function(){
        this.index --
        return this.obj[this.current.nextJoint[index]]
    }
    this.hasNext = function(){
        return this.obj[this.current.nextJoint[0]] && this.current.nextJoint
    }
    this.rewind = function(){
        this.current = this.root
        this.index = 0
        this.length = this.root.nextJoint.length
    }
    this.isMultiple = function(){
        return this.length > 2 || this.obj[this.current.nextJoint + "-0"] || this.current.augment.multiple       
    }
    this.multiAug = function(){
        return [obj[this.current.nextJoint[0]].func,obj[this.current.nextJoint[0]].library,this.settings.thisLibrary,this,obj[this.current.nextJoint[0]],undefined,obj[this.current.nextJoint[0]].augment,obj[this.current.nextJoint[0]].jsonData,this.settings,this.obj_callback]
    }
    this.singleAug = function(val){
        return [this,obj[this.current.nextJoint[0]],val,obj[this.current.nextJoint[0]].augment,obj[this.current.nextJoint[0]],this.current.jsonData,this.settings,this.obj_callback]
    }
    this.funcAug = function(val){
        return [this.current.func,this.current.library,this.settings.thisLibrary,this,this.current,val,this.current.augment,this.current.jsonData,this.settings,this.obj_callback]
    }
    this.each = function(callback){
        for (var i = 0; i < this.length; i++){
            callback.apply(this,"")
        }
    }
  }
  
  function ougKeyJoint(obj,row,val,aug,jsonData,settings,obj_callback){
      for (var i = 0; i < row[settings.linkField.nextJoint].length; i++){
          var val2 = val2 || {};
          val2[obj[row.nextJoint[i]].augment.key] = jointOnJoint.call(this,obj,obj[row.nextJoint[i]],val,obj[row.nextJoint[i]].augment,obj[row.nextJoint[i]].jsonData,settings,obj_callback);
      }
    return val2;
  }
  
  function margeJoint(obj,row,val,aug,jsonData,settings,obj_callback){
      for (var i = 0; i < row[settings.linkField.nextJoint].length; i++){
          var val2 = val2 || {};
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
          val2.push(jointOnJoint.call(this,obj,obj[row.nextJoint[i]],val,obj[row.nextJoint[i]].augment,obj[row.nextJoint[i]].jsonData,settings,obj_callback));
      }
    return val2;
  }
  
  function setLayout(obj,row,val,aug,jsonData,settings,obj_callback){
    var thisObj = new suzunariLayout.SuzunariContener(val);
    var test3 = obj[row[settings.linkField.nextJoint][0]][settings.linkField.augment];
    var joints = new Joints(obj,row,settings,obj_callback);
 //   obj_callback.test = testJoint2;
    var tes =jointOnJoint.call(thisObj,joints,row,val,aug,jsonData,settings,obj_callback);
    var testAry = {};
 //   var param = JSON.parse(e.parameter.jointData)
    testAry.pageDiv = []
//    testAry.pageDiv.push({"left":JSON.stringify(test3)});//+JSON.stringify(ary)+jsondata.field.indexOf(jsondata.linkField.jointName)});
//    testAry.pageDiv.push({"left":"test"});
    var test = {};
    test.pageDiv = testAry;
    thisObj.addData(testAry);
    return thisObj;
  }
  
  function addPropertyJoint(obj,row,val,aug,jsonData,settings,obj_callback){
        if(this[aug.target]){
            this[aug.target] += val;
        }else{
            this[aug.target] = val;
        }
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
  

  function margeListJoint(obj,row,val,aug,jsonData,settings,obj_callback){//<<<<<
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

  function listJoint(obj,row,val,aug,jsonData,settings,obj_callback){//<<<
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
 
  function joinListJoint(obj,row,val,aug,jsonData,settings,obj_callback){//<<<<<
    var i = 0;
        while(obj[row[settings.linkField.jointName] + "-" + i] !== undefined){
        var val1 = val1 || "";
        val1 += jointOnJoint.call(this,obj,obj[row[settings.linkField.jointName] + "-" + i],val,obj[row[settings.linkField.jointName] + "-" + i][settings.linkField.augment],obj[row[settings.linkField.jointName] + "-" + i][settings.linkField.jsonData],settings,obj_callback);
        i++;
            if(obj_callback){
                for(var key in obj_callback){
                    obj_callback[key].call(this,obj,row,val,aug,jsonData,settings,obj_callback);
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

  function jsonStringifyJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    return JSON.stringify(val);
  }

  function liblaryTemplateFromFileJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    var re = jsonData.replaceData || {}
        if(isObject(val)){
            re = marge(re,val)
        }
    var html = HtmlService.createTemplateFromFile(aug.fileName);
        for(var key in re){
           html[key] = re[key]
        }
    return html.evaluate().getContent();
  }
  
  function replaceTemplateFromJsonJoint(obj,row,val,aug,jsonData,settings,obj_callback){
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

  function combineNextJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    this[aug.target] = combineArrayObject(this[aug.target],val);
  }
  
  function combineJsonJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    this[aug.target] = combineArrayObject(this[aug.target],jsonData);
  }

  function combineJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    this[aug.target] = combineArrayObject(this[aug.target],combineArrayObject(val,jsonData));
  }
    
  function singleJoint(obj,row,val,aug,jsonData,settings,obj_callback){
    return val;
  }

  function joinInJoint(obj,row,val,aug,jsonData,settings,obj_callback){
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

  function getJointTable(ary,keys,jsonKeys,linkField,keyIndex){
    var obj ={};
        for (var i = 0; i < keys.length; i++){//<<<<<<< 
            for(var key in linkField){
                if(keys[i] == linkField[key]){
                    keys[i] = key;
                }
            }
        }
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
  
  function replaceTemplateTag(text,obj){
      for(var key in obj){
          var re = new RegExp("<\\?=? *(" + key + "|this." + key + ") *\\?>","g");
          text = text.replace(re,obj[key]);
      }
    return text;
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