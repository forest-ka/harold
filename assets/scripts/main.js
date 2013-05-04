
var VERSION=[0,0,1];

var modules=["main","prop","canvas","crayon","world","harold"];
var module_number=0;
var module_start_time;

function loaded(module) {
    if(!(module in modules))
	throw "ModuleError: nonexistent module '"+module+"'";
    if(modules[module] == true)
	throw "ModuleError: module '"+module+"' was loaded multiple times";
    console.log("Loaded "+module);
    module_number+=1;
    modules[module]=true;
    for(var i in modules) {
	if(modules[i] == false)
	    return;
    }
    done();
}

function init() {
    module_start_time=new Date().getTime();
    var m={};
    for(var i=0;i<modules.length;i++)
	m[modules[i]]=false;
    modules=m;
}

function error(e) {
    $("#loading h1").text("Harold's crayon melted.");
    $("#loading h1").attr("title","Unfortunately, there's been an error.");
    console.log("Original error: "+e);
    $("#loading").addClass("error");
}

window.onload=function() {
    init();
    setTimeout(function() {
	try {
	    prop_init(); // MUST BE FIRST!
	    crayon_init();
	    world_init();
	    harold_init();
	    canvas_init();
	    loaded("main");
	} catch(e) {
	    error(e);
	}
    },0);
};

function done() {
    var time=new Date().getTime()-module_start_time;
    time=(time/1000).toFixed(3);
    console.log("Loaded "+module_number+" module"+s(module_number)+" in "+time+" second"+s(time))
    update();
    $("#loading").addClass("hidden");
    setTimeout(function() {
	$("#loading").css("display","none");
    },1000);
}

var last_frame_time=0;

function update() {
    var time=new Date().getTime();
    requestAnimationFrame(update);
    var fps=1/((time-last_frame_time)/1000);
    if(!prop.loaded) {
	$("#loading").removeClass("error");
	prop.loaded=true;
    }
    world_update();
    harold_update();
    canvas_update();
    prop.about.fps=((fps*(prop.about.fps_samples-1))+prop.about.fps)/prop.about.fps_samples;
    last_frame_time=time;
}