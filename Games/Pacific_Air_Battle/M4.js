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
class M4
{
	constructor()
	{
		this.MatType = Float32Array;
	}
	/**
	 * Makes an identity matrix.
	 * @param  [dst] optional matrix to store result
	 * @return dst or a new matrix if none provided
	 * @memberOf module:webgl-3d-math
	 */
	identity(dst = new this.MatType(16)) 
	{
		dst[ 0] = 1;
		dst[ 1] = 0;
		dst[ 2] = 0;
		dst[ 3] = 0;
		dst[ 4] = 0;
		dst[ 5] = 1;
		dst[ 6] = 0;
		dst[ 7] = 0;
		dst[ 8] = 0;
		dst[ 9] = 0;
		dst[10] = 1;
		dst[11] = 0;
		dst[12] = 0;
		dst[13] = 0;
		dst[14] = 0;
		dst[15] = 1;

		return dst;
	}
	/**
	 * Multiply by translation matrix.
	 * @param  m matrix to multiply
	 * @param {number} tx x translation.
	 * @param {number} ty y translation.
	 * @param {number} tz z translation.
	 * @param [dst] optional matrix to store result
	 * @return dst or a new matrix if none provided
	 * @memberOf module:webgl-3d-math
	 */
	translate(m, tx, ty, tz, dst = new this.MatType(16)) 
	{
		// This is the optimized version of
		// return multiply(m, translation(tx, ty, tz), dst);

		var m00 = m[0];
		var m01 = m[1];
		var m02 = m[2];
		var m03 = m[3];
		var m10 = m[1 * 4 + 0];
		var m11 = m[1 * 4 + 1];
		var m12 = m[1 * 4 + 2];
		var m13 = m[1 * 4 + 3];
		var m20 = m[2 * 4 + 0];
		var m21 = m[2 * 4 + 1];
		var m22 = m[2 * 4 + 2];
		var m23 = m[2 * 4 + 3];
		var m30 = m[3 * 4 + 0];
		var m31 = m[3 * 4 + 1];
		var m32 = m[3 * 4 + 2];
		var m33 = m[3 * 4 + 3];

		if (m !== dst) 
		{
			dst[ 0] = m00;
			dst[ 1] = m01;
			dst[ 2] = m02;
			dst[ 3] = m03;
			dst[ 4] = m10;
			dst[ 5] = m11;
			dst[ 6] = m12;
			dst[ 7] = m13;
			dst[ 8] = m20;
			dst[ 9] = m21;
			dst[10] = m22;
			dst[11] = m23;
		}

		dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
		dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
		dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
		dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;

		return dst;
	}
	yRotate(m, angleInRadians, dst = new this.MatType(16)) 
	{
		// this is the optimized version of
		// return multiply(m, yRotation(angleInRadians), dst);

		var m00 = m[0 * 4 + 0];
		var m01 = m[0 * 4 + 1];
		var m02 = m[0 * 4 + 2];
		var m03 = m[0 * 4 + 3];
		var m20 = m[2 * 4 + 0];
		var m21 = m[2 * 4 + 1];
		var m22 = m[2 * 4 + 2];
		var m23 = m[2 * 4 + 3];
		var c = Math.cos(angleInRadians);
		var s = Math.sin(angleInRadians);

		dst[ 0] = c * m00 - s * m20;
		dst[ 1] = c * m01 - s * m21;
		dst[ 2] = c * m02 - s * m22;
		dst[ 3] = c * m03 - s * m23;
		dst[ 8] = c * m20 + s * m00;
		dst[ 9] = c * m21 + s * m01;
		dst[10] = c * m22 + s * m02;
		dst[11] = c * m23 + s * m03;

		if (m !== dst) 
		{
			dst[ 4] = m[ 4];
			dst[ 5] = m[ 5];
			dst[ 6] = m[ 6];
			dst[ 7] = m[ 7];
			dst[12] = m[12];
			dst[13] = m[13];
			dst[14] = m[14];
			dst[15] = m[15];
		}

		return dst;
	}
	/**
	 * Multiply by an z rotation matrix
	 * @param m matrix to multiply
	 * @param {number} angleInRadians amount to rotate
	 * @param [dst] optional matrix to store result
	 * @return dst or a new matrix if none provided
	 * @memberOf module:webgl-3d-math
	 */
	zRotate(m, angleInRadians, dst = new this.MatType(16)) 
	{
		// This is the optimized version of
		// return multiply(m, zRotation(angleInRadians), dst);

		var m00 = m[0 * 4 + 0];
		var m01 = m[0 * 4 + 1];
		var m02 = m[0 * 4 + 2];
		var m03 = m[0 * 4 + 3];
		var m10 = m[1 * 4 + 0];
		var m11 = m[1 * 4 + 1];
		var m12 = m[1 * 4 + 2];
		var m13 = m[1 * 4 + 3];
		var c = Math.cos(angleInRadians);
		var s = Math.sin(angleInRadians);

		dst[ 0] = c * m00 + s * m10;
		dst[ 1] = c * m01 + s * m11;
		dst[ 2] = c * m02 + s * m12;
		dst[ 3] = c * m03 + s * m13;
		dst[ 4] = c * m10 - s * m00;
		dst[ 5] = c * m11 - s * m01;
		dst[ 6] = c * m12 - s * m02;
		dst[ 7] = c * m13 - s * m03;

		if (m !== dst) {
		dst[ 8] = m[ 8];
		dst[ 9] = m[ 9];
		dst[10] = m[10];
		dst[11] = m[11];
		dst[12] = m[12];
		dst[13] = m[13];
		dst[14] = m[14];
		dst[15] = m[15];
	}

	return dst;
	}	

	/**
	 * Creates a lookAt matrix.
	 * This is a world matrix for a camera. In other words it will transform
	 * from the origin to a place and orientation in the world. For a view
	 * matrix take the inverse of this.
	 * @param cameraPosition position of the camera
	 * @param target position of the target
	 * @param up direction
	 * @param [dst] optional matrix to store result
	 * @return dst or a new matrix if none provided
	 * @memberOf module:webgl-3d-math
	 */
	lookAt(cameraPosition, target, up, dst = new this.MatType(16)) 
	{
		var zAxis = this.normalize(
			this.subtractVectors(cameraPosition, target));
		var xAxis = this.normalize(this.cross(up, zAxis));
		var yAxis = this.normalize(this.cross(zAxis, xAxis));

		dst[ 0] = xAxis[0];
		dst[ 1] = xAxis[1];
		dst[ 2] = xAxis[2];
		dst[ 3] = 0;
		dst[ 4] = yAxis[0];
		dst[ 5] = yAxis[1];
		dst[ 6] = yAxis[2];
		dst[ 7] = 0;
		dst[ 8] = zAxis[0];
		dst[ 9] = zAxis[1];
		dst[10] = zAxis[2];
		dst[11] = 0;
		dst[12] = cameraPosition[0];
		dst[13] = cameraPosition[1];
		dst[14] = cameraPosition[2];
		dst[15] = 1;

		return dst;
	}

	/**
	 * Computes the inverse of a matrix.
	 * @param m matrix to compute inverse of
	 * @param [dst] optional matrix to store result
	 * @return dst or a new matrix if none provided
	 * @memberOf module:webgl-3d-math
	 */
	inverse(m, dst = new this.MatType(16)) 
	{
		var m00 = m[0 * 4 + 0];
		var m01 = m[0 * 4 + 1];
		var m02 = m[0 * 4 + 2];
		var m03 = m[0 * 4 + 3];
		var m10 = m[1 * 4 + 0];
		var m11 = m[1 * 4 + 1];
		var m12 = m[1 * 4 + 2];
		var m13 = m[1 * 4 + 3];
		var m20 = m[2 * 4 + 0];
		var m21 = m[2 * 4 + 1];
		var m22 = m[2 * 4 + 2];
		var m23 = m[2 * 4 + 3];
		var m30 = m[3 * 4 + 0];
		var m31 = m[3 * 4 + 1];
		var m32 = m[3 * 4 + 2];
		var m33 = m[3 * 4 + 3];
		var tmp_0  = m22 * m33;
		var tmp_1  = m32 * m23;
		var tmp_2  = m12 * m33;
		var tmp_3  = m32 * m13;
		var tmp_4  = m12 * m23;
		var tmp_5  = m22 * m13;
		var tmp_6  = m02 * m33;
		var tmp_7  = m32 * m03;
		var tmp_8  = m02 * m23;
		var tmp_9  = m22 * m03;
		var tmp_10 = m02 * m13;
		var tmp_11 = m12 * m03;
		var tmp_12 = m20 * m31;
		var tmp_13 = m30 * m21;
		var tmp_14 = m10 * m31;
		var tmp_15 = m30 * m11;
		var tmp_16 = m10 * m21;
		var tmp_17 = m20 * m11;
		var tmp_18 = m00 * m31;
		var tmp_19 = m30 * m01;
		var tmp_20 = m00 * m21;
		var tmp_21 = m20 * m01;
		var tmp_22 = m00 * m11;
		var tmp_23 = m10 * m01;

		var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
			(tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
		var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
			(tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
		var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
			(tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
		var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
			(tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

		var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

		dst[0] = d * t0;
		dst[1] = d * t1;
		dst[2] = d * t2;
		dst[3] = d * t3;
		dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
				(tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
		dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
				(tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
		dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
				(tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
		dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
				(tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
		dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
				(tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
		dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
				(tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
		dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
				(tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
		dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
				(tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
		dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
				(tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
		dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
				(tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
		dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
				(tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
		dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
				(tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

		return dst;
	}
	/**
	 * Takes two 4-by-4 matrices, a and b, and computes the product in the order
	 * that pre-composes b with a.  In other words, the matrix returned will
	 * transform by b first and then a.  Note this is subtly different from just
	 * multiplying the matrices together.  For given a and b, this function returns
	 * the same object in both row-major and column-major mode.
	 * @param a A matrix.
	 * @param b A matrix.
	 * @param [dst] optional matrix to store result
	 * @return dst or a new matrix if none provided
	 */
	multiply(a, b, dst = new this.MatType(16)) 
	{
		var b00 = b[0 * 4 + 0];
		var b01 = b[0 * 4 + 1];
		var b02 = b[0 * 4 + 2];
		var b03 = b[0 * 4 + 3];
		var b10 = b[1 * 4 + 0];
		var b11 = b[1 * 4 + 1];
		var b12 = b[1 * 4 + 2];
		var b13 = b[1 * 4 + 3];
		var b20 = b[2 * 4 + 0];
		var b21 = b[2 * 4 + 1];
		var b22 = b[2 * 4 + 2];
		var b23 = b[2 * 4 + 3];
		var b30 = b[3 * 4 + 0];
		var b31 = b[3 * 4 + 1];
		var b32 = b[3 * 4 + 2];
		var b33 = b[3 * 4 + 3];
		var a00 = a[0 * 4 + 0];
		var a01 = a[0 * 4 + 1];
		var a02 = a[0 * 4 + 2];
		var a03 = a[0 * 4 + 3];
		var a10 = a[1 * 4 + 0];
		var a11 = a[1 * 4 + 1];
		var a12 = a[1 * 4 + 2];
		var a13 = a[1 * 4 + 3];
		var a20 = a[2 * 4 + 0];
		var a21 = a[2 * 4 + 1];
		var a22 = a[2 * 4 + 2];
		var a23 = a[2 * 4 + 3];
		var a30 = a[3 * 4 + 0];
		var a31 = a[3 * 4 + 1];
		var a32 = a[3 * 4 + 2];
		var a33 = a[3 * 4 + 3];
		dst[ 0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
		dst[ 1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
		dst[ 2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
		dst[ 3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
		dst[ 4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
		dst[ 5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
		dst[ 6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
		dst[ 7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
		dst[ 8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
		dst[ 9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
		dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
		dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
		dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
		dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
		dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
		dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
		return dst;
	}
	/**
	 * Computes a 4-by-4 perspective transformation matrix given the angular height
	 * of the frustum, the aspect ratio, and the near and far clipping planes.  The
	 * arguments define a frustum extending in the negative z direction.  The given
	 * angle is the vertical angle of the frustum, and the horizontal angle is
	 * determined to produce the given aspect ratio.  The arguments near and far are
	 * the distances to the near and far clipping planes.  Note that near and far
	 * are not z coordinates, but rather they are distances along the negative
	 * z-axis.  The matrix generated sends the viewing frustum to the unit box.
	 * We assume a unit box extending from -1 to 1 in the x and y dimensions and
	 * from -1 to 1 in the z dimension.
	 * @param {number} fieldOfViewInRadians field of view in y axis.
	 * @param {number} aspect aspect of viewport (width / height)
	 * @param {number} near near Z clipping plane
	 * @param {number} far far Z clipping plane
	 * @param [dst] optional matrix to store result
	 * @return dst or a new matrix if none provided
	 * @memberOf module:webgl-3d-math
	 */
	perspective(fieldOfViewInRadians, aspect, near, far, dst = new this.MatType(16)) 
	{
		//dst = dst || new this.MatType(16);
		var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
		var rangeInv = 1.0 / (near - far);

		dst[0] = f / aspect;
		dst[1] = 0;
		dst[2] = 0;
		dst[3] = 0;
		dst[4] = 0;
		dst[5] = f;
		dst[6] = 0;
		dst[7] = 0;
		dst[8] = 0;
		dst[9] = 0;
		dst[10] = (near + far) * rangeInv;
		dst[11] = -1;
		dst[12] = 0;
		dst[13] = 0;
		dst[14] = near * far * rangeInv * 2;
		dst[15] = 0;

		return dst;
	}

	/**
	 * Computes a 4-by-4 orthographic projection matrix given the coordinates of the
	 * planes defining the axis-aligned, box-shaped viewing volume.  The matrix
	 * generated sends that box to the unit box.  Note that although left and right
	 * are x coordinates and bottom and top are y coordinates, near and far
	 * are not z coordinates, but rather they are distances along the negative
	 * z-axis.  We assume a unit box extending from -1 to 1 in the x and y
	 * dimensions and from -1 to 1 in the z dimension.
	 * @param {number} left The x coordinate of the left plane of the box.
	 * @param {number} right The x coordinate of the right plane of the box.
	 * @param {number} bottom The y coordinate of the bottom plane of the box.
	 * @param {number} top The y coordinate of the right plane of the box.
	 * @param {number} near The negative z coordinate of the near plane of the box.
	 * @param {number} far The negative z coordinate of the far plane of the box.
	 * @param [dst] optional matrix to store result
	 * @return dst or a new matrix if none provided
	 * @memberOf module:webgl-3d-math
	 */
	orthographic(left, right, bottom, top, near, far, dst = new this.MatType(16)) 
	{
		//dst = dst || new MatType(16);

		dst[ 0] = 2 / (right - left);
		dst[ 1] = 0;
		dst[ 2] = 0;
		dst[ 3] = 0;
		dst[ 4] = 0;
		dst[ 5] = 2 / (top - bottom);
		dst[ 6] = 0;
		dst[ 7] = 0;
		dst[ 8] = 0;
		dst[ 9] = 0;
		dst[10] = 2 / (near - far);
		dst[11] = 0;
		dst[12] = (left + right) / (left - right);
		dst[13] = (bottom + top) / (bottom - top);
		dst[14] = (near + far) / (near - far);
		dst[15] = 1;

		return dst;
	}

	/**
	 * normalizes a vector.
	 * @param v vector to normalize
	 * @param dst optional vector3 to store result
	 * @return dst or new Vector3 if not provided
	 * @memberOf module:webgl-3d-math
	 */
	normalize(v, dst = new this.MatType(3)) 
	{
		var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
		// make sure we don't divide by 0.
		if (length > 0.00001) 
		{
			dst[0] = v[0] / length;
			dst[1] = v[1] / length;
			dst[2] = v[2] / length;
		}
		return dst;
	}
	/**
	 * subtracts 2 vectors3s
	 * @param a a
	 * @param b b
	 * @param dst optional vector3 to store result
	 * @return dst or new Vector3 if not provided
	 * @memberOf module:webgl-3d-math
	 */
	subtractVectors(a, b, dst = new this.MatType(3)) 
	{
		dst[0] = a[0] - b[0];
		dst[1] = a[1] - b[1];
		dst[2] = a[2] - b[2];
		return dst;
	}
	/**
	 * Computes the cross product of 2 vectors3s
	 * @param a a
	 * @param b b
	 * @param dst optional vector3 to store result
	 * @return dst or new Vector3 if not provided
	 * @memberOf module:webgl-3d-math
	 */
	cross(a, b, dst = new this.MatType(3)) 
	{
		//dst = dst || new this.MatType(3);
		dst[0] = a[1] * b[2] - a[2] * b[1];
		dst[1] = a[2] * b[0] - a[0] * b[2];
		dst[2] = a[0] * b[1] - a[1] * b[0];
		return dst;
	}
	/**
	 * Transposes a matrix.
	 * @param m matrix to transpose.
	 * @param [dst] optional matrix to store result
	 * @return dst or a new matrix if none provided
	 * @memberOf module:webgl-3d-math
	 */
	transpose(m, dst = new this.MatType(16)) 
	{

		dst[ 0] = m[0];
		dst[ 1] = m[4];
		dst[ 2] = m[8];
		dst[ 3] = m[12];
		dst[ 4] = m[1];
		dst[ 5] = m[5];
		dst[ 6] = m[9];
		dst[ 7] = m[13];
		dst[ 8] = m[2];
		dst[ 9] = m[6];
		dst[10] = m[10];
		dst[11] = m[14];
		dst[12] = m[3];
		dst[13] = m[7];
		dst[14] = m[11];
		dst[15] = m[15];

		return dst;
	}
}
