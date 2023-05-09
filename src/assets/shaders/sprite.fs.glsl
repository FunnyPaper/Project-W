#version 300 es
precision mediump float;

in vec4 vColors;
in vec2 vUvs;
uniform sampler2D uTexture;
uniform int textureSet;
uniform vec4 uColor;

out vec4 color;

void main()
{
	if(textureSet == 1) {
    	color = uColor* texture(uTexture, vUvs) * vColors;
	} else {
    	color = vColors;
	}
}
