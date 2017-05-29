function SuzunariLayout(layout,pages){

  this.pages = pages;
  this.layout = layout;
  
  this.contentFromSetting = function(setting) { // this を探して、Library Funcを探す 引数はsetting,key(target)書き込む場所,i(page)目的のページ
    var obj = castLayout(setting.layout);
    var layout = obj.layout;
      for (var i = 0; i < layout.length; i++){
        if(layout[i]){
          for(var key in layout[i]) {
            var val = layout[i][key].split("&");  //　”＆”で複数の入力が可能
              for (var j = 0; j < val.length; j++){
                var name = this.libraryName + this.libraryNo + key + i;
               this.insertContent(key,this.searchFunc(val[j],setting,key,obj.pages,i,name),i);
              // suzunari.appendContent.call(this.content,'header',key + '----' + i + '------' + this.content.pageDiv[i] + '<br>') 
              // this.addPage('right',0,JSON.stringify(this.content.pageDiv[0].right) + '<br>');
              };
           };
        };
     };
  };
  
  this.insertContent = function(key,val,i){
    if(key && val && i !== undefined){
      if(key === 'left' || key === 'center' || key === 'right' || key === 'hid'){
       this.content.pageDiv = this.content.pageDiv || [];
     //   this.content.pageDiv[i] = this.content.pageDiv[i] || {};
        this.addPage(key,i,val);
       // this.addPage('right',0,val + '    ' + i + '    ' + key +'<br>');
      //  this.content.pageDiv[i] = this.content.pageDiv[i] || {};
      //     addArrayObject2.call(this.content.pageDiv[i],key,val);
    }else{
      suzunari.appendContent.call(this.content,key,val);
      };
    };
  };
  
  this.addPage = function(target,page,val){
    this.content['pageDiv'] = this.content['pageDiv'] || [];
   this.content['pageDiv'][page] = this.content['pageDiv'][page] || {};
 //   this.content['pageDiv'][page][target] = this.content['pageDiv'][page][target] || "";
    if(this.content['pageDiv'][page][target] !== undefined){
      this.content['pageDiv'][page][target] += val;
    }else{
      this.content['pageDiv'][page][target] = val;
    };
  };
  this.test = function(){
    return "ffffffffffffffffffff";
  }
 
  this.btnGroup = function(setting,target,pages,pageNo) {
    var btn = setting.button;
    
    if(this.count['btnGroup'+ target] === undefined){
      this.count['btnGroup'+ target] ++;
      var btnGroup = "";
      btnGroup += '<div class="btn-group';
      btnGroup += this.listPageNo(pages.btnGroup[target]);
      btnGroup += '">';  // + JSON.stringify(setting.button);
      btnGroup += this.searchParts(setting.button,"parts",'btnGroup',pages);
      btnGroup += '</div>';
    //  this.ifAny('btnGroup-' + target,target,btnGroup);
    //  this.addPage(target,pageNo,btnGroup);
      return btnGroup;
      };
    //  return btnGroup;
  }

  this.ulGroup = function(setting,target,pages) {
    var btn = setting.button;
    
    if(this.count['ulGroup'+ target] === undefined){
      this.count['ulGroup'+ target] ++;
      var ulGroup = "";
      ulGroup += '<div class="list-group list-inline';
      ulGroup += this.listPageNo(pages.ulGroup[target]);
      ulGroup += '">';// + JSON.stringify(pages);
      ulGroup += this.searchParts(setting.button,"parts",'ulGroup',pages);
      ulGroup += '</div>';
      return ulGroup;
    //  this.ifAny('ulGroup-' + target,target,ulGroup);
   //   this.ifAny('ulGrouptest-' + target,'body',ulGroup);
      };
  }

  this.listGroup = function(setting,target,pages) {
    var btn = setting.button;
    
    if(this.count['listGroup'+ target] === undefined){
      this.count['listGroup'+ target] ++;
      var listGroup = "";
      listGroup += '<div class="list-group list-inline';
      listGroup += this.listPageNo(pages.listGroup[target]);
      listGroup += '">';// + JSON.stringify(pages);
      listGroup += this.searchParts(setting.button,"parts",'listGroup',pages);
      listGroup += '</div>';
      return listGroup
    //  this.ifAny('listGroup-' + target,target,listGroup);
      };
  }

  this.defaultButton = function(btn,btnNo,target,page){
    var button = "";
//    var buttonName = 

    this.searchFunc(btn.script,btn,btnNo,'jqueryIni',page);

    switch (target){
      case 'ulGroup':
         button += '<a class="nav navbar-nav list-group-item list-group-item-' + btn.style + ' btn-' + this.libraryName + this.libraryNo + '-' + btn.name;
         button += '" href="javascript:boid(0)" onclick="' + this.libraryName + btn.name + '(' + this.libraryNo + ')">';
           if(btn.glyphicon) {
             button += '<span class="list-group-item-text glyphicon ' + btn.glyphicon + '"></span> ';
            }
         button += '<b>' + btn.val + '</b></a>'
       return button;
        break;
      case 'listGroup':
         button += '<a class="list-group-item list-group-item-' + btn.style + ' btn-' + this.libraryName + this.libraryNo + '-' + btn.name
         button  += '" href="javascript:boid(0)" onclick="' + this.libraryName + btn.name + '(' + this.libraryNo + ')">';
           if(btn.glyphicon) {
             button += '<span class="list-group-item-text glyphicon ' + btn.glyphicon + '"></span> ';
            }
         button += '<b>' + btn.val + '</b></a>'
       return button;
        break;
      case 'btnGroup':
      default:
        button += '<button type="button" class="btn-' + btn.style + ' btn-' + this.libraryName + this.libraryNo + '-' + btn.name
        button += ' btn-' + btn.size + '" value="click" onclick="' + this.libraryName + btn.name + '(' + this.libraryNo + ')">';
          if(btn.glyphicon) {
            button += '<span class="glyphicon ' + btn.glyphicon + '"></span> ';
          };
       button += '<b>' + btn.val + '</b></button> ';
       return button;
       break;
    };
  };
  
  this.pageButton = function(btn,btnNo,target,page){
    var buttonName = this.libraryName + this.libraryNo + '-' + btn.name;
    var val = '$(".btn-' + this.libraryName + this.libraryNo + '-' + btn.name +'").on("click",function(){ pageCanger(' + btnNo + ')});';
    this.ifAny(buttonName,target,val);
  };
  
  
  this.listPageNo = function (ary){
    var page = " page-cng";
      for (var i = 0; i < ary.length; i++){
        page += ' page-' + ary[i];
      }
    return page;
  }


}

//SuzunariController.prototype = Object.create(suzunari.SuperSuzunari.prototype, {value: {constructor: SuzunariController}});

function SuzunariContener(parameter){

  html = HtmlService.createTemplateFromFile('main');

  // contens 
  
  this.parameter = parameter;  
  this.title = "suzunari";
  this.faviconUrl = "https://dl.dropboxusercontent.com/s/5ksh84yv74revaa/Suzunari.ico";
  this.settings = {};
  this.data = [];
  this.layout = [{"left":"class:col-md-4"},
                 {"center":"class:col-md-4"},
                 {"right":"class:col-md-4"},
                 {"modal":"class:container-fluid"}]
  this.css = HtmlService.createHtmlOutputFromFile('css').getContent();
  this.plugins = HtmlService.createHtmlOutputFromFile('plugins').getContent();
  this.pluginCss = HtmlService.createHtmlOutputFromFile('pluginCss').getContent();
  this.javascript = replaceTag(HtmlService.createHtmlOutputFromFile('javascript').getContent());
  this.jqueryIni = replaceTag(HtmlService.createHtmlOutputFromFile('jqueryIni').getContent());
  this.navbarHeader = "";
  this.header = '<br><br><br><div class="header">';
  this.pageDiv = [];
  this.modalDiv = "";
  this.footer = "<small><a href='#'>Copyright (C) Suzunari since 2017 made japan.</a></small><br>";
  this.navbarFooter = "";
  this.html = html
  
  
  // function
  
  this.evaluate = function() {
  
    html.settings = JSON.stringify(this.settings);
    html.data = JSON.stringify(this.data);

    html.css = this.combinationCss();
    html.plugins = this.plugins;
    html.javascript = this.javascript;
    html.jqueryIni = this.jqueryIni;
    html.navbarHeader = this.navbarHeader
    html.header = this.header + '</div>' + JSON.stringify(this.layout);
    html.modalDiv = this.modalDiv;
//    html.left = this.left + '</div>';
    html.pageDiv = castPages(this.layout,this.pageDiv);//[{left:'page0 left',center:'page0 center',right:'page0 Right'},{left:'page1 left',center:'page1 center',right:'page1 Right'},{left:'page2 left',center:'page2 center',right:'page2 Right'}]);//JSON.stringify(this.settings.main.layout);
//    html.body = combineArrayObject(this.pageDiv,content.pageDiv);//this.body + this.jqueryIni + '</div>';  // + JSON.stringify(this.settings.main.page);
//    html.right = this.right + '</div>';
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
  
  
  this.combinationCss = function() {
  var css = HtmlService.createHtmlOutput();
      css.append(this.pluginCss);
      css.append(this.css);
  return css.getContent();
  }
  
  this.addData = function(content,libraryNo){
    for(var key in content){
      switch (key) {
      case 'data':
        this.data[libraryNo] = content.data;
      break;
      case 'css':
      case 'plugins':
      case 'pluginCss':
        this[key] += content[key];
      break;
      case 'javascript':
        this.javascript += replaceTag(content.javascript);
      break;
      case 'jqueryIni':
        this.jqueryIni += replaceTag(content.jqueryIni);
      break;
      case 'body':
     //   this.body += bodyDiv(content.body);
      break;
      case 'pageDiv':
        if(!this.pageDiv){  
          this.pageDiv =　content.pageDiv;
        }else{
          this.pageDiv = combineArrayObject(this.pageDiv,content.pageDiv);
        };
      break;
      default:
        this[key] += content[key];
      break;
      };
    };
  };
  this.addPage = function(i,target,val){
    this.pageDiv[0]["left"] += val;
   // this.pageDiv = this.pageDiv || []
   // this.pageDiv[i][target] = this.pageDiv[i][target] || {};
   // this.pageDiv[i][target] += val
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

function castPages(layout,content){
  var pages = ""
  for (var i = 0; i < content.length; i++){
    pages += '<div class="container-fluid v-zoom page-cng page-'+ i +'">';
    if(layout && content){
    if(layout[i].left && content[i].left){
      pages += '<div' + castElement(castValue(layout[i].left)) +'>';
        if(content[i].left){
          pages += content[i].left;
        }
      pages += '</div>';
    };
    if(layout[i].center && content[i].center){
      pages += '<div' + castElement(castValue(layout[i].center)) +'>';
        if(content[i].center){
          pages += content[i].center;
        }
      pages += '</div>';
    };
    if(layout[i].right && content[i].right){
      pages += '<div' + castElement(castValue(layout[i].right)) +'>';
        if(content[i].right){
          pages += content[i].right;
        }
      pages += '</div>';
    };
    if(layout[i].hid && content[i].hid){
      pages += '<div' + castElement(castValue(layout[i].hid)) +'>';
        if(content[i].hid){
          pages += content[i].hid;
        }
      pages += '</div>';
    };
    if(layout[i].modal && content[i].modal){
      pages += '<div' + castElement(castValue(layout[i].modal)) +'>';
        if(content[i].modal){
          pages += content[i].modal;
        }
      pages += '</div>';
    };
    };
  pages += '</div>'
  };
  return pages;//castElement(castValue(layout[0].center));//JSON.stringify(castElement(castValue(layout[0].center)));
}

function castValue(val){
  var obj = {};
  var ary1 = [];
  if(val !== undefined){
　　 if (val.indexOf(',') != -1) {
　　   ary1 = val.split(",");
　　   for (var i = 0; i < ary1.length; i++){
        if ( ary1[i].indexOf(':') != -1) {
        var ary2 = [];
        ary2 = ary1[i].split(":");
        obj[ary2[0]] = ary2[1];
      } else {
      obj = ary1
    };      
  };
  return obj;
  } else if(val.indexOf(':') != -1){    
    var ary2 = [];
    ary2 = val.split(":");
    obj[ary2[0]] = ary2[1];
    return obj;
  } else {
  return val;
  };
  }
}

function addArrayObject2(index,key,val){  //call thisObjectはarrayObuject
 // this[index] = this[index] || {};
//  if(this[index] !== undefined){
//    this[index] = {}
//  };
    if(this[key] !== undefined){
      this[key] += val;
    }else{
      this[key] = val;
    };
}


function castElement(elm){
    var element = ""
    for(var key in elm){
        element += " " + key + '="' + elm[key] + '"';
     }
    return element;
  }


function replaceTag(val){
  var ret = val.replace( /'<script>'/g , "" );
  ret = ret.replace( /'<\/script>'/g , "" );
  ret = ret.replace( /'<script\/>'/g , "" );
  return ret;
}

function bodyDiv(val) {
  var div = '<div>';
      div += val;
      div += '</div>';
  return div;
}

function castLayout(list){
  var obj = {};
  var ary1 = [];
    for (var i = 0; i < list.length; i++){
      if(list[i]){
        var ary2 = list[i].split(",");
        var obj2 = {};
          for (var j = 0; j < ary2.length; j++){
            var ary3 = ary2[j].split(":");
            obj2[ary3[0]] = ary3[1];
            var ary4 = ary3[1].split("&");
              for (var k = 0; k < ary4.length; k++){
                if(obj[ary4[k]] === undefined){
                  obj[ary4[k]] = {};
                  obj[ary4[k]][ary3[0]] = [i];
                } else if(obj[ary4[k]][ary3[0]] === undefined){
                  obj[ary4[k]][ary3[0]] = [i];
                }else{
                  obj[ary4[k]][ary3[0]].push(i);
                };
              };
          };
        ary1[i] = obj2;  
      };
    };
    var obj3 = {};
    obj3['layout'] = ary1;
    obj3['pages'] = obj;
  return obj3;      
}

function libraryOutputFromFile(name) {
   return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function libraryTemplateFromFile(name) {
  return HtmlService.createTemplateFromFile(name);
}