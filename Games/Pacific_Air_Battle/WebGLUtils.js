/*
 * Copyright 2021 GFXFundamentals.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of GFXFundamentals. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
class WebGLUtils
{
	constructor(gl)
	{
		this.gl = gl;
		this.defaultShaderType = 
		[
			'VERTEX_SHADER',
			'FRAGMENT_SHADER',
		];
	}
	/**
	 * Creates a program, attaches shaders, binds attrib locations, links the
	 * program and calls useProgram.
	 * @param shaders The shaders to attach
	 * @memberOf module:webgl-utils
	 */
	createProgram(
	shaders) 
	{
		const program = this.gl.createProgram();
		shaders.forEach((shader) =>
		{
			this.gl.attachShader(program, shader);
		});    
		this.gl.linkProgram(program);

		// Check the link status
		const linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
		if (!linked) 
		{
		// something went wrong with the link
			return null;
		}
		return program;
	}
	/**
	 * Creates a ProgramInfo from 2 sources.
	 *
	 * A ProgramInfo contains
	 *
	 *     programInfo = {
	 *        program: WebGLProgram,
	 *        uniformSetters: object of setters as returned from createUniformSetters,
	 *        attribSetters: object of setters as returned from createAttribSetters,
	 *     }
	 *
	 * @param shaderSources Array of sources for the
	 *        shaders or ids. The first is assumed to be the vertex shader,
	 *        the second the fragment shader.
	 *        on error. If you want something else pass an callback. It's passed an error message.
	 * @return The created program.
	 * @memberOf module:webgl-utils
	 */
	createProgramFromSources(
	shaderSources) 
	{
		const shaders = [];
		for (let ii = 0; ii < shaderSources.length; ++ii) 
		{
			shaders.push(this.loadShader(
			shaderSources[ii], this.gl[this.defaultShaderType[ii]]/*, opt_errorCallback*/));
		}
	return this.createProgram(shaders/*, opt_attribs, opt_locations, opt_errorCallback*/);
	}
	/**
	 * Loads a shader.
	 * @param {string} shaderSource The shader source.
	 * @param {number} shaderType The type of shader.
	 * @return {WebGLShader} The created shader.
	 */
	loadShader(shaderSource, shaderType) 
	{
		// Create the shader object
		const shader = this.gl.createShader(shaderType);

		// Load the shader source
		this.gl.shaderSource(shader, shaderSource);

		// Compile the shader
		this.gl.compileShader(shader);

		// Check the compile status
		const compiled = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);

		return shader;
	}
	/**
	 * Resize a canvas to match the size its displayed.
	 * @param {HTMLCanvasElement} canvas The canvas to resize.
	 * @param {number} [multiplier] amount to multiply by.
	 *    Pass in window.devicePixelRatio for native pixels.
	 * @return {boolean} true if the canvas was resized.
	 * @memberOf module:webgl-utils
	 */
	resizeCanvasToDisplaySize(canvas, multiplier = 1) 
	{
		const width  = canvas.clientWidth  * multiplier | 0;
		const height = canvas.clientHeight * multiplier | 0;
		if (canvas.width !== width ||  canvas.height !== height) 
		{
			canvas.width  = width;
			canvas.height = height;
			return true;
		}
		return false;
	}
}