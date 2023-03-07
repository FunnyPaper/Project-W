#version 300 es
precision mediump float;

in vec2 vTexture;
uniform sampler2D sampler;
out vec4 aColor;

void main()
{
    aColor = texture(sampler, vTexture);
}
