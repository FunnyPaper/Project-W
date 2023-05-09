#version 300 es

layout (location = 0) in vec4 aColors;
layout (location = 1) in vec3 aVertices;
layout (location = 2) in vec2 aUvs;
uniform mat4 mvp;

out vec4 vColors;
out vec2 vUvs;

void main()
{
	vColors = aColors;
    vUvs = aUvs;
    gl_Position = mvp * vec4(aVertices, 1.0);
}
