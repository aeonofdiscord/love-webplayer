// see also love.render.js
var gl;
var gWebGLCanvasId;
var shaderProgram;

/// called on startup after pageload
function Love_Graphics_Init (id_canvas) {
	gWebGLCanvasId = id_canvas;
	canvas = document.getElementById(id_canvas);
	initWebGL(canvas);      // Initialize the GL context  
	if (!gl) return; // WebGL available and working  
	LoveRender_Init();
	MyCheckGLError();
	MainInitScene();
	MyCheckGLError();
}

/// init lua api
function Love_Graphics_CreateTable (G) {
	var t = lua_newtable();
	var pre = "love.graphics.";

	G.str['love'].str['graphics'] = t;
	
	// love.graphics.newImage(path)
	t.str['newImage']	= function (path) { return [new cLoveImage(path)]; }
	
	// love.graphics.setBackgroundColor(r,g,b)
	t.str['setBackgroundColor']	= function (r,g,b) { gl.clearColor(r/255.0, g/255.0, b/255.0, 1.0); }
	
	// love.graphics.setColor(r,g,b,a)
	t.str['setColor']	= function (r,g,b,a) { setColor(r,g,b,a); } //  MainPrint("graphics.setColor called");
	
	//~ love.graphics.draw(drawable, x, y, r, sx, sy, ox, oy )
	t.str['draw']		= function (drawable, x, y, r, sx, sy, ox, oy ) {
		if (drawable.IsImage())
				DrawSprite(drawable.GetTextureID(),drawable.GetWidth(),drawable.GetHeight(),x,y,r || 0.0,sx || 1.0,sy || 1.0,ox || 0.0,oy || 0.0);
		else	drawable.RenderSelf(x,y,r || 0.0,sx || 1.0,sy || 1.0,ox || 0.0,oy || 0.0);
	}
	
	// TODO : "newImage" overloads
	// TODO : "draw" overloads
	
	t.str['checkMode']			= function () { return NotImplemented(pre+'checkMode'); }
	t.str['circle']				= function () { return NotImplemented(pre+'circle'); }
	t.str['clear']				= function () { return NotImplemented(pre+'clear'); }
	t.str['drawq']				= function () { return NotImplemented(pre+'drawq'); }
	t.str['getBackgroundColor']	= function () { return NotImplemented(pre+'getBackgroundColor'); }
	t.str['getBlendMode']		= function () { return NotImplemented(pre+'getBlendMode'); }
	t.str['getCaption']			= function () { return NotImplemented(pre+'getCaption'); }
	t.str['getColor']			= function () { return NotImplemented(pre+'getColor'); }
	t.str['getColorMode']		= function () { return NotImplemented(pre+'getColorMode'); }
	t.str['getFont']			= function () { return NotImplemented(pre+'getFont'); }
	t.str['getHeight']			= function () { return NotImplemented(pre+'getHeight'); }
	t.str['getLineStipple']		= function () { return NotImplemented(pre+'getLineStipple'); }
	t.str['getLineStyle']		= function () { return NotImplemented(pre+'getLineStyle'); }
	t.str['getLineWidth']		= function () { return NotImplemented(pre+'getLineWidth'); }
	t.str['getMaxPointSize']	= function () { return NotImplemented(pre+'getMaxPointSize'); }
	t.str['getModes']			= function () { return NotImplemented(pre+'getModes'); }
	t.str['getPointSize']		= function () { return NotImplemented(pre+'getPointSize'); }
	t.str['getPointStyle']		= function () { return NotImplemented(pre+'getPointStyle'); }
	t.str['getScissor']			= function () { return NotImplemented(pre+'getScissor'); }
	t.str['getWidth']			= function () { return NotImplemented(pre+'getWidth'); }
	t.str['isCreated']			= function () { return NotImplemented(pre+'isCreated'); }
	t.str['line']				= function () { return NotImplemented(pre+'line'); }
	t.str['newFont']			= function () { return NotImplemented(pre+'newFont'); }
	t.str['newFramebuffer']		= function () { return NotImplemented(pre+'newFramebuffer'); }
	t.str['newImageFont']		= function () { return NotImplemented(pre+'newImageFont'); }
	t.str['newParticleSystem']	= function () { return NotImplemented(pre+'newParticleSystem'); }
	t.str['newQuad']			= function () { return NotImplemented(pre+'newQuad'); }
	t.str['newScreenshot']		= function () { return NotImplemented(pre+'newScreenshot'); }
	t.str['newSpriteBatch']		= function () { return NotImplemented(pre+'newSpriteBatch'); }
	t.str['point']				= function () { return NotImplemented(pre+'point'); }
	t.str['polygon']			= function () { return NotImplemented(pre+'polygon'); }
	t.str['pop']				= function () { return NotImplemented(pre+'pop'); }
	t.str['present']			= function () { return NotImplemented(pre+'present'); }
	t.str['print']				= function () { return NotImplemented(pre+'print'); }
	t.str['printf']				= function () { return NotImplemented(pre+'printf'); }
	t.str['push']				= function () { return NotImplemented(pre+'push'); }
	t.str['quad']				= function () { return NotImplemented(pre+'quad'); }
	t.str['rectangle']			= function () { return NotImplemented(pre+'rectangle'); }
	t.str['reset']				= function () { return NotImplemented(pre+'reset'); }
	t.str['rotate']				= function () { return NotImplemented(pre+'rotate'); }
	t.str['scale']				= function () { return NotImplemented(pre+'scale'); }
	t.str['setBlendMode']		= function () { return NotImplemented(pre+'setBlendMode'); }
	t.str['setCaption']			= function () { return NotImplemented(pre+'setCaption'); }
	t.str['setColorMode']		= function () { return NotImplemented(pre+'setColorMode'); }
	t.str['setFont']			= function () { return NotImplemented(pre+'setFont'); }
	t.str['setIcon']			= function () { return NotImplemented(pre+'setIcon'); }
	t.str['setLine']			= function () { return NotImplemented(pre+'setLine'); }
	t.str['setLineStipple']		= function () { return NotImplemented(pre+'setLineStipple'); }
	t.str['setLineStyle']		= function () { return NotImplemented(pre+'setLineStyle'); }
	t.str['setLineWidth']		= function () { return NotImplemented(pre+'setLineWidth'); }
	t.str['setMode']			= function () { return NotImplemented(pre+'setMode'); }
	t.str['setPoint']			= function () { return NotImplemented(pre+'setPoint'); }
	t.str['setPointSize']		= function () { return NotImplemented(pre+'setPointSize'); }
	t.str['setPointStyle']		= function () { return NotImplemented(pre+'setPointStyle'); }
	t.str['setRenderTarget']	= function () { return NotImplemented(pre+'setRenderTarget'); }
	t.str['setScissor']			= function () { return NotImplemented(pre+'setScissor'); }
	t.str['toggleFullscreen']	= function () { return NotImplemented(pre+'toggleFullscreen'); }
	t.str['translate']			= function () { return NotImplemented(pre+'translate'); }
	t.str['triangle']			= function () { return NotImplemented(pre+'triangle'); }

}

function setColor (r,g,b,a) {
	gl.uniform4f(shaderProgram.materialColorUniform,(r || 255.0)/255.0, (g || 255.0)/255.0, (b || 255.0)/255.0, (a || 255.0)/255.0);
}

/// called every frame (before love.update and love.draw)
function Love_Graphics_Step_Start() {
	if (shaderProgram == null) return;
	UtilReshapeCanvas(gl,gWebGLCanvasId); // resize+viewport+cam perspective
	
	if (shaderProgram != null) {
		SetMaterialColor(1,1,1,1);
		MySetTranslateUniform(0,0,0);
	}
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	resetTransformMatrix();
	//~ perspective(45, gMyCanvasWidth / gMyCanvasHeight, 0.1, 100.0);
	//~ loadIdentity();
	MyCheckGLError();
}

/// called every frame (after love.update and love.draw)
function Love_Graphics_Step_End() {
	if (shaderProgram == null) return;
	MyCheckGLError();
	gl.flush(); // finish/swapbuffer (optional?)
}

/*
notes
var lighting = false;
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, crateTexture);
gl.uniform1i(shaderProgram.samplerUniform, 0);
gl.uniform1i(shaderProgram.useLightingUniform, lighting);
*/

// ***** ***** ***** ***** ***** love sprites

function DrawLoveSprite(tex, x, y, r, sx, sy, ox, oy) {
	
}

// ***** ***** ***** ***** ***** cImage

function cLoveImage (path) {
	var bPixelArt = false;
	//~ var bPixelArt = true;
	this.path = path;
	this.tex = loadImageTexture(gl, path, bPixelArt);
	
	this.GetTextureID	= function () { return this.tex; }
	this.IsImage		= function () { return true; }
	this.GetWidth		= function () { return this.tex.image.width; }
	this.GetHeight		= function () { return this.tex.image.height; }
}

// ***** ***** ***** ***** ***** webgl stuff 


function MainInitScene () {
	gl.clearColor(1,1,1,1);  // Set clear color to black, fully opaque  
	gl.clearDepth(1.0);                 // Clear everything  
	//~ gl.enable(gl.TEXTURE_2D); // needed for chrome@archlinux(fkrauthan,26.12.2010)
	//~ gl.enable(gl.DEPTH_TEST);           // Enable depth testing  
	//~ gl.depthFunc(gl.LEQUAL);            // Near things obscure far things  
	gl.disable(gl.CULL_FACE); 
	gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA,  gl.ZERO,  gl.ONE); // rgb=blended alpha=keep-destination
	// alpha,1-alpha,0,1 = replace ?   not available in webgl: gl.texEnvf(gl.TEXTURE_ENV, gl.TEXTURE_ENV_MODE, gl.REPLACE);
	gl.blendEquation(gl.FUNC_ADD); // = blendEquationSeparate(add,add)
	
	// todo : love.setBlendMode/setColorMode see love-android-java
	//~ t.set("setBlendMode",		new VarArgFunction() { @Override public Varargs invoke(Varargs args) { setBlendMode(Str2BlendMode(args.checkjstring(1))); return LuaValue.NONE; } });
	//~ t.set("setColorMode",		new VarArgFunction() { @Override public Varargs invoke(Varargs args) { setColorMode(Str2ColorMode(args.checkjstring(1))); return LuaValue.NONE; } });
		
	//~ gl.activeTexture(gl.TEXTURE0);
	//~ gl.projGuiMatrix = new J3DIMatrix4(); // needed for gui

	MyCheckGLError();
	
	// shaders
	if (1) {
		var fragmentShader = getShader(gl, "shader-fs");
		var vertexShader = getShader(gl, "shader-vs");

		// Create the shader program
		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		
		// Bind attributes
		//~ var attribs = [ "vNormal", "vColor", "vPosition"];
		//~ for (var i in attribs)
			//~ gl.bindAttribLocation (shaderProgram, i, attribs[i]);
			
		gl.linkProgram(shaderProgram);
		
		// If creating the shader program failed, alert
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert("Unable to initialize the shader program.");
			return;
			// note : this happens on win-vista missing drivers (directx for angle or opengl) for webgl in firefox beta8
		}

		gl.useProgram(shaderProgram);


		shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

		//~ shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
		//~ gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

		shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
		gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

		shaderProgram.pMatrixUniform			= gl.getUniformLocation(shaderProgram, "uPMatrix");
		shaderProgram.mvMatrixUniform			= gl.getUniformLocation(shaderProgram, "uMVMatrix");
		shaderProgram.nMatrixUniform			= gl.getUniformLocation(shaderProgram, "uNMatrix");
		shaderProgram.samplerUniform			= gl.getUniformLocation(shaderProgram, "uSampler");
		shaderProgram.my_uTranslate				= gl.getUniformLocation(shaderProgram, "uTranslate");
		shaderProgram.useLightingUniform		= gl.getUniformLocation(shaderProgram, "uUseLighting");
		shaderProgram.ambientColorUniform		= gl.getUniformLocation(shaderProgram, "uAmbientColor");
		shaderProgram.materialColorUniform		= gl.getUniformLocation(shaderProgram, "uMaterialColor");
		shaderProgram.lightingDirectionUniform	= gl.getUniformLocation(shaderProgram, "uLightingDirection");
		shaderProgram.directionalColorUniform	= gl.getUniformLocation(shaderProgram, "uDirectionalColor");
		if (shaderProgram.my_uTranslate == null || shaderProgram.my_uTranslate == -1) alert("shader error : couldn't find uTranslate");
	
		gl.uniform4f(shaderProgram.materialColorUniform,1,1,1,1);
		
		MyCheckGLError();
	
		/* old shader init pre chrome archlinux fix

		// Set some uniform variables for the shaders
		//~ gl.uniform3f(gl.getUniformLocation(shaderProgram, "lightDir"), 0, 0, 1);
		gl.uniform1i(gl.getUniformLocation(shaderProgram, "sampler2d"), 0);
		
		gl.mvMatrix = new J3DIMatrix4();
		gl.mvpMatrix = new J3DIMatrix4();
		gl.u_modelViewProjMatrixLoc = gl.getUniformLocation(shaderProgram, "u_modelViewProjMatrix");
		gl.u_MaterialColorLoc = gl.getUniformLocation(shaderProgram, "u_MaterialColor");
		SetMaterialColor(1,1,1,1);

		//~ vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
		//~ gl.enableVertexAttribArray(vertexPositionAttribute);
		*/
	}
	
	// mapdata
	
	//~ gTex_Tools		= loadImageTexture(gl, "gfx/tools.gif", true);
	
	//~ LoadMapData();
	//~ InitPlayerPos(gCamPos[0],gCamPos[1],gCamPos[2]);
	//~ PlayerToolInit();
	//~ OtherPlayerInit();
}

function SetMaterialColor (r,g,b,a) { gl.uniform4f(gl.u_MaterialColorLoc,r,g,b,a ? a : 1); }

function MySetTranslateUniform (x,y,z) { gl.uniform3f(shaderProgram.my_uTranslate,x,y,z); }

/*
// lesson07 matrix ops
var mvMatrix;
var pMatrix;
function loadIdentity() { mvMatrix = Matrix.I(4); }
function multMatrix(m) { mvMatrix = mvMatrix.x(m); }
function perspective(fovy, aspect, znear, zfar) { pMatrix = makePerspective(fovy, aspect, znear, zfar); }

function mvTranslate(v) {
	var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
	multMatrix(m);
}

function mvRotate(ang, v) {
	var arad = ang * Math.PI / 180.0;
	var m = Matrix.Rotation(arad, $V([v[0], v[1], v[2]])).ensure4x4();
	multMatrix(m);
}

*/

var gPerspective;
function matrixGetIdentity() { return [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ]; }
function matrixGetSimple(tx,ty,tz, sx,sy,sz) { return [ sx,0,0,0, 0,sy,0,0, 0,0,sz,0, tx,ty,tz,1 ]; }

function setMatrixUniforms() {
    //~ gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, new Float32Array(pMatrix.flatten()));
    //~ gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, new Float32Array(mvMatrix.flatten()));
	
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform,  false, new Float32Array(gPerspective)); // perspective
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, new Float32Array(matrixGetIdentity())); // modelview
	gl.uniformMatrix4fv(shaderProgram.nMatrixUniform,  false, new Float32Array(matrixGetIdentity())); // normal (unused)
}

function resetTransformMatrix	() {
	//~ perspective(45, gMyCanvasWidth / gMyCanvasHeight, 0.1, 100.0);
	// init pixel coordinatesystem
	//~ loadIdentity(); //~ gl.glLoadIdentity();
	//~ gl.glTranslatef(-1,1,0);
	//~ if (bResolutionOverrideActive) {
		//~ gl.glScalef(2f/(mfResolutionOverrideX),-2f/(mfResolutionOverrideY),1);
	//~ } else {
		//~ gl.glScalef(2f/(vm.mfScreenW),-2f/(vm.mfScreenH),1);
	//~ }
	var w = gMyCanvasWidth;
	var h = gMyCanvasHeight;
	gPerspective = matrixGetIdentity();
	gPerspective = matrixGetSimple(-1.0,1.0,0.0, 2/w,-2/h,1);
	setMatrixUniforms();
}


